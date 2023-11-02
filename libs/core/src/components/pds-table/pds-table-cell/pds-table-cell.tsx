import { Component, Element, Host, h } from '@stencil/core';

@Component({
  tag: 'pds-table-cell',
  styleUrl: 'pds-table-cell.scss',
  shadow: true,
})
export class PdsTableCell {
  @Element() hostElement: HTMLPdsTableCellElement;
  tableRef: HTMLPdsTableElement;

  componentWillRender() {
    this.tableRef = this.hostElement.closest('pds-table') as HTMLPdsTableElement;
  }

  private classNames() {
    const classnames = [];

    if (this.tableRef && this.tableRef.compact) {
      classnames.push('is-compact');
    }

    return classnames.join(' ');
  }

  render() {
    return (
      <Host
        class={this.classNames()}
        role="gridcell"
        style={this.tableRef && this.tableRef.fixedColumn && this.tableRef.selectable ? { '--fixed-cell-position': '40px' } : {}}
      >
        <slot></slot>
      </Host>
    );
  }
}
