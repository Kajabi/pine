import { Component, Host, h, Prop } from '@stencil/core';

/**
 * @slot sortable-actions - Content is placed within the `pds-sortable-item__actions` element as children
 */
@Component({
  tag: 'pds-sortable-item',
  styleUrl: 'pds-sortable-item.scss',
  shadow: true,
})
export class PdsSortableItem {
    /**
   * Determines whether `sortable-actions` slot should be enabled.
   * @defaultValue false
   */
    @Prop() actions = false;

  /**
   * Determines whether `sortable-item` should have a handle.
   * @defaultValue false
   */
  @Prop() handle = false;

  private classNames() {
    const classNames = ['pds-sortable-item'];

    return classNames.join('  ');
  }

  render() {
    return (
      <Host class={this.classNames()}>
        {this.handle && (
          <div class="pds-sortable-item__handle">
            <pds-icon name="handle-2-vertical"></pds-icon>
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
