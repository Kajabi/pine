import { Component, Element, Host, h, Prop, State, Listen } from '@stencil/core';

@Component({
  tag: 'pds-table',
  styleUrl: 'pds-table.scss',
  shadow: true,
})
export class PdsTable {
  @Element() el: HTMLPdsTableElement;
  tableRef: HTMLElement;

  /**
   * Determines if table displays compact which reduces the spacing of table cells.
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
   * Determines if table displays fixed column which fixes the first column of the table.
   */
  @Prop() fixedColumn: boolean;

  /**
   * Determines if table displays checkboxes for selectable rows.
   */
  @Prop() selectable: boolean;

  @State() sortingColumn: string | null = null;
  @State() sortingDirection: 'asc' | 'desc' = 'asc';

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
    // Create an array to hold the table data
    const tableData = [];

    // Get the rows in the table
    const tableRows = this.el.querySelectorAll('pds-table-row');

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

    // Loop through the rows
    tableRows.forEach((row) => {
      const rowData = [];

      // Get the cells in each row
      const cells = row.querySelectorAll('pds-table-cell');

      // Loop through the cells
      cells.forEach((cell) => {
        rowData.push(cell.innerHTML.trim());
      });

      tableData.push(rowData);
    });

    // Sort the table data
    tableData.sort((a, b) => {
      const valueA = a[columnIndex];
      const valueB = b[columnIndex];

      if (direction === 'asc') {
        return valueA.localeCompare(valueB);
      } else if (direction === 'desc') {
        return valueB.localeCompare(valueA);
      }
      return 0;
    });

    // Update the table with the sorted data
    tableData.forEach((rowData, index) => {
      const cells = tableRows[index].querySelectorAll('pds-table-cell');
      cells.forEach((cell, cellIndex) => {
        cell.textContent = rowData[cellIndex];
      });
    });
  }

  @Listen('pdsTableSort')
  handleTableSort(event: CustomEvent<{ column: string; direction: 'asc' | 'desc' }>) {
    const { direction } = event.detail;
    this.sortTable(event.detail.column, direction);
    this.sortingColumn = event.detail.column;
    this.sortingDirection = direction;
  }

  render() {
    return (
      <Host
        class={this.classNames()}
        id={this.componentId}
        role="grid"
        selectable={this.selectable}
      >
        <slot></slot>
      </Host>
    );
  }
}
