import { Component, Element, Host, Prop, State, h } from '@stencil/core';

@Component({
  tag: 'pds-table-cell',
  styleUrls: ['pds-table-cell.scss'],
  shadow: true,
})
export class PdsTableCell {
  @Element() hostElement: HTMLPdsTableCellElement;
  private tableRef: HTMLPdsTableElement;

  componentWillRender() {
    this.tableRef = this.hostElement.closest('pds-table') as HTMLPdsTableElement;
  }

  componentDidLoad() {
    if (this.tableRef && this.tableRef.responsive && this.tableRef.fixedColumn) {
      // For responsive tables with fixed columns, set up scroll detection
      // This enables the first column to show a shadow when the table is scrolled horizontally
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
   * Sets the text alignment within the cell.
   */
  @Prop() cellAlign?: 'start' | 'center' | 'end' | 'justify';

  /**
   * Truncates content to a max width of 100px and adds an ellipsis.
   */
  @Prop() truncate: boolean;

  /**
   * Determines if the table is currently scrolling.
   * @defaultValue false
   */
  @State() private tableScrolling: boolean = false;

  private classNames() {
    const classNames = [];

    if (this.tableRef && this.tableRef.compact) {
      classNames.push('is-compact');
    }

    if (this.cellAlign) {
      classNames.push(`pds-table-cell--align-${this.cellAlign}`);
    }

    if (this.truncate) {
      classNames.push('is-truncated');
    }

    if (this.tableRef && this.tableRef.fixedColumn && this.tableScrolling) {
      classNames.push('has-scrolled');
    }

    return classNames.join(' ');
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

  render() {
    return (
      <Host
        class={this.classNames()}
        role="gridcell"
        style={
          this.tableRef &&
          this.tableRef.fixedColumn &&
          this.tableRef.selectable
            ? { '--fixed-cell-position': '40px' }
            : {}
          }
        >
        <slot></slot>
      </Host>
    );
  }
}
