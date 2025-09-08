import { Component, Element, Host, h, Event, EventEmitter, Prop } from '@stencil/core';

import { closest } from '../../../utils/closest';

@Component({
  tag: 'pds-table-row',
  styleUrls: ['pds-table-row.scss'],
  shadow: true,
})
export class PdsTableRow {
  @Element() hostElement: HTMLPdsTableRowElement;
  private tableRef: HTMLPdsTableElement;

  /**
    * Determines if the row selected is in an indeterminate state.
    */
  @Prop({ mutable: true }) indeterminate?: boolean;

  /**
   * Determines if the table row is currently selected.
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
    this.tableRef = this.findParentTable();
  }

  /**
   * Find the parent table element, handling both regular and slotted content
   */
  private findParentTable(): HTMLPdsTableElement | null {
    // First try the standard closest query
    const table = this.hostElement.closest('pds-table') as HTMLPdsTableElement;

    if (table != null) {
      return table;
    }

    // If that fails (e.g., when slotted), walk up the DOM tree manually
    let element = this.hostElement.parentElement;
    while (!!element) {
      if (element.tagName === 'PDS-TABLE') {
        return element as HTMLPdsTableElement;
      }

      // Check if we're in a slot and need to traverse to the host
      if (!!element.assignedSlot) {
        element = element.assignedSlot.getRootNode()['host'] as HTMLElement;
      } else {
        element = element.parentElement;
      }
    }

    return null;
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
              hideLabel={true}
              checked={this.isSelected}
            />
          </pds-table-cell>
        )}
        <slot></slot>
      </Host>
    );
  }
}
