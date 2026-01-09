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

    // Ensure tableRef is available
    if (!this.tableRef) {
      this.tableRef = this.hostElement.closest('pds-table') as HTMLPdsTableElement;
    }

    // Check for rowDividers prop or attribute
    const hasRowDividers = this.tableRef && (
      this.tableRef.rowDividers ||
      this.tableRef.hasAttribute('row-dividers')
    );

    if (hasRowDividers) {
      classNames.push("has-divider");

      // Check if this is the last row in the table body
      const tableBody = this.hostElement.closest('pds-table-body');
      if (tableBody) {
        const rows = Array.from(tableBody.querySelectorAll('pds-table-row'));
        const isLastRow = rows[rows.length - 1] === this.hostElement;
        if (isLastRow) {
          classNames.push("is-last-row");
        }
      }
    }

    return classNames.join('  ');
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
  }

  componentDidLoad() {
    // Watch for changes to the parent table's row-dividers attribute
    this.tableRef = this.hostElement.closest('pds-table') as HTMLPdsTableElement;

    if (this.tableRef && typeof MutationObserver !== 'undefined') {
      this.observer = new MutationObserver(() => {
        // Force re-render when row-dividers attribute changes
        this.hostElement.classList.toggle('has-divider', this.shouldHaveDivider());
        this.updateLastRowClass();
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
    return !!(this.tableRef && (
      this.tableRef.rowDividers ||
      this.tableRef.hasAttribute('row-dividers')
    ));
  }

  private updateLastRowClass() {
    if (!this.shouldHaveDivider()) {
      this.hostElement.classList.remove('is-last-row');
      return;
    }

    const tableBody = this.hostElement.closest('pds-table-body');
    if (tableBody) {
      const rows = Array.from(tableBody.querySelectorAll('pds-table-row'));
      const isLastRow = rows[rows.length - 1] === this.hostElement;
      this.hostElement.classList.toggle('is-last-row', isLastRow);
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
