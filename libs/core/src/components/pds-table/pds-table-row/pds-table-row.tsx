import { Component, Element, Host, h, Event, EventEmitter, Prop, State } from '@stencil/core';

import { closest } from '../../../utils/closest';

@Component({
  tag: 'pds-table-row',
  styleUrls: ['pds-table-row.scss'],
  shadow: true,
})
export class PdsTableRow {
  @Element() hostElement: HTMLPdsTableRowElement;
  private tableRef: HTMLPdsTableElement;
  private observer: MutationObserver;

  /**
    * Determines if the row selected is in an indeterminate state.
    */
  @Prop({ mutable: true }) indeterminate?: boolean;

  /**
   * Determines if the table row is currently selected.
   */
  @Prop({ mutable: true }) isSelected?: boolean;

  /**
   * Determines if the row should have a divider border.
   * @defaultValue false
   */
  @State() private hasDivider: boolean = false;

  /**
   * Determines if this is the last row in the table body.
   * @defaultValue false
   */
  @State() private isLastRow: boolean = false;

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

    if (this.hasDivider) {
      classNames.push("has-divider");
    }

    if (this.isLastRow) {
      classNames.push("is-last-row");
    }

    return classNames.join(' ');
  }

  componentWillRender() {
    // Always refresh tableRef to get latest prop values
    // This ensures we pick up changes to parent table props
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
    // Set tableRef and initial state for row dividers
    this.tableRef = this.hostElement.closest('pds-table') as HTMLPdsTableElement;
    this.updateDividerState();
  }

  componentDidLoad() {
    // Watch for changes to the parent table's row-dividers attribute
    if (this.tableRef && typeof MutationObserver !== 'undefined') {
      this.observer = new MutationObserver(() => {
        // Update state when row-dividers attribute changes
        this.updateDividerState();
      });

      this.observer.observe(this.tableRef, {
        attributes: true,
        attributeFilter: ['row-dividers']
      });
    }
  }

  disconnectedCallback() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private shouldHaveDivider(): boolean {
    if (!this.tableRef) {
      this.tableRef = this.hostElement.closest('pds-table') as HTMLPdsTableElement;
    }
    // Reads the parent pds-table component's rowDividers property value directly
    return !!(this.tableRef && this.tableRef.rowDividers);
  }

  private updateDividerState() {
    this.hasDivider = this.shouldHaveDivider();
    this.updateLastRowState();
  }

  private updateLastRowState() {
    if (!this.hasDivider) {
      this.isLastRow = false;
      return;
    }

    const tableBody = this.hostElement.closest('pds-table-body');
    if (tableBody) {
      const rows = Array.from(tableBody.querySelectorAll('pds-table-row'));
      this.isLastRow = rows[rows.length - 1] === this.hostElement;
    } else {
      this.isLastRow = false;
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
        part="row"
      >
        {this.tableRef && this.tableRef.selectable && (
          <pds-table-cell part={this.tableRef.fixedColumn ? 'checkbox-cell' : 'checkbox-cell'} class={this.tableRef.selectable ? 'has-checkbox' : ''} >
            <pds-checkbox
              componentId={this.generateUniqueId()}
              onClick={this.handleClick}
              indeterminate={this.indeterminate}
              label={"Select Row"}
              hideLabel={true}
              checked={this.isSelected}
              part="row-checkbox"
            />
          </pds-table-cell>
        )}
        <slot></slot>
      </Host>
    );
  }
}
