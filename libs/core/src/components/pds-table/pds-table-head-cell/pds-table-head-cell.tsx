import { Component, Element, Host, Prop, h, Event, EventEmitter, State } from '@stencil/core';

@Component({
  tag: 'pds-table-head-cell',
  styleUrl: 'pds-table-head-cell.scss',
  shadow: true,
})
export class PdsTableHeadCell {
  @Element() hostElement: HTMLPdsTableHeadCellElement;
  tableRef: HTMLPdsTableElement;

  /**
   * Determines whether the table column is sortable when set to `true`.
   */
  @Prop() sortable: boolean;

  /**
   * Event emitted to signal that a table column header has been sorted, providing information about the sorted column's name and sorting direction.
   */
  @Event() pdsTableSort: EventEmitter<{ column: string; direction: string }>;

  @State() private sortingDirection: 'asc' | 'desc' = 'asc';
  @State() private tableScrolling: boolean = false;

  componentWillRender() {
    this.tableRef = this.hostElement.closest('pds-table') as HTMLPdsTableElement;
  }

  componentDidLoad() {
    if (this.tableRef && this.tableRef.responsive && this.tableRef.fixedColumn) {
      this.tableRef.addEventListener('scroll', this.handleScroll);
    }
  }

  private handleScroll = () => {
    if (this.tableRef.scrollLeft > 0) {
      this.tableScrolling = true;
    } else {
      this.tableScrolling = false;
    }
  };

  private toggleSort = () => {
    if (this.sortable) {
      const column = this.hostElement.innerText.trim();
      this.sortingDirection = this.sortingDirection === 'asc' ? 'desc' : 'asc';

      this.tableRef.querySelectorAll('pds-table-head-cell').forEach((headCell) => {
        headCell.classList.remove('is-active');
      });

      this.hostElement.classList.toggle('is-active');
      this.pdsTableSort.emit({ column, direction: this.sortingDirection });
    }
  }

  private classNames() {
    const classNames = [];

    if (this.tableRef && this.tableRef.compact) {
      classNames.push('is-compact');
    }

    if (this.sortable) {
      classNames.push('is-sortable');
    }

    if (this.sortable && this.sortingDirection !== null) {
      classNames.push('sort-' + this.sortingDirection);
    }

    if (this.tableRef && this.tableRef.fixedColumn && this.tableScrolling) {
      classNames.push('has-scrolled');
    }

    return classNames.join('  ');
  }

  render() {
    return (
      <Host
        class={this.classNames()}
        role="columnheader"
        onClick={this.toggleSort}
        style={
          this.tableRef &&
          this.tableRef.fixedColumn &&
          this.tableRef.selectable
            ? { '--fixed-cell-position': '40px' }
            : {}
        }
      >
        <slot></slot>
        {this.sortable && (
          <pds-icon name={this.sortingDirection === 'asc' ? 'up-small' : 'down-small'} />
        )}
      </Host>
    );
  }
}
