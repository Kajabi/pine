import { Component, Element, Event, EventEmitter, Host, h, Prop, State, Listen } from '@stencil/core';

@Component({
  tag: 'pds-table',
  styleUrls: ['pds-table.scss'],
  shadow: true,
})
export class PdsTable {
  @Element() el: HTMLPdsTableElement;
  private scrollContainer: HTMLElement | null = null;
  private _responsiveHandleScroll: (() => void) | null = null;
  private _responsiveHandleResize: (() => void) | null = null;
  private _responsiveResizeObserver: ResizeObserver | null = null;
  private _teardownResponsive: (() => void) | null = null;

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
   * Adds divider borders between table rows. The last row will not have a bottom border.
   * @defaultValue false
   */
  @Prop({ reflect: true }) rowDividers: boolean = false;

  /**
   * The name of the column to sort by on initial load.
   * Must match the text content of a sortable column header.
   */
  @Prop() defaultSortColumn?: string;

  /**
   * The direction to sort the default column on initial load.
   * Only applies if `defaultSortColumn` is set.
   * @defaultValue 'asc'
   */
  @Prop() defaultSortDirection?: 'asc' | 'desc' = 'asc';

  /**
   * Enables server-side sorting mode. When enabled, clicking sortable columns will only
   * dispatch the `pdsTableSort` event without performing client-side DOM manipulation.
   * The consuming application is responsible for handling sort logic and re-rendering
   * the table with sorted data via server request or state management.
   * Use `defaultSortColumn` and `defaultSortDirection` to display the correct sort indicator.
   * @defaultValue false
   */
  @Prop() serverSideSorting: boolean = false;

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

  componentDidLoad() {
    if (this.responsive) {
      this.setupResponsiveScrolling();
    }

    // Apply default sort if specified
    if (this.defaultSortColumn) {
      void this.applyDefaultSort().catch((err) => {
        console.warn('Failed to apply default sort.', err);
      });
    }
  }

  /**
   * Applies the default sort configuration on initial load.
   * Finds the matching column header and activates its sort state.
   * @private
   */
  private async applyDefaultSort() {
    // Normalize direction to handle invalid HTML attribute values
    const direction: 'asc' | 'desc' = this.defaultSortDirection === 'desc' ? 'desc' : 'asc';

    // Find the matching sortable header cell
    const columnHeaderCells = Array.from(
      this.el.querySelectorAll('pds-table-head-cell[sortable]')
    ) as HTMLPdsTableHeadCellElement[];

    const matchingCell = columnHeaderCells.find(
      (cell) => (cell.textContent ?? '').trim() === this.defaultSortColumn
    );

    if (matchingCell) {
      const columnName = (matchingCell.textContent ?? '').trim();
      // Sort the table data
      this.sortTable(columnName, direction);
      this.sortingColumn = columnName;
      this.sortingDirection = direction;

      // Activate the visual state on the header cell
      await matchingCell.setActiveSort(direction);
    } else {
      console.warn(`Default sort column "${this.defaultSortColumn}" not found.`);
    }
  }

  disconnectedCallback() {
    if (this._teardownResponsive) {
      this._teardownResponsive();
      this._teardownResponsive = null;
    }
  }

