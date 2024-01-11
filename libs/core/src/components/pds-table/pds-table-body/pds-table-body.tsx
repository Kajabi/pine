import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'pds-table-body',
  styleUrl: 'pds-table-body.scss',
  shadow: true,
})
export class PdsTableBody {

  render() {
    return (
      <Host role="rowgroup">
        <slot></slot>
      </Host>
    );
  }
}
