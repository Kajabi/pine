import { Component, Host, h, Prop } from '@stencil/core';

/**
 * @slot sortable-actions - Content is placed within the `pds-sortable-item__actions` element as children. This slot is only rendered if `actions` is set to `true`.
 */
@Component({
  tag: 'pds-sortable-item',
  styleUrl: 'pds-sortable-item.scss',
  scoped: true,
})
export class PdsSortableItem {
  /**
   * Determines whether `sortable-actions` slot should be enabled.
   * @defaultValue false
   */
  @Prop() actions = false;

  /**
   * A unique identifier for the sortable item.
   */
  @Prop() componentId: string;

  /**
   * Determines whether `sortable-item` should have a handle.
   * @defaultValue false
   */
  @Prop() handle = false;

  render() {
    return (
      <Host class="pds-sortable-item" id={this.componentId}>
        {this.handle && (
          <div class="pds-sortable-item__handle">
            <pds-icon name="handle"></pds-icon>
          </div>
        )}
        <slot></slot>
        {this.actions && (
          <div class="pds-sortable-item__actions">
            <slot name="sortable-actions" />
          </div>
        )}
      </Host>
    );
  }
}
