import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'sage-switch',
  styleUrl: 'sage-switch.scss',
  shadow: true,
})
export class SageSwitch {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
