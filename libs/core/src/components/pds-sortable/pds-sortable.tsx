import { Component, Element, Event, EventEmitter, forceUpdate, Host, h, Listen, Prop, Watch } from '@stencil/core';
import type { SortableEvent } from 'sortablejs';
import { SortableType } from './sortable-interface';
import { sortableItemLabel } from './sortable-label';
import { HostStylingKeeper } from '../../utils/attributes';
import { formatMessage } from '../../i18n';
import Sortable from 'sortablejs';

const LIVE_REGION_CLASS = 'pds-sortable__live-region';
const GRABBED_CLASS = 'pds-sortable-item--grabbed';
const HANDLE_SELECTOR = '.pds-sortable-item__handle';

/**
 * @lightDom host-only
 */
@Component({
  tag: 'pds-sortable',
  styleUrls: ['pds-sortable.scss'],
  scoped: true,
})
export class PdsSortable {
  @Element() el: HTMLPdsSortableElement;

  /**
   * Event emitted when a sortable item is moved, by dragging or from the keyboard. A keyboard move
   * carries the same fields as a drag (`item`, `from`, `to`, `oldIndex`, `newIndex`,
   * `oldDraggableIndex`, `newDraggableIndex`), with the `KeyboardEvent` as `originalEvent`.
   */
  @Event() pdsSortableItemMoved: EventEmitter<SortableEvent>;

  /**
   * Determines whether `sortable` should have a border.
   * @defaultValue false
   */
  @Prop({ reflect: true }) border = false;

  /**
   * Determines whether or not the sortable is disabled.
   * @defaultValue false
   */
  @Prop({ reflect: true }) disabled = false;

  /**
   * A unique identifier used for the sortable container `id` attribute.
   */
  @Prop() componentId!: string;

  /**
   * Determines whether `sortable` items should be divided with border.
   */
  @Prop({ reflect: true }) dividers = false;

  /**
   * Determines the grabbable area for the `pds-sortable-item`.
   */
  @Prop() handleType: 'handle' | 'row' = 'row';

  /**
   * Accessible label for each item's reorder handle, the button the keyboard reorders with. Pass a translated string to localize it; `{item}` is interpolated.
   * @defaultValue 'Reorder {item}'
   */
  @Prop() handleLabel = 'Reorder {item}';

  /**
   * Screen-reader announcement when an item is picked up from the keyboard. Pass a translated string to localize it; `{item}`, `{position}` and `{total}` are interpolated.
   * @defaultValue '{item}, picked up. Position {position} of {total}. Press the arrow keys to move, Space or Enter to drop, Escape to cancel.'
   */
  @Prop() itemPickedUpLabel =
    '{item}, picked up. Position {position} of {total}. Press the arrow keys to move, Space or Enter to drop, Escape to cancel.';

  /**
   * Screen-reader announcement when a picked-up item is moved. Pass a translated string to localize it; `{item}`, `{position}` and `{total}` are interpolated.
   * @defaultValue '{item}, moved to position {position} of {total}'
   */
  @Prop() itemMovedLabel = '{item}, moved to position {position} of {total}';

  /**
   * Screen-reader announcement when a picked-up item is dropped. Pass a translated string to localize it; `{item}`, `{position}` and `{total}` are interpolated.
   * @defaultValue '{item}, dropped at position {position} of {total}'
   */
  @Prop() itemDroppedLabel = '{item}, dropped at position {position} of {total}';

  /**
   * Screen-reader announcement when a keyboard reorder is canceled and the item goes back. Pass a translated string to localize it; `{item}`, `{position}` and `{total}` are interpolated.
   * @defaultValue 'Reorder canceled. {item} returned to position {position} of {total}'
   */
  @Prop() reorderCanceledLabel = 'Reorder canceled. {item} returned to position {position} of {total}';

  private sortableInstance: InstanceType<typeof Sortable>;

