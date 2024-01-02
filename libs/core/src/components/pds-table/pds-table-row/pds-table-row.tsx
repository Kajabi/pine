import { Component, Element, Host, h, Event, EventEmitter, State } from '@stencil/core';

@Component({
  tag: 'pds-table-row',
  styleUrl: 'pds-table-row.scss',
  shadow: true,
})
export class PdsTableRow {
  @Element() hostElement: HTMLPdsTableRowElement;
  tableRef: HTMLPdsTableElement;

  /**
   * Event that is emitted when the checkbox is clicked, carrying the selected value.
   */
  @Event() pdsTableRowSelected: EventEmitter<{ rowIndex: number; isSelected: boolean; }>;

  /**
   * A local state to track whether the row is currently selected.
   */
  @State() isSelected: boolean = false;

  private handleCheckboxClick = () => {
    this.isSelected = !this.isSelected; // Toggle the selected state
    const selectedIndex = Array.from(this.hostElement.parentNode.children).indexOf(this.hostElement);
    this.pdsTableRowSelected.emit({ rowIndex: selectedIndex, isSelected: this.isSelected });
    console.log('Event emitted: pdsTableRowSelected', { rowIndex: selectedIndex, isSelected: this.isSelected });
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
              onClick={this.handleCheckboxClick}
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
