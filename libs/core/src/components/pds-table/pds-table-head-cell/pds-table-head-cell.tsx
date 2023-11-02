import { Component, Element, Host, h } from '@stencil/core';

@Component({
  tag: 'pds-table-head-cell',
  styleUrl: 'pds-table-head-cell.scss',
  shadow: true,
})
export class PdsTableHeadCell {
  @Element() hostElement: HTMLPdsTableHeadCellElement;
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
        role="columnheader"
        style={this.tableRef && this.tableRef.fixedColumn && this.tableRef.selectable ? { '--fixed-cell-position': '40px' } : {}}>
        <slot></slot>
      </Host>
    );
  }
}
