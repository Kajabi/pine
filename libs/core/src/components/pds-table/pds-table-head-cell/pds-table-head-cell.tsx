import { Component, Element, Host, h } from '@stencil/core';

@Component({
  tag: 'pds-table-head-cell',
  styleUrl: 'pds-table-head-cell.scss',
  shadow: true,
})
export class PdsTableHeadCell {
  @Element() hostElement: HTMLPdsTableHeadCellElement;
  tableRef: HTMLPdsTableElement


  componentWillRender() {
    this.tableRef = this.hostElement.closest('pds-table') as HTMLPdsTableElement;
  }

  render() {
    return (
      <Host role="columnheader">
        <slot></slot>
      </Host>
    );
  }
}