  /** The item picked up from the keyboard, and where it started. */
  private grabbed: { item: HTMLElement; oldIndex: number; oldDraggableIndex: number } | null = null;

  private liveRegion: HTMLElement | null = null;

  @Watch('disabled')
  handleDisabledChange() {
    this.sortableInstance?.option('disabled', this.disabled);
    if (this.disabled && this.isGrabbing()) this.cancel();
    this.updateItems();
  }

  @Watch('handleType')
  handleHandleTypeChange() {
    if (this.isGrabbing()) this.cancel();
    this.sortableInstance?.option('handle', this.handleType === 'handle' ? HANDLE_SELECTOR : undefined);
    this.updateItems();
  }

  @Watch('handleLabel')
  updateItems() {
    this.items().forEach((item) => {
      if (item.tagName === 'PDS-SORTABLE-ITEM') forceUpdate(item);
    });
  }

  private classNames() {
    const classNames = ['pds-sortable'];

    if (this.border) {
      classNames.push('pds-sortable--bordered');
    }

    if (this.disabled) {
      classNames.push('pds-sortable--disabled');
    }

    if (this.dividers) {
      classNames.push('pds-sortable--divided');
    }

    if (this.handleType !== undefined) {
      classNames.push(`pds-sortable--handle-type-${this.handleType}`);
    }

    return classNames.join('  ');
  }

  private hostKeeper = new HostStylingKeeper();

  connectedCallback() {
    this.hostKeeper.connect(this.el);
  }

  disconnectedCallback() {
    this.hostKeeper.disconnect();
    // Put the order back: a move that was never dropped was never emitted.
    if (this.isGrabbing()) this.cancel(false);
    this.liveRegion?.remove();
    this.liveRegion = null;
  }

  componentDidLoad() {
    const reduceMotion =
      typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    let sortableOptions: SortableType = {
      animation: reduceMotion ? 0 : 150,
      disabled: this.disabled,
      ghostClass: 'pds-sortable-item--ghost',
      dragClass: 'pds-sortable-item--drag',
      onEnd: (evt) => {
        this.pdsSortableItemMoved.emit(evt);
      },
    };

    if (this.handleType === 'handle') {
      sortableOptions = {
        ...sortableOptions,
        handle: HANDLE_SELECTOR,
      };
    }

    this.sortableInstance = Sortable.create(this.el as HTMLElement, sortableOptions);
    // In place before the first announcement, as a region that's created with its text isn't read.
    this.ensureLiveRegion();
    // Items that rendered before this list was defined have no handle yet.
    this.updateItems();
  }

  /** The children that can be reordered, counted as SortableJS counts them. */
  private items(): HTMLElement[] {
    return Array.from(this.el.children).filter((child) => child.tagName !== 'TEMPLATE') as HTMLElement[];
  }

  /**
   * The live region sits right after the list, not in it, so it's never counted as an item, by
   * SortableJS or by a consumer reading the list's children, and it's still in the same modal. A
   * morph that removes it gets it put back on the next focus.
   */
  private ensureLiveRegion() {
    if (!this.liveRegion) {
      const region = document.createElement('span');
      region.className = LIVE_REGION_CLASS;
      region.setAttribute('role', 'status');
      region.setAttribute('aria-live', 'polite');
      region.setAttribute('aria-atomic', 'true');
      // Created here, not rendered, so the scoped stylesheet can't reach it.
      Object.assign(region.style, {
        position: 'absolute',
        width: '1px',
        height: '1px',
        margin: '-1px',
        padding: '0',
        overflow: 'hidden',
        clipPath: 'inset(50%)',
        whiteSpace: 'nowrap',
        border: '0',
      });
      this.liveRegion = region;
    }

    if (!this.liveRegion.isConnected && this.el.parentNode) {
      // The host may itself be slotted into a named slot (e.g. inside a modal); stay in it rather
      // than falling back to the default slot, which a consumer's template may not render.
      const hostSlot = this.el.getAttribute('slot');
      if (hostSlot !== null) {
        this.liveRegion.setAttribute('slot', hostSlot);
      } else {
        this.liveRegion.removeAttribute('slot');
      }
      this.el.parentNode.insertBefore(this.liveRegion, this.el.nextSibling);
    }
  }

