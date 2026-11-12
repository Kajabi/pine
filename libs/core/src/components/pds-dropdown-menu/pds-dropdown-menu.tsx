import { Component, Element, Host, h, Prop, Listen, State } from '@stencil/core';
import type { BasePdsProps } from '@utils/interfaces';
import { PlacementType } from '@utils/types';
import { setAttributesIfChanged } from '@utils/attributes';
import { limitRestores } from '@utils/keep-hydrated';
import {  computePosition,
  flip,
  offset,
  shift,
  size,
  autoUpdate,
} from '@floating-ui/dom';

/**
 * Union type for focusable menu items (component or raw elements)
 */
type MenuItemElement = HTMLPdsDropdownMenuItemElement | HTMLAnchorElement | HTMLButtonElement;

/**
 * @slot trigger - The trigger element for the dropdown menu. It receives `aria-expanded` and `aria-haspopup`, so slot the focusable control itself, such as a `pds-button`, not a wrapper around it.
 * @slot (default) - The menu items: `pds-dropdown-menu-item` and `pds-dropdown-menu-separator` elements, or raw `<a>` and `<button>` elements.
 * @slot header - Non-interactive content displayed above the menu items inside the dropdown panel. It renders outside the menu role, so assistive tech reads it as plain content rather than as a menu item.
 * @part menu-panel - Exposes the dropdown menu container for styling.
 */
@Component({
  tag: 'pds-dropdown-menu',
  styleUrl: 'pds-dropdown-menu.scss',
  shadow: true,
})
export class PdsDropdownMenu implements BasePdsProps {
  private slotEl: HTMLSlotElement;
  private triggerEl: HTMLElement;
  private panelEl: HTMLPdsBoxElement;
  private isOpen: boolean = false;
  private menuItems: MenuItemElement[] = [];
  private cleanupAutoUpdate: (() => void) | null = null;
  // Counts each opening, so a position worked out for an earlier opening is ignored.
  private openCount = 0;
  private triggerObserver: MutationObserver | null = null;
  private triggerVisibility: IntersectionObserver | null = null;

  @Element() host: HTMLPdsDropdownMenuElement;

  @State() currentFocusIndex: number = -1;

  @State() hasHeader: boolean = false;

  /**
   * A unique identifier used for the underlying component `id` attribute.
   */
  @Prop() componentId: string;

  /**
   * The placement of the dropdown panel relative to the trigger.
   */
  @Prop() placement: PlacementType = 'bottom-start';

  componentWillLoad() {
    this.hasHeader = Array.from(this.host.children).some(el => el.getAttribute('slot') === 'header');
  }

  componentDidRender() {
    this.panelEl = this.host.shadowRoot?.querySelector('pds-box') as HTMLPdsBoxElement;
  }

  connectedCallback() {
    // Moved within the page, the trigger slot doesn't change, so watch the same trigger again, and
    // fix anything changed while the menu was detached and unobserved.
    this.observeTrigger();
    this.syncTriggerAria();
  }

  disconnectedCallback() {
    // Clean up auto-update when component is removed from DOM
    if (this.cleanupAutoUpdate) {
      this.cleanupAutoUpdate();
      this.cleanupAutoUpdate = null;
    }

    this.triggerObserver?.disconnect();
    this.triggerObserver = null;
    this.stopWatchingTriggerVisibility();

    // The menu was detached, so a position still being worked out for it is dropped. The menu
    // itself stays open.
    this.openCount++;
  }

  private handleTriggerSlotChange = (event: Event) => {
    this.slotEl = event.target as HTMLSlotElement;

    // Get all elements assigned to this slot
    const assignedElements = this.slotEl.assignedElements();

    this.triggerEl = assignedElements[0] as HTMLElement;
    if (this.triggerEl) {
      this.triggerEl.onclick = this.handleClick;
      this.syncTriggerAria();
    }
    this.observeTrigger();
  }

  // Writes the trigger's ARIA from the menu's state, so the observer's own callback doesn't loop.
  private syncTriggerAria = () => {
    if (!this.triggerEl) return false;

    return setAttributesIfChanged(this.triggerEl, { 'aria-haspopup': 'menu', 'aria-expanded': String(this.isOpen) });
  }

