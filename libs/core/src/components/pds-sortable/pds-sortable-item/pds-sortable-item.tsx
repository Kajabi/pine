import { Component, Element, Host, h, Prop } from '@stencil/core';
import { HostStylingKeeper } from '@utils/attributes';
import { formatMessage } from '../../../i18n';
import { sortableItemLabel } from '../sortable-label';

import { handle as handleIcon } from '@pine-ds/icons/icons';
/**
 * @slot sortable-item-actions - Content is placed within the `pds-sortable-item__actions` element as children. This slot is only rendered when `enable-actions` is set.
 * @lightDom renders-markup
 */
@Component({
  tag: 'pds-sortable-item',
  styleUrl: 'pds-sortable-item.scss',
  scoped: true,
})
export class PdsSortableItem {
  @Element() el: HTMLPdsSortableItemElement;
  private hostKeeper = new HostStylingKeeper();

  connectedCallback() {
    this.hostKeeper.connect(this.el);
  }

  disconnectedCallback() {
    this.hostKeeper.disconnect();
  }

  sortableRef: HTMLPdsSortableElement;
  /**
   * Determines whether `sortable-item-actions` slot should be enabled.
   * @defaultValue false
   */
  @Prop() enableActions = false;

  /**
   * A unique identifier used for the sortable item `id` attribute.
   */
  @Prop() componentId: string;

  /**
   * Determines whether `sortable-item` should have a handle.
   * @defaultValue false
   */
  @Prop({ mutable: true }) showHandle = false;

  /**
   * Name of the item in its reorder handle's label and in the reorder announcements. Pass a translated string to localize it; defaults to the item's text content.
   */
  @Prop() itemLabel?: string;

  // Discards stale handle/actions siblings left by a page-cache (Turbo, bfcache) reconnect; the fresh handle is always first, the fresh actions wrapper always last.
  componentDidRender() {
    const handles = Array.from(this.el.children).filter((child) => child.matches('.pds-sortable-item__handle'));
    handles.slice(1).forEach((stale) => stale.remove());

    const actionsWrappers = Array.from(this.el.children).filter((child) =>
      child.matches('.pds-sortable-item__actions')
    );
    const freshActions = actionsWrappers[actionsWrappers.length - 1];
    actionsWrappers.slice(0, -1).forEach((stale) => {
      if (freshActions !== undefined) {
        Array.from(stale.children).forEach((node) => freshActions.appendChild(node));
      }
      stale.remove();
    });
  }

  componentWillRender() {
    // When the parent sortable has a type of 'handle', the sortable items
    // will automatically set showHandle to 'true'.
    this.sortableRef = this.el.closest('pds-sortable');

    if (this.sortableRef && this.sortableRef.handleType === 'handle') {
      this.showHandle = true;
    }
  }

  render() {
    const sortable = this.sortableRef;
    // Reorderable from the keyboard: the row by default, the handle with `handle-type="handle"`.
    const reorderable = !!sortable && !sortable.disabled;
    const handleIsTarget = reorderable && sortable.handleType === 'handle';
    const rowIsTarget = reorderable && !handleIsTarget;

    const hostAttributes = {
      tabindex: rowIsTarget ? '0' : undefined,
      'aria-description': rowIsTarget ? sortable.reorderDescription : undefined,
    };
    this.hostKeeper.record('pds-sortable-item', {}, hostAttributes);

    return (
      <Host class="pds-sortable-item" id={this.componentId} {...hostAttributes}>
        {this.showHandle && (
          <div
            class="pds-sortable-item__handle"
            role={handleIsTarget ? 'button' : undefined}
            tabindex={handleIsTarget ? '0' : undefined}
            aria-label={handleIsTarget ? formatMessage(sortable.handleLabel, { item: sortableItemLabel(this.el) }) : undefined}
            aria-description={handleIsTarget ? sortable.reorderDescription : undefined}
          >
            <pds-icon aria-hidden="true" icon={handleIcon}></pds-icon>
          </div>
        )}
        <slot></slot>
        {this.enableActions && (
          <div class="pds-sortable-item__actions">
            <slot name="sortable-item-actions" />
          </div>
        )}
      </Host>
    );
  }
}