  /**
   * Sets up responsive scrolling behavior for the table.
   *
   * This method creates a horizontal scrolling system where:
   * - The table content can scroll horizontally when it exceeds the container width
   * - Scroll shadows appear at the left/right edges to indicate scrollable content
   * - Fixed columns remain sticky during horizontal scrolling
   * - Shadows respect border-radius and don't appear when there's nothing to scroll
   *
   * Architecture:
   * - Host element: Contains everything, respects parent constraints
   * - Container element: Handles horizontal scrolling (overflow-x: auto)
   * - Shadow elements: Positioned fixed relative to host, show scroll indicators
   *
   * @private
   */
  private setupResponsiveScrolling() {
    const container = this.el.shadowRoot?.querySelector('.pds-table-responsive-container') as HTMLElement;
    const leftShadow = this.el.shadowRoot?.querySelector('.scroll-shadow-left') as HTMLElement;
    const rightShadow = this.el.shadowRoot?.querySelector('.scroll-shadow-right') as HTMLElement;

    if (!container || !leftShadow || !rightShadow) return;

    // Store container reference for cleanup
    this.scrollContainer = container;

    /**
     * Updates the visibility of scroll shadows based on current scroll position.
     * Left shadow: Shows when scrolled away from start (hidden if fixedColumn is enabled)
     * Right shadow: Shows when there's content to scroll and not at the end
     */
    this._responsiveHandleScroll = () => {
      if (!this.scrollContainer) return;

      const scrollLeft = this.scrollContainer.scrollLeft;
      const maxScrollLeft = this.scrollContainer.scrollWidth - this.scrollContainer.clientWidth;

      // Show left shadow when scrolled away from start, but not if there's a fixed column
      leftShadow.style.opacity = (scrollLeft > 0 && !this.fixedColumn) ? '1' : '0';

      // Show right shadow only if there's content to scroll AND not at end
      rightShadow.style.opacity = (maxScrollLeft > 0 && scrollLeft < maxScrollLeft - 1) ? '1' : '0';
    };

    // Add scroll event listener to container element
    this.scrollContainer.addEventListener('scroll', this._responsiveHandleScroll, { passive: true });

    // Add resize observer to update shadows when container size changes
    if (typeof window !== 'undefined' && window.ResizeObserver) {
      try {
        this._responsiveResizeObserver = new ResizeObserver(() => {
          this._responsiveHandleScroll?.();
        });
        this._responsiveResizeObserver.observe(this.scrollContainer);
      } catch (error) {
        // ResizeObserver not available in some environments (e.g., tests)
        // Fall back to window resize listener only
      }
    }

    // Listen for window resize as fallback
    if (typeof window !== 'undefined') {
      this._responsiveHandleResize = () => {
        this._responsiveHandleScroll?.();
      };
      window.addEventListener('resize', this._responsiveHandleResize);
    }

    // Create teardown function for cleanup
    this._teardownResponsive = () => {
      if (this.scrollContainer && this._responsiveHandleScroll) {
        this.scrollContainer.removeEventListener('scroll', this._responsiveHandleScroll);
        this.scrollContainer = null;
      }

      if (this._responsiveResizeObserver) {
        this._responsiveResizeObserver.disconnect();
        this._responsiveResizeObserver = null;
      }

      if (typeof window !== 'undefined' && this._responsiveHandleResize) {
        window.removeEventListener('resize', this._responsiveHandleResize);
        this._responsiveHandleResize = null;
      }

      this._responsiveHandleScroll = null;
    };

    // Initial check after setup
    this._responsiveHandleScroll();
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

    // Return early if no table body exists
    if (!tableBody) return;

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
    if (event.defaultPrevented) return;

    // Skip client-side sorting if server-side mode is enabled
    if (this.serverSideSorting) {
      // Just update state for visual indicators, don't manipulate DOM
      this.sortingColumn = event.detail.column;
      this.sortingDirection = event.detail.direction;
      return;
    }

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
    if (this.responsive) {
      return (
        <Host
          class="pds-table is-responsive pds-table-responsive-host"
          id={this.componentId}
          role="grid"
          selectable={this.selectable}
          tabindex="0"
          part="table responsive-table"
        >
          <div class="scroll-shadow-left" part="scroll-shadow-left"></div>
          <div class="scroll-shadow-right" part="scroll-shadow-right"></div>
          <div class="pds-table-responsive-container" part="responsive-container">
            <div class="pds-table-responsive-wrapper" part="responsive-wrapper">
              <div class={this.classNames()} part="table-inner">
                <slot></slot>
              </div>
            </div>
          </div>
        </Host>
      );
    }

    return (
      <Host
        class={this.classNames()}
        id={this.componentId}
        role="grid"
        selectable={this.selectable}
        tabindex="0"
        part="table"
      >
        <slot></slot>
      </Host>
    );
  }
}