  // The trigger is the consumer's element, so anything can rewrite its attributes (a Turbo morph
  // matches it to server HTML that has no ARIA). Put Pine's values back when that happens.
  private observeTrigger() {
    this.triggerObserver?.disconnect();
    this.triggerObserver = null;
    if (!this.triggerEl || typeof MutationObserver === 'undefined') return;

    // Capped against a script that keeps undoing it; opening and closing still write it directly.
    this.triggerObserver = new MutationObserver(
      limitRestores(
        this.syncTriggerAria,
        'pds-dropdown-menu: stopped restoring its trigger ARIA, as another script keeps changing it. It may be wrong until the menu opens or closes.',
        this.triggerEl,
      ),
    );
    this.triggerObserver.observe(this.triggerEl, {
      attributes: true,
      attributeFilter: ['aria-haspopup', 'aria-expanded'],
    });
  }

  private handleHeaderSlotChange = (event: Event) => {
    this.hasHeader = (event.target as HTMLSlotElement).assignedElements().length > 0;
  }

  private handleSlotChange = (event: Event) => {
    this.slotEl = event.target as HTMLSlotElement;

    // Get all elements assigned to this slot
    const assignedElements = this.slotEl.assignedElements();

    // Allowed elements: pds-dropdown-menu-item, pds-dropdown-menu-separator, <a>, <button>
    // Raw <a> and <button> elements are allowed for edge cases requiring native browser/framework
    // behavior (e.g., Rails UJS, Turbo) that cannot work through Shadow DOM.
    const allowedTags = ['pds-dropdown-menu-item', 'pds-dropdown-menu-separator', 'a', 'button'];
    const invalidElements = assignedElements.filter(
      el => !allowedTags.includes(el.tagName.toLowerCase())
    );

    if (invalidElements.length > 0) {
      const invalidTags = invalidElements.map(el => el.tagName.toLowerCase()).join(', ');
      console.warn(
        `pds-dropdown-menu: Unexpected element(s) found: ${invalidTags}. ` +
        `Expected: ${allowedTags.join(', ')}`
      );
    }

    // Store all focusable items for keyboard navigation
    // This includes pds-dropdown-menu-item components and raw <a>/<button> elements
    this.menuItems = assignedElements.filter(el => {
      const tag = el.tagName.toLowerCase();
      return tag === 'pds-dropdown-menu-item' || tag === 'a' || tag === 'button';
    }) as MenuItemElement[];
  }

  // Toggle dropdown open/closed
  private toggleDropdown = () => {
    this.isOpen = !this.isOpen;

    if (this.isOpen) {
      this.openDropdown();
    } else {
      this.closeDropdown();
    }
  }

  // Open the dropdown and position it
  private openDropdown = () => {
    const opening = ++this.openCount;

    const updatePosition = () => {
      computePosition(this.triggerEl, this.panelEl as HTMLElement, {
        placement: this.placement,
        strategy: 'fixed',
        middleware: [
          offset(6),
          flip(),
          shift({padding: 5}),
          size({ padding: 5, apply: ({ availableHeight, elements }) => this.capPanelHeight(elements.floating, availableHeight) }),
        ],
      }).then(({ x, y }) => {
        if (!this.isOpen || opening !== this.openCount) return;

        Object.assign(this.panelEl.style, {
          left: `${x}px`,
          top: `${y}px`,
        });
      });
    };

    // Initial position
    updatePosition();

    // Set up auto-update for window resize and scroll
    this.cleanupAutoUpdate = autoUpdate(
      this.triggerEl,
      this.panelEl as HTMLElement,
      updatePosition
    );
    this.watchTriggerVisibility();

    this.host.shadowRoot?.querySelector('pds-box').classList.remove('is-hidden');
    this.isOpen = true;
    this.syncTriggerAria();
  }

