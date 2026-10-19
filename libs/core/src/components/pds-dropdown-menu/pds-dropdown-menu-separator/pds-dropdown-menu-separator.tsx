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
   * Has no effect. A separator can't be focused or activated.
   * @defaultValue false
   */
  @Prop() disabled: boolean = false;


  render() {
    return (
      <Host>
        <hr/>
      </Host>
    );
  }
}
