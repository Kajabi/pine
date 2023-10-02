import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'pds-loader',
  styleUrl: 'pds-loader.scss',
  shadow: true,
})
export class PdsLoader {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
