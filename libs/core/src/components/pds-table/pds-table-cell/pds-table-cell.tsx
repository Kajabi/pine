import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'pds-table-cell',
  styleUrl: 'pds-table-cell.scss',
  shadow: true,
})
export class PdsTableCell {

  render() {
    return (
      <Host role="gridcell">
        <slot></slot>
      </Host>
    );
  }
}
