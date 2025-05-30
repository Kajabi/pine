import { Component, Host, h, Prop } from '@stencil/core';
import type { BasePdsProps } from '@utils/interfaces';

@Component({
  tag: 'pds-dropdown-menu-separator',
  styleUrl: 'pds-dropdown-menu-separator.scss',
  shadow: true,
})
export class PdsDropdownMenuSeparator implements BasePdsProps {
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
      <Host id={this.componentId}>
        <hr/>
      </Host>
    );
  }
}