  // The panel is fixed, so a menu taller than the room beside its trigger would run off the window
  // with no way to reach its last items. It's capped to that room and scrolls inside itself. A
  // smaller max-height set through the menu-panel part is kept. The cap is important, as a
  // ::part() rule outside the shadow root otherwise beats the panel's own inline style.
  private capPanelHeight(panel: HTMLElement, availableHeight: number) {
    panel.style.removeProperty('max-height');
    const partMaxHeight = getComputedStyle(panel).maxHeight;
    const room = `${Math.max(0, availableHeight)}px`;
    panel.style.setProperty('max-height', partMaxHeight === 'none' ? room : `min(${partMaxHeight}, ${room})`, 'important');
  }

  // Once the trigger is fully out of view, scrolled or clipped by any container or the window, the
  // menu closes rather than float away from it, much as a native select's list does. An
  // IntersectionObserver measures against the layout viewport, so panning a pinch-zoomed page
  // doesn't close it, as Floating UI's hide() would.
  private watchTriggerVisibility() {
    this.stopWatchingTriggerVisibility();
    if (typeof IntersectionObserver === 'undefined') return;

    // Only a trigger seen in view this opening closes the menu when it leaves.
    let triggerSeen = false;
    let broughtIntoView = false;

    this.triggerVisibility = new IntersectionObserver((entries) => {
      if (!this.isOpen) return;

      if (entries[entries.length - 1].isIntersecting) {
        triggerSeen = true;
      } else if (triggerSeen) {
        this.closeDropdown({ preventScroll: true });
      } else if (!broughtIntoView) {
        // Opened with its trigger out of view, from the keyboard after an earlier close or from a
        // script, the trigger is scrolled into view so the menu opens beside it. A trigger that
        // still can't be seen leaves the menu open.
        broughtIntoView = true;
        this.triggerEl.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      }
    });
    this.triggerVisibility.observe(this.triggerEl);
  }

  private stopWatchingTriggerVisibility() {
    this.triggerVisibility?.disconnect();
    this.triggerVisibility = null;
  }

  // Close the dropdown. Closed because its trigger left the view, focus from the menu still goes back
  // to the trigger, so it isn't lost, but without scrolling the trigger back into view. The next Tab
  // carries on from there.
  private closeDropdown = ({ preventScroll = false }: { preventScroll?: boolean } = {}) => {
    this.host.shadowRoot?.querySelector('pds-box').classList.add('is-hidden');
    this.isOpen = false;

    // Clean up auto-update
    if (this.cleanupAutoUpdate) {
      this.cleanupAutoUpdate();
      this.cleanupAutoUpdate = null;
    }
    this.stopWatchingTriggerVisibility();

    this.syncTriggerAria();

    // Reset focus index
    this.currentFocusIndex = -1;

    // Return focus to trigger
    if (this.isFocusInMenu()) {
      this.focusTrigger(preventScroll);
    }
  }

  // Outside clicks and scripted closes leave focus where it is; only focus in the menu or on its trigger returns.
  private isFocusInMenu(): boolean {
    const focused = (this.host.getRootNode() as Document | ShadowRoot).activeElement;
    return focused != null && this.host.contains(focused);
  }

  // A trigger whose host can't take focus itself, such as pds-chip, passes it to the control inside.
  private focusTrigger(preventScroll = false) {
    this.triggerEl.focus({ preventScroll });
    if ((this.host.getRootNode() as Document | ShadowRoot).activeElement === this.triggerEl) return;
    this.triggerEl.shadowRoot?.querySelector<HTMLElement>('button, [href], [tabindex]:not([tabindex="-1"])')?.focus({ preventScroll });
  }

  // Handle click on the trigger element
  private handleClick = () => {
    this.toggleDropdown();
  }

  // Check if a menu item is disabled (handles both component and raw elements)
  private isItemDisabled(item: MenuItemElement): boolean {
    const tagName = item.tagName.toLowerCase();

    if (tagName === 'pds-dropdown-menu-item') {
      return (item as HTMLPdsDropdownMenuItemElement).disabled;
    } else if (tagName === 'button') {
      return (item as HTMLButtonElement).disabled;
    } else if (tagName === 'a') {
      return item.getAttribute('aria-disabled') === 'true';
    }
    return false;
  }

