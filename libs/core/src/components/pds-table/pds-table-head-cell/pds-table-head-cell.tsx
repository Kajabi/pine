import { Component, Element, Host, Prop, h, Event, EventEmitter, State, Method } from '@stencil/core';

import { downSmall, upSmall } from '@pine-ds/icons/icons';

@Component({
  tag: 'pds-table-head-cell',
  styleUrls: ['pds-table-head-cell.scss'],
  shadow: true,
})
export class PdsTableHeadCell {
  @Element() hostElement: HTMLPdsTableHeadCellElement;
  private tableRef: HTMLPdsTableElement;
  private scrollContainer: HTMLElement | null = null;
  private setupTimer: number | undefined;
  private setupRetries: number = 0;
  private headObserver?: MutationObserver;

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

  /**
   * Determines if the parent table-head has the border attribute.
   * @defaultValue false
   */
  @State() private hasHeadBorder: boolean = false;

  /**
   * Determines if the parent table-head has the background attribute.
   * @defaultValue false
   */
  @State() private hasHeadBackground: boolean = false;

  /**
   * Programmatically sets this column as the active sort column with the specified direction.
   * Used by pds-table to apply a default sort on initial load.
   * @param direction - The sort direction to apply ('asc' or 'desc')
   */
  @Method()
  async setActiveSort(direction: 'asc' | 'desc') {
    this.sortingDirection = direction;
    this.hostElement.classList.add('is-active');
  }

  componentWillLoad() {
    // Set initial references and state before first render
    this.tableRef = this.hostElement.closest('pds-table') as HTMLPdsTableElement;

    const tableHead = this.hostElement.closest('pds-table-head') as HTMLElement;
    if (tableHead) {
      this.hasHeadBorder = tableHead.hasAttribute('border');
      this.hasHeadBackground = tableHead.hasAttribute('background');
    }
  }

  componentDidLoad() {
    if (this.tableRef && this.tableRef.responsive && this.tableRef.fixedColumn) {
      // For responsive tables with fixed columns, set up scroll detection
      // This enables the first column header to show a shadow when the table is scrolled horizontally
      this.setupScrollListener();
    }

    // Watch for changes to the parent table-head's border and background attributes
    const tableHead = this.hostElement.closest('pds-table-head') as HTMLElement;
    if (tableHead && typeof MutationObserver !== 'undefined') {
      // Defensive guard: disconnect existing observer before creating a new one
      if (this.headObserver) {
        this.headObserver.disconnect();
      }

      this.headObserver = new MutationObserver(() => {
        // Update state when border or background attributes change
        this.hasHeadBorder = tableHead.hasAttribute('border');
        this.hasHeadBackground = tableHead.hasAttribute('background');
      });

      this.headObserver.observe(tableHead, {
        attributes: true,
        attributeFilter: ['border', 'background']
      });
    }
  }

  disconnectedCallback() {
    this.cleanupScrollListener();

    if (this.headObserver) {
      this.headObserver.disconnect();
    }
  }


  private setupScrollListener() {
    if (!this.tableRef) return;

    // Query shadowRoot once and cache the container
    const container = this.tableRef.shadowRoot?.querySelector('.pds-table-responsive-container') as HTMLElement;

    if (container) {
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

    if (this.hasHeadBackground) {
      classNames.push('has-head-background');
    }

    if (this.hasHeadBorder) {
      classNames.push('has-head-border');
    }

    return classNames.join(' ');
  }

  render() {
    return (
      <Host
        class={this.classNames()}
        role="columnheader"
        onClick={this.toggleSort}
        part="head-cell"
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
          <pds-icon icon={this.sortingDirection === 'asc' ? upSmall : downSmall} part="sort-icon" />
        )}
      </Host>
    );
  }
}
