import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'pds-label',
  styleUrl: 'pds-label.scss',
  shadow: true,
})
export class PdsLabel {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
