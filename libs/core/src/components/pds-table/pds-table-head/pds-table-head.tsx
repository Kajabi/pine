import { Component, Element, Host, h } from '@stencil/core';

@Component({
  tag: 'pds-table-head',
  styleUrl: 'pds-table-head.scss',
  shadow: true,
})
export class PdsTableHead {
  @Element() hostElement: HTMLPdsTableHeadElement;
  tableRef: HTMLPdsTableElement

  componentWillRender() {
    this.tableRef = this.hostElement.closest('pds-table') as HTMLPdsTableElement;

    if ( this.tableRef.fixedColumn) {
      const tableCell = this.hostElement.querySelector('pds-table-head-cell:first-child');
      tableCell?.classList.add("is-fixed");
    }
  }
  render() {
    return (
      <Host role="row">
        {this.tableRef.selectable && (
          <pds-table-checkbox-cell
            part={this.tableRef.fixedColumn ? 'cell' : ''}
          >
          </pds-table-checkbox-cell>
        )}
        <slot></slot>
      </Host>
    );
  }
}
