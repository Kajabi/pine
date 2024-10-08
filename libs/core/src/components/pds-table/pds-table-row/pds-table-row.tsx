import { Component, Element, Host, h, Event, EventEmitter, Prop } from '@stencil/core';

import { closest } from '../../../utils/closest';

@Component({
  tag: 'pds-table-row',
  styleUrls: ['../../../global/styles/base.scss', 'pds-table-row.scss'],
  shadow: true,
})
export class PdsTableRow {
  @Element() hostElement: HTMLPdsTableRowElement;
  private tableRef: HTMLPdsTableElement;

  /**
   * Indicates that the selection state is indeterminate.
   * */
  @Prop({ mutable: true }) indeterminate?: boolean

  /**
   * A local state to track whether the row is currently selected.
   */
  @Prop({ mutable: true }) isSelected?: boolean;

  /**
   * Event that is emitted when the checkbox is clicked, carrying the selected value.
   */
  @Event() pdsTableRowSelected: EventEmitter<{ rowIndex: number; isSelected: boolean; }>;

  private handleClick = () => {
    this.isSelected = !this.isSelected; // Toggle the selected state
    this.handleSelect(this.isSelected);
  }

  private handleSelect = (isSelected: boolean) => {
    this.indeterminate = false;

    if (!closest('pds-table-head', this.hostElement)) {
      const rowIndex = Array.from(this.hostElement.parentNode.children).indexOf(this.hostElement)
      this.pdsTableRowSelected.emit({
        rowIndex,
        isSelected,
      })
    }
  }

  private classNames() {
    const classNames = [];

    if (this.isSelected) {
      classNames.push("is-selected");
    }

    return classNames.join('  ');
  }

  componentWillRender() {
    this.tableRef = this.hostElement.closest('pds-table') as HTMLPdsTableElement;

    if (this.tableRef && this.tableRef.fixedColumn) {
      const tableCell = this.hostElement.querySelector('pds-table-cell');
      tableCell?.classList.add("is-fixed");
    }
  }

  componentWillLoad() {
    if (this.isSelected) {
      this.handleSelect(this.isSelected);
    }
  }

  private generateUniqueId = () => {
    const randomString = Math.random().toString(36).substring(2, 8);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const uniqueId = `${randomString}-${timestamp}`;

    return uniqueId;
  }

  render() {
    return (
      <Host
        class={this.classNames()}
        role="row"
      >
        {this.tableRef && this.tableRef.selectable && (
          <pds-table-cell part={this.tableRef.fixedColumn ? 'checkbox-cell' : ''} class={this.tableRef.selectable ? 'has-checkbox' : ''} >
            <pds-checkbox
              componentId={this.generateUniqueId()}
              onClick={this.handleClick}
              indeterminate={this.indeterminate}
              label={"Select Row"}
              labelHidden={true}
              checked={this.isSelected}
            />
          </pds-table-cell>
        )}
        <slot></slot>
      </Host>
    );
  }
}
