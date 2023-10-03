import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'pds-table-head',
  styleUrl: 'pds-table-head.scss',
  shadow: true,
})
export class PdsTableHead {

  render() {
    return (
      <Host role="row">
        <slot></slot>
      </Host>
    );
  }

}
