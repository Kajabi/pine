import { Component, Element, Event, EventEmitter, Host, h, Prop, State, Listen } from '@stencil/core';

@Component({
  tag: 'pds-table',
  styleUrls: ['pds-table.scss'],
  shadow: true,
})
export class PdsTable {
  @Element() el: HTMLPdsTableElement;

  /**
   * Determines if the table displays with reduced table cell padding.
   */
  @Prop() compact: boolean;

  /**
   * A unique identifier used for the table `id` attribute.
   */
  @Prop() componentId!: string;

  /**
   * Enables the table to be responsive by horizontally scrolling on smaller screens.
   */
  @Prop() responsive: boolean;

  /**
   * Determines if the should display a fixed first column.
   */
  @Prop() fixedColumn: boolean;

  /**
   * Determines if the table displays checkboxes for selectable rows.
   */
  @Prop() selectable: boolean;

  /**
   * The name of the column being sorted.
   * @defaultValue null
   */
  @State() sortingColumn: string | null = null;

  /**
   * The direction of sorting.
   * @defaultValue 'asc'
   */
  @State() sortingDirection: 'asc' | 'desc' = 'asc';


  /**
   * Event that is emitted when the checkbox is clicked, carrying the rowIndex and selected value.
   */
  @Event() pdsTableSelect: EventEmitter<{ rowIndex: number; isSelected: boolean }>;

  /**
   * Event that is emitted when the select all checkbox is clicked, carrying the selected value.
   */
  @Event() pdsTableSelectAll: EventEmitter<{ isSelected: boolean }>;

  componentWillLoad() {
    this.sortingColumn = null;
  }

  private classNames() {
    const classNames = ['pds-table'];

    if (this.compact) {
      classNames.push('is-compact');
    }

    if (this.responsive) {
      classNames.push('is-responsive');
    }

    return classNames.join('  ');
  }

  private sortTable(column: string, direction: 'asc' | 'desc') {
    const tableBody = this.el.querySelector('pds-table-body');

    // Get the rows in the table body
    const tableRows = Array.from(tableBody.querySelectorAll('pds-table-row'));

    // Find the column index based on the column name
    const columnHeaderCells: HTMLElement[] = Array.from(
      this.el.querySelectorAll('pds-table-head-cell[sortable]')
    );

    const columnHeaderCell = columnHeaderCells.find(
      (cell) => cell.innerText.trim() === column
    );

    if (!columnHeaderCell) {
      console.warn(`Column "${column}" not found.`);
      return;
    }

    const columnIndex = columnHeaderCells.indexOf(columnHeaderCell);

    // Sort the rows based on the content of the specified column
    tableRows.sort((a, b) => {
      const valueA = a.querySelector(`pds-table-cell:nth-child(${columnIndex + 1})`).textContent.trim();
      const valueB = b.querySelector(`pds-table-cell:nth-child(${columnIndex + 1})`).textContent.trim();

      if (direction === 'asc') {
        return valueA.localeCompare(valueB, undefined, { sensitivity: 'base' });
      } else {
        return valueB.localeCompare(valueA, undefined, { sensitivity: 'base' });
      }
    });

    // Clear and append the sorted rows back to the table body
    tableBody.innerHTML = '';
    tableRows.forEach((row) => {
      tableBody.appendChild(row);
    });
  }

  @Listen('pdsTableSort')
  handleTableSort(event: CustomEvent<{ column: string; direction: 'asc' | 'desc' }>) {
    const { direction } = event.detail;
    this.sortTable(event.detail.column, direction);
    this.sortingColumn = event.detail.column;
    this.sortingDirection = direction;
  }

  @Listen('pdsTableSelectAll')
  handleTableSelectAll(event: CustomEvent<{ isSelected: boolean }>) {
    if (event.defaultPrevented) return;

    const pdsTableBody = this.el.querySelector('pds-table-body');
    const tableRows = Array.from(pdsTableBody.querySelectorAll('pds-table-row'));

    tableRows.forEach((row) => {
      row.isSelected = event.detail.isSelected;
    });
  }

  @Listen('pdsTableRowSelected')
  async handleTableSelect(event: CustomEvent<{ rowIndex: number; isSelected: boolean }>) {
    if (event.defaultPrevented) return;

    const allTableRows = this.el.querySelectorAll('pds-table-row');
    const allSelectedRows = Array.from(allTableRows).every((row) => row.isSelected);
    const noneSelectedRows = Array.from(allTableRows).every((row) => !row.isSelected);
    const pdsTableHead = this.el.querySelector('pds-table-head');
    if (!pdsTableHead) return;

    const headerCheckbox = pdsTableHead.shadowRoot.querySelector('pds-checkbox');
    headerCheckbox.checked = allSelectedRows;
    headerCheckbox.indeterminate = !allSelectedRows && !noneSelectedRows;
  }

  render() {
    return (
      <Host
        class={this.classNames()}
        id={this.componentId}
        role="grid"
        selectable={this.selectable}
        tabindex="0"
      >
        <slot></slot>
      </Host>
    );
  }
}