  // Get the index of the currently focused menu item
  private getFocusedItemIndex(): number {
    const activeElement = document.activeElement as MenuItemElement | null;
    if (!activeElement) return -1;

    // For raw elements, check direct match
    // For pds-dropdown-menu-item, also check if the active element is inside the shadow root
    return this.menuItems.findIndex(item => {
      if (item === activeElement) return true;

      // Check if activeElement is inside the item's shadow root (for pds-dropdown-menu-item)
      if (item.tagName.toLowerCase() === 'pds-dropdown-menu-item') {
        const shadowRoot = (item as HTMLPdsDropdownMenuItemElement).shadowRoot;
        if (shadowRoot?.contains(activeElement)) return true;
      }

      return false;
    });
  }

  // Focus a specific menu item by index
  private focusItemByIndex(index: number): void {
    if (index >= 0 && index < this.menuItems.length) {
      this.currentFocusIndex = index;
      const item = this.menuItems[index];
      const tagName = item.tagName.toLowerCase();

      if (tagName === 'pds-dropdown-menu-item') {
        // For pds-dropdown-menu-item, focus the inner element
        const menuItem = item as HTMLPdsDropdownMenuItemElement;
        const innerControl = menuItem.shadowRoot?.querySelector<HTMLElement>('button, [role="menuitem"]');
        const innerLink = menuItem.shadowRoot?.querySelector('pds-link')?.shadowRoot?.querySelector('a')
          || menuItem.shadowRoot?.querySelector('a');

        if (innerControl) {
          innerControl.focus();
        } else if (innerLink) {
          innerLink.focus();
        } else {
          // Fallback to focusing the host
          menuItem.focus();
        }
      } else {
        // For raw <a> or <button> elements, focus directly
        (item as HTMLElement).focus();
      }
    }
  }

  // Focus the next menu item
  private focusNextItem(): void {
    let nextIndex = (this.currentFocusIndex + 1) % this.menuItems.length;

    // Skip disabled items
    let attempts = 0;
    const maxAttempts = this.menuItems.length;

    while (attempts < maxAttempts && this.isItemDisabled(this.menuItems[nextIndex])) {
      nextIndex = (nextIndex + 1) % this.menuItems.length;
      attempts++;
    }

    // Only focus if we found a non-disabled item
    if (attempts < maxAttempts) {
      this.focusItemByIndex(nextIndex);
    }
  }

  // Focus the previous menu item
  private focusPreviousItem(): void {
    let prevIndex = this.currentFocusIndex <= 0
      ? this.menuItems.length - 1
      : this.currentFocusIndex - 1;

    // Skip disabled items
    let attempts = 0;
    const maxAttempts = this.menuItems.length;

    while (attempts < maxAttempts && this.isItemDisabled(this.menuItems[prevIndex])) {
      prevIndex = prevIndex <= 0 ? this.menuItems.length - 1 : prevIndex - 1;
      attempts++;
    }

    // Only focus if we found a non-disabled item
    if (attempts < maxAttempts) {
      this.focusItemByIndex(prevIndex);
    }
  }

  // Unlike the arrow keys, Tab stops at either end of the menu instead of wrapping.
  private adjacentEnabledIndex(fromIndex: number, step: 1 | -1): number {
    for (let index = fromIndex + step; index >= 0 && index < this.menuItems.length; index += step) {
      if (!this.isItemDisabled(this.menuItems[index])) return index;
    }
    return -1;
  }

  // An enabled item can still refuse focus (hidden, or a link with no href), so each one is tried in turn.
  private focusAdjacentItem(fromIndex: number, step: 1 | -1): boolean {
    for (let index = this.adjacentEnabledIndex(fromIndex, step); index !== -1; index = this.adjacentEnabledIndex(index, step)) {
      this.focusItemByIndex(index);
      if (this.getFocusedItemIndex() === index) return true;
    }
    return false;
  }

