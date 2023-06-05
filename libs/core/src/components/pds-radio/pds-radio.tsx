import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'pds-radio',
  styleUrl: 'pds-radio.scss',
  shadow: true,
})
export class PdsRadio {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
