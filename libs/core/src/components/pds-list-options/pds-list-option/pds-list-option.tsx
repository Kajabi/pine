import { Component, Host, h, Prop } from '@stencil/core';

/**
 * @slot (default) - The sortable item's content
 */
@Component({
  tag: 'pds-list-option',
  styleUrl: 'pds-list-option.scss',
  scoped: true,
})
export class PdsListOption {
  /**
   * A unique identifier for component.
   */
  @Prop() componentId: string;

  render() {
    return (
      <Host class="pds-list-option" id={this.componentId}>
        <div class="pds-list-option">
          <slot></slot>
        </div>
      </Host>
    );
  }
}