  // Escape is taken in document's capture phase, before a modal around the menu hears it on
  // document and closes too.
  @Listen('keydown', { target: 'document', capture: true })
  handleEscapeKeyDown(event: KeyboardEvent) {
    if (!this.isOpen || event.key !== 'Escape' || event.defaultPrevented) return;
    event.preventDefault();
    this.closeDropdown();
  }

  // Taken in the capture phase, so a modal or popover around the menu that traps Tab finds the key
  // already handled, or focus back on the trigger with the items hidden.
  @Listen('keydown', { target: 'document', capture: true })
  handleTabKeyDown(event: KeyboardEvent) {
    if (!this.isOpen || event.key !== 'Tab' || event.defaultPrevented) return;
    const currentIndex = this.getFocusedItemIndex();
    if (currentIndex === -1) {
      // The menu sits after the trigger, so Shift+Tab from the trigger leaves it behind. So does Shift+Tab
      // from outside the menu, where focus stays after a mouse open in Safari.
      if (event.shiftKey && (document.activeElement === this.triggerEl || !this.isFocusInMenu())) this.closeDropdown();
      return;
    }

    if (this.focusAdjacentItem(currentIndex, event.shiftKey ? -1 : 1)) {
      event.preventDefault();
      return;
    }

    // Past either end, closing moves focus to the trigger. Shift+Tab stays there; Tab carries on past it.
    if (event.shiftKey) event.preventDefault();
    this.closeDropdown();
  }

  // Handle keyboard events for the dropdown
  @Listen('keydown', { target: 'window' })
  handleKeyDown(event: KeyboardEvent) {
    if (!this.isOpen) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.focusNextItem();
        break;

      case 'ArrowUp':
        event.preventDefault();
        this.focusPreviousItem();
        break;

      case 'Home':
        event.preventDefault();
        if (this.menuItems.length > 0) {
          // Find first non-disabled item
          let firstIndex = 0;
          while (firstIndex < this.menuItems.length && this.isItemDisabled(this.menuItems[firstIndex])) {
            firstIndex++;
          }
          if (firstIndex < this.menuItems.length) {
            this.focusItemByIndex(firstIndex);
          }
        }
        break;

      case 'End':
        event.preventDefault();
        if (this.menuItems.length > 0) {
          // Find last non-disabled item
          let lastIndex = this.menuItems.length - 1;
          while (lastIndex >= 0 && this.isItemDisabled(this.menuItems[lastIndex])) {
            lastIndex--;
          }
          if (lastIndex >= 0) {
            this.focusItemByIndex(lastIndex);
          }
        }
        break;

      case 'Tab': {
        // Tab from an item is handled in handleTabKeyDown; from anywhere else it moves into the menu.
        if (event.shiftKey || this.getFocusedItemIndex() !== -1) break;

        if (this.focusAdjacentItem(-1, 1)) {
          event.preventDefault();
        } else {
          // With no item to move to, Tab carries on past the menu, as it does past the last item.
          this.closeDropdown();
        }
        break;
      }
    }
  }

  // Handle clicks outside the dropdown to close it
  @Listen('click', { target: 'window' })
  handleWindowClick(event: MouseEvent) {
    if (this.isOpen && !this.host.contains(event.target as Node) && event.target !== this.triggerEl) {
      this.closeDropdown();
    }
  }


  render() {
    return (
      <Host id={this.componentId}>
        <slot
          name="trigger"
          onSlotchange={this.handleTriggerSlotChange}
        ></slot>
        <pds-box
          border-radius="sm"
          display="flex"
          direction="column"
          class="pds-dropdown-menu--panel is-hidden"
          shadow="100"
          part="menu-panel"
        >
          <div class={{ 'pds-dropdown-menu__header': true, 'is-hidden': !this.hasHeader }}>
            <slot name="header" onSlotchange={this.handleHeaderSlotChange}></slot>
          </div>
          <div class="pds-dropdown-menu__items" role="menu" aria-orientation="vertical">
            <slot onSlotchange={this.handleSlotChange}></slot>
          </div>
        </pds-box>
      </Host>
    );
  }
}
