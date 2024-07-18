import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'pds-text',
  styleUrl: 'pds-text.scss',
  shadow: true,
})
export class PdsText {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
