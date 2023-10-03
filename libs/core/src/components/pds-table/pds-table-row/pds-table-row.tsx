import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'pds-table-row',
  styleUrl: 'pds-table-row.scss',
  shadow: true,
})
export class PdsTableRow {

  render() {
    return (
      <Host role="row">
        <slot></slot>
      </Host>
    );
  }

}
