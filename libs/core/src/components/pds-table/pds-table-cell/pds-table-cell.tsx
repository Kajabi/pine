import { Component, Element, Host, h } from '@stencil/core';

@Component({
  tag: 'pds-table-cell',
  styleUrl: 'pds-table-cell.scss',
  shadow: true,
})
export class PdsTableCell {
  @Element() hostElement: HTMLPdsTableCellElement;
  tableRef: HTMLPdsTableElement

  componentWillRender() {
    this.tableRef = this.hostElement.closest('pds-table') as HTMLPdsTableElement;
  }

  private classNames() {
    const classnames = []
    if (this.tableRef.compact)
      classnames.push('is-compact')

    return classnames.join(' ');
  }
  render() {
    return (
      <Host role="gridcell" class={ this.classNames() }>
        <slot></slot>
      </Host>
    );
  }
}
