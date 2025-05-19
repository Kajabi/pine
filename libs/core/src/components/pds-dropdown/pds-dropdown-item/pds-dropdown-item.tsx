import { Component, Host, h, Prop } from '@stencil/core';
import type { BasePdsProps } from '@utils/interfaces';

@Component({
  tag: 'pds-dropdown-item',
  styleUrl: 'pds-dropdown-item.scss',
  shadow: true,
})
export class PdsDropdownItem implements BasePdsProps {
  /**
   * A unique identifier used for the underlying component `id` attribute.
   */
  @Prop() componentId: string;

  /**
   * It determines whether or not the dropdown-item is disabled.
   * @defaultValue false
   */
  @Prop() disabled: boolean = false;


  render() {
    return (
      <Host id={this.componentId}
        class={{ 'is-disabled': this.disabled }}
      >
        <div class="pds-dropdown-item__content">
          <slot></slot>
        </div>
      </Host>
    );
  }
}
