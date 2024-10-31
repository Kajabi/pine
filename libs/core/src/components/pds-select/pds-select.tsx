import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'pds-select',
  styleUrl: 'pds-select.scss',
  shadow: true,
})
export class PdsSelect {
  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }
}
