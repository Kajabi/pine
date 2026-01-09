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
  private observer: MutationObserver | null = null;
  private bodyObserver: MutationObserver | null = null;

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
    // Handle initial selection state
    if (this.isSelected) {
      this.handleSelect(this.isSelected);
    }
    // Note: tableRef, observers, and divider state are set up in connectedCallback
    // which runs before componentWillLoad and also handles row re-attachment after sorting
  }

  connectedCallback() {
    // When a row is re-attached to the DOM (e.g., after sorting),
    // we need to re-setup the observers since disconnectedCallback cleared them
    // Note: componentDidLoad only fires once, but connectedCallback fires every time
    // the element is attached to the DOM (including after being moved)
    this.tableRef = this.hostElement.closest('pds-table') as HTMLPdsTableElement;
    this.setupObservers();
    this.updateDividerState();
  }

  disconnectedCallback() {
    this.cleanupObservers();
  }

  private cleanupObservers() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    if (this.bodyObserver) {
      this.bodyObserver.disconnect();
      this.bodyObserver = null;
    }
  }

  private setupObservers() {
    // Clean up any existing observers first
    this.cleanupObservers();

    // Watch for changes to the parent table's row-dividers attribute
    if (this.tableRef && typeof MutationObserver !== 'undefined') {
      this.observer = new MutationObserver(() => {
        this.updateDividerState();
      });

      this.observer.observe(this.tableRef, {
        attributes: true,
        attributeFilter: ['row-dividers']
      });
    }

    // Watch for child list changes in table body (e.g., when rows are reordered during sorting)
    const tableBody = this.hostElement.closest('pds-table-body');
    if (tableBody && typeof MutationObserver !== 'undefined') {
      this.bodyObserver = new MutationObserver(() => {
        this.updateLastRowState();
      });

      this.bodyObserver.observe(tableBody, {
        childList: true
      });
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