  private announce(template: string, item: HTMLElement) {
    this.ensureLiveRegion();
    const items = this.items();
    const message = formatMessage(template, {
      item: sortableItemLabel(item),
      position: items.indexOf(item) + 1,
      total: items.length,
    });
    // A repeat of the same text isn't announced again, so tell the two apart.
    this.liveRegion.textContent = message === this.liveRegion.textContent ? `${message} ` : message;
  }

  @Listen('pointerdown', { capture: true })
  handlePointerDown(ev: PointerEvent) {
    // A drag takes over from a keyboard reorder: keep the moves so far, so the drag starts from them.
    if (this.isGrabbing()) this.drop(ev);
  }

  private handleFocusIn = () => {
    this.ensureLiveRegion();
  };

  /**
   * Focus leaving a picked-up item drops it where it is, unless the whole window lost focus (the user
   * switched apps), when the item stays picked up for their return. A real window blur does not move
   * `document.activeElement` away from the handle that's losing focus (some browsers reset it to `body`
   * instead, but never to a different element), so it's told apart from focus moving into an iframe or
   * another embedded document that way: an iframe becomes a genuinely different active element, while a
   * window blur leaves `activeElement` as the handle itself, `null`, or `body`.
   */
  private handleFocusOut = (ev: FocusEvent) => {
    if (!this.isGrabbing() || ev.target !== this.focusTarget(this.grabbed.item)) return;
    const nothingElseFocused =
      document.activeElement === null || document.activeElement === document.body || document.activeElement === ev.target;
    if (ev.relatedTarget === null && document.hasFocus?.() === false && nothingElseFocused) return;
    this.drop(ev);
  };

  /**
   * Whether an item is picked up. One that's been taken out of the list meanwhile (a re-render, a
   * stream update) is let go, as there's nothing left to move.
   */
  private isGrabbing(): boolean {
    if (this.grabbed && this.grabbed.item.parentElement !== this.el) this.release();
    return this.grabbed !== null;
  }

  /**
   * Screen readers in browse mode turn Enter and Space on a button into a click with no key events,
   * so a click that isn't from a pointer (`detail` is 0) picks up or drops too.
   */
  private handleClick = (ev: MouseEvent) => {
    if (this.disabled || ev.detail !== 0) return;
    const item = this.targetItem(ev.target as HTMLElement);
    if (!item) return;

    if (!this.isGrabbing()) {
      this.pickUp(item);
    } else if (this.grabbed.item === item) {
      this.drop(ev);
    }
  };

  /** The item whose handle `target` is, if it is one. */
  private targetItem(target: HTMLElement): HTMLElement | undefined {
    const item = this.items().find((candidate) => candidate.contains(target));
    return item && this.focusTarget(item) === target ? item : undefined;
  }

  private handleKeyDown = (ev: KeyboardEvent) => {
    if (this.disabled || ev.altKey || ev.ctrlKey || ev.metaKey) return;

    const item = this.targetItem(ev.target as HTMLElement);
    if (!item) return;

    if (!this.isGrabbing()) {
      if ((ev.key === ' ' || ev.key === 'Enter') && !ev.repeat) {
        ev.preventDefault();
        this.pickUp(item);
      }
      return;
    }

    if (this.grabbed.item !== item) return;

    const items = this.items();
    const index = items.indexOf(item);

    switch (ev.key) {
      case 'ArrowUp':
        ev.preventDefault();
        this.moveTo(item, index - 1);
        break;
      case 'ArrowDown':
        ev.preventDefault();
        this.moveTo(item, index + 1);
        break;
      case 'Home':
        ev.preventDefault();
        this.moveTo(item, 0);
        break;
      case 'End':
        ev.preventDefault();
        this.moveTo(item, items.length - 1);
        break;
      case ' ':
      case 'Enter':
        ev.preventDefault();
        if (!ev.repeat) this.drop(ev);
        break;
      case 'Escape':
        // Keep an enclosing modal or drawer from closing too.
        ev.preventDefault();
        ev.stopPropagation();
        this.cancel();
        break;
    }
  };

