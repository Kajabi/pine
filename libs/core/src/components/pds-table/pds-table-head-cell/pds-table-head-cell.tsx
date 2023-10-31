import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'pds-table-head-cell',
  styleUrl: 'pds-table-head-cell.scss',
  shadow: true,
})
export class PdsTableHeadCell {

  render() {
    return (
      <Host role="columnheader">
        <slot></slot>
      </Host>
    );
  }
}
