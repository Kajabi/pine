import { Component, Element, Host, Prop, State, h } from '@stencil/core';

@Component({
  tag: 'pds-table-cell',
  styleUrls: ['pds-table-cell.scss'],
  shadow: true,
})
export class PdsTableCell {
  @Element() hostElement: HTMLPdsTableCellElement;
  private tableRef: HTMLPdsTableElement;
  private scrollContainer: HTMLElement | null = null;
  private setupTimer: number | undefined;
  private setupRetries: number = 0;

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

  componentDidLoad() {
    if (this.tableRef && this.tableRef.responsive && this.tableRef.fixedColumn && this.isFirstCellInRow()) {
      // For responsive tables with fixed columns, set up scroll detection
      // This enables the first column to show a shadow when the table is scrolled horizontally
      this.setupScrollListener();
    }
  }

  disconnectedCallback() {
    this.cleanupScrollListener();
  }

  private setupScrollListener() {
    if (this.tableRef == null) {
      return;
    }

    // Query shadowRoot once and cache the container
    const container = this.tableRef.shadowRoot?.querySelector('.pds-table-responsive-container') as HTMLElement;

    if (container != null) {
      // Container available immediately
      this.scrollContainer = container;
      this.scrollContainer.addEventListener('scroll', this.handleScroll, { passive: true });
      this.handleScroll(); // Initial check
      this.setupRetries = 0; // Reset counter on success
    } else {
      // Container not ready, set up timer for retry with bounds
      this.setupTimer = window.setTimeout(() => {
        if (this.scrollContainer) return; // Already found
        this.setupRetries = (this.setupRetries || 0) + 1;
        if (this.setupRetries <= 50) {
          this.setupScrollListener();
        } else {
          console.warn('Failed to find responsive container after 50 attempts');
        }
      }, 100);
    }
  }

  private cleanupScrollListener() {
    if (this.scrollContainer) {
      this.scrollContainer.removeEventListener('scroll', this.handleScroll);
      this.scrollContainer = null;
    }

    if (this.setupTimer !== undefined) {
      window.clearTimeout(this.setupTimer);
      this.setupTimer = undefined;
    }

    this.setupRetries = 0; // Reset retry counter
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

    if (this.cellAlign != null) {
      classNames.push(`pds-table-cell--align-${this.cellAlign}`);
    }

    if (this.truncate) {
      classNames.push('is-truncated');
    }

    // Check if this cell should be fixed (first cell in row + fixedColumn enabled)
    if (this.tableRef && this.tableRef.fixedColumn && this.isFirstCellInRow()) {
      classNames.push('is-fixed');
    }

    if (this.tableRef && this.tableRef.fixedColumn && this.isFirstCellInRow() && this.tableScrolling) {
      classNames.push('has-scrolled');
    }

    return classNames.join(' ');
  }

  /**
   * Determines if this cell is the first cell in its parent row
   */
  private isFirstCellInRow(): boolean {
    const parentRow = this.hostElement.parentElement;
    if (!parentRow) return false;

    const firstCell = parentRow.querySelector('pds-table-cell');
    return firstCell === this.hostElement;
  }

  /**
   * Handles scroll events to update fixed column shadow state.
   * Updates the tableScrolling state to control CSS classes for fixed column shadows.
   * @private
   */
  private handleScroll = () => {
    if (!this.scrollContainer) {
      return;
    }

    try {
      this.tableScrolling = this.scrollContainer.scrollLeft > 0;
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
