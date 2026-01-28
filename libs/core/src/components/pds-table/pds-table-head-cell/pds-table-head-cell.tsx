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
   * Determines if this column is the currently active sorted column.
   * @defaultValue false
   */
  @State() private isActive: boolean = false;

  /**
   * Programmatically sets this column as the active sort column with the specified direction.
   * Used by pds-table to apply a default sort on initial load.
   * @param direction - The sort direction to apply ('asc' or 'desc')
   */
  @Method()
  async setActiveSort(direction: 'asc' | 'desc') {
    if (!this.sortable) return;

    this.sortingDirection = direction;
    this.isActive = true;
    this.hostElement.classList.add('is-active');
  }

  /**
   * Clears the active sort state from this column.
   * Used internally when another column becomes active.
   */
  @Method()
  async clearActiveSort() {
    this.isActive = false;
    this.hostElement.classList.remove('is-active');
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
      // Guard: return early if tableRef is not available
      if (!this.tableRef) {
        return;
      }

      const column = this.hostElement.innerText.trim();

      // Check if parent table has server-side sorting enabled
      const isServerSide = this.tableRef.serverSideSorting;

      // In server-side mode, don't update visual state - let the server response handle it
      if (!isServerSide) {
        // Always toggle the direction (preserves original behavior)
        this.sortingDirection = this.sortingDirection === 'asc' ? 'desc' : 'asc';

        // Reset all OTHER head cells to inactive state (skip the current one)
        this.tableRef.querySelectorAll('pds-table-head-cell').forEach(async (headCell) => {
          // Skip clearing the current cell
          if (headCell !== this.hostElement) {
            const headCellComponent = headCell as HTMLPdsTableHeadCellElement;
            await headCellComponent.clearActiveSort();
          }
        });

        // Mark this column as active
        this.isActive = true;
        this.hostElement.classList.add('is-active');
      } else {
        // Server-side mode: Calculate the next direction for the event
        // but don't update visual state yet
        this.sortingDirection = this.sortingDirection === 'asc' ? 'desc' : 'asc';
      }

      // Always emit the sort event
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
        {this.sortable && this.isActive && (
          <pds-icon icon={this.sortingDirection === 'asc' ? upSmall : downSmall} part="sort-icon" />
        )}
      </Host>
    );
  }
}