  /** The item's handle, the button the keyboard reorders with. */
  private focusTarget(item: HTMLElement): HTMLElement | null {
    return (Array.from(item.children).find((child) => child.matches(HANDLE_SELECTOR)) ?? null) as HTMLElement | null;
  }

  /** Where an item sits among all the children, then among the items, as SortableJS counts them. */
  private indexes(item: HTMLElement) {
    const children = Array.from(this.el.children).filter((child) => child.tagName !== 'TEMPLATE');
    return { index: children.indexOf(item), draggableIndex: this.items().indexOf(item) };
  }

  private pickUp(item: HTMLElement) {
    const { index, draggableIndex } = this.indexes(item);
    this.grabbed = { item, oldIndex: index, oldDraggableIndex: draggableIndex };
    item.classList.add(GRABBED_CLASS);
    this.focusTarget(item)?.setAttribute('aria-pressed', 'true');
    this.announce(this.itemPickedUpLabel, item);
  }

  /**
   * Moves the other items around `item` rather than `item` itself, so it never leaves the DOM and
   * keeps focus.
   */
  private moveTo(item: HTMLElement, to: number, announce = true) {
    const items = this.items();
    const from = items.indexOf(item);
    if (to < 0 || to >= items.length || to === from) return;

    if (to < from) {
      const next = item.nextSibling;
      items.slice(to, from).forEach((sibling) => this.el.insertBefore(sibling, next));
    } else {
      items.slice(from + 1, to + 1).forEach((sibling) => this.el.insertBefore(sibling, item));
    }
    // Focus doesn't move, so the browser won't scroll the item into view itself.
    item.scrollIntoView?.({ block: 'nearest' });

    if (announce) this.announce(this.itemMovedLabel, item);
  }

  private drop(originalEvent: Event) {
    const { item, oldIndex, oldDraggableIndex } = this.grabbed;
    this.release();
    this.announce(this.itemDroppedLabel, item);

    const { index, draggableIndex } = this.indexes(item);
    // The same shape SortableJS gives `onEnd`, so a listener can't tell a keyboard move from a drag.
    const detail = Object.assign(new CustomEvent('end', { bubbles: true, cancelable: true }), {
      item,
      from: this.el,
      to: this.el,
      oldIndex,
      newIndex: index,
      oldDraggableIndex,
      newDraggableIndex: draggableIndex,
      originalEvent,
      pullMode: undefined,
    }) as unknown as SortableEvent;
    this.pdsSortableItemMoved.emit(detail);
  }

  private cancel(announce = true) {
    const { item, oldDraggableIndex } = this.grabbed;
    this.release();
    // Items may have come or gone meanwhile, so go back as near the start as the list allows.
    this.moveTo(item, Math.min(oldDraggableIndex, this.items().length - 1), false);
    if (announce) this.announce(this.reorderCanceledLabel, item);
  }

  private release() {
    this.grabbed.item.classList.remove(GRABBED_CLASS);
    this.focusTarget(this.grabbed.item)?.setAttribute('aria-pressed', 'false');
    this.grabbed = null;
  }

  render() {
    const classNames = this.classNames();
    this.hostKeeper.record(classNames);

    return (
      <Host
        class={classNames}
        id={this.componentId}
        onFocusin={this.handleFocusIn}
        onFocusout={this.handleFocusOut}
        onKeyDown={this.handleKeyDown}
        onClick={this.handleClick}
      >
        <slot></slot>
      </Host>
    );
  }
}
