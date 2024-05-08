import { Component, Element, Host, h, Prop } from '@stencil/core';

import { handle } from '@pine-ds/icons/icons';
/**
 * @slot sortable-item-actions - Content is placed within the `pds-sortable-item__actions` element as children. This slot is only rendered if `actions` is set to `true`.
 */
@Component({
  tag: 'pds-sortable-item',
  styleUrl: 'pds-sortable-item.scss',
  scoped: true,
})
export class PdsSortableItem {
  @Element() el: HTMLPdsSortableItemElement;
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
  @Prop({ mutable: true }) handle = false;

  componentWillRender() {
    // When the parent sortable has a type of 'handle', the sortable items
    // will automatically set handle to 'true'.
    this.sortableRef = this.el.closest('pds-sortable') as HTMLPdsSortableElement;

    if (this.sortableRef && this.sortableRef.handleType === 'handle') {
      this.handle = true;
    }
  }

  render() {
    return (
      <Host class="pds-sortable-item" id={this.componentId}>
        {this.handle && (
          <div class="pds-sortable-item__handle">
            <pds-icon icon={handle}></pds-icon>
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
