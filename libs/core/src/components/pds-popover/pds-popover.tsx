import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'pds-popover',
  styleUrl: 'pds-popover.scss',
  shadow: true,
})
export class PdsPopover {
  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }
}
