import { Component, Element, Host, Prop, h, Event, EventEmitter, State } from '@stencil/core';

import { downSmall, upSmall } from '@pine-ds/icons/icons';

@Component({
  tag: 'pds-table-head-cell',
  styleUrls: ['pds-table-head-cell.scss'],
  shadow: true,
})
export class PdsTableHeadCell {
  @Element() hostElement: HTMLPdsTableHeadCellElement;
  private tableRef: HTMLPdsTableElement;

  /**
   * Sets the text alignment within the head cell.
   */
  @Prop() cellAlign?: 'start' | 'center' | 'end' | 'justify';

  /**
   * Determines whether the table column is sortable when set to `true`.
   */
  @Prop() sortable: boolean;

  /**
   * Event emitted to signal that a table column header has been sorted, providing information about the sorted column's name and sorting direction.
   */
  @Event() pdsTableSort: EventEmitter<{ column: string; direction: string }>;

  /**
   * The direction of sorting.
   */
  @State() private sortingDirection: 'asc' | 'desc' = 'asc';

  /**
   * Determines if the table is currently scrolling.
   * @defaultValue false
   */
  @State() private tableScrolling: boolean = false;

  /**
   * Determines if the table row is currently selected.
   * @defaultValue false
   */
  @State() isSelected: boolean = false;

  componentWillRender() {
    this.tableRef = this.hostElement.closest('pds-table') as HTMLPdsTableElement;
  }

  componentDidLoad() {
    if (this.tableRef && this.tableRef.responsive && this.tableRef.fixedColumn) {
      // For responsive tables with fixed columns, set up scroll detection
      // This enables the first column header to show a shadow when the table is scrolled horizontally
      setTimeout(() => {
        if (!this.tableRef) {
          return;
        }

        try {
          // Find the scrolling container inside the table's shadow DOM
          const container = this.tableRef.shadowRoot?.querySelector('.pds-table-responsive-container');
          if (container) {
            container.addEventListener('scroll', this.handleScroll);
          }
          // Initial check in case already scrolled
          this.handleScroll();
        } catch (error) {
          console.warn('Error setting up scroll listener:', error);
        }
      }, 100);
    }
  }

  /**
   * Handles scroll events to update fixed column shadow state.
   * Updates the tableScrolling state to control CSS classes for fixed column shadows.
   * @private
   */
  private handleScroll = () => {
    if (!this.tableRef) {
      return;
    }

    try {
      // Check scroll position on the responsive container element
      const container = this.tableRef.shadowRoot?.querySelector('.pds-table-responsive-container');
      if (container) {
        this.tableScrolling = container.scrollLeft > 0;
      }
    } catch (error) {
      console.warn('Scroll handler error:', error);
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

    if (this.cellAlign) {
      classNames.push(`pds-table-head-cell--align-${this.cellAlign}`);
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
          <pds-icon icon={this.sortingDirection === 'asc' ? upSmall : downSmall} />
        )}
      </Host>
    );
  }
}
