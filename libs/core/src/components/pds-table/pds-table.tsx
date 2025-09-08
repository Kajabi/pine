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
   * Determines if the table displays a fixed header that remains visible during vertical scrolling.
   */
  @Prop() fixedHeader: boolean;

  /**
   * Maximum height of the table container. When set, enables vertical scrolling.
   * Accepts CSS height values like "400px", "50vh", etc.
   */
  @Prop() maxHeight: string;

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

  componentDidLoad() {
    if (this.responsive) {
      this.setupResponsiveScrolling();
    }

    // Synchronize fixed column widths after component loads
    if (this.responsive && this.fixedHeader && this.fixedColumn) {
      this.synchronizeFixedColumnWidths();
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
    const topShadow = this.el.shadowRoot?.querySelector('.scroll-shadow-top') as HTMLElement;
    const bottomShadow = this.el.shadowRoot?.querySelector('.scroll-shadow-bottom') as HTMLElement;
    const headerWrapper = this.el.shadowRoot?.querySelector('.pds-table-header-wrapper') as HTMLElement;

    if (container == null || leftShadow == null || rightShadow == null) {
      return;
    }

    // Store container reference for cleanup
    this.scrollContainer = container;

    /**
     * Updates the visibility of scroll shadows based on current scroll position.
     * Horizontal shadows:
     * - Left shadow: Shows when scrolled away from start (hidden if fixedColumn is enabled)
     * - Right shadow: Shows when there's content to scroll and not at the end
     * Vertical shadows (when fixedHeader and maxHeight are enabled):
     * - Top shadow: Shows when scrolled away from top
     * - Bottom shadow: Shows when there's content to scroll and not at bottom
     */
    this._responsiveHandleScroll = () => {
      if (!this.scrollContainer) return;

      const scrollLeft = this.scrollContainer.scrollLeft;
      const scrollTop = this.scrollContainer.scrollTop;
      const maxScrollLeft = this.scrollContainer.scrollWidth - this.scrollContainer.clientWidth;
      const maxScrollTop = this.scrollContainer.scrollHeight - this.scrollContainer.clientHeight;

      // Horizontal shadow logic
      leftShadow.style.opacity = (scrollLeft > 0 && !this.fixedColumn) ? '1' : '0';
      rightShadow.style.opacity = (maxScrollLeft > 0 && scrollLeft < maxScrollLeft - 1) ? '1' : '0';

      // Vertical shadow logic (only when fixed header is enabled)
      if (this.fixedHeader && (this.maxHeight != null && this.maxHeight !== '') && topShadow != null && bottomShadow != null) {
        topShadow.style.opacity = scrollTop > 0 ? '1' : '0';
        bottomShadow.style.opacity = (maxScrollTop > 0 && scrollTop < maxScrollTop - 1) ? '1' : '0';
      }

      // Update header wrapper shadow (only when fixed header is enabled)
      if (this.fixedHeader && headerWrapper != null) {
        headerWrapper.classList.toggle('has-scrolled', scrollTop > 0);
      }

      // Update fixed column shadow state
      this.updateCellScrollState();
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
        // Re-align columns on resize if using fixed header + column
        if (this.fixedHeader && this.fixedColumn) {
          setTimeout(() => this.alignFixedColumns(), 100);
        }
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

    // Also trigger width sync after scroll setup if using fixed header + column
    if (this.fixedHeader && this.fixedColumn) {
      setTimeout(() => this.alignFixedColumns(), 100);
    }
  }

  /**
   * Updates the scroll state of fixed column cells to control shadow visibility.
   * This method is called when horizontal scrolling occurs.
   * @private
   */
  private updateCellScrollState() {
    // Individual cells handle their own scroll state through their own scroll listeners
    // This method is kept for backward compatibility but cells now self-manage
    return;
  }

  /**
   * Synchronizes the width of ALL columns between header and body to prevent misalignment
   * @private
   */
  private synchronizeFixedColumnWidths() {
    // Multiple attempts to handle different DOM ready states
    setTimeout(() => this.alignFixedColumns(), 100);
    setTimeout(() => this.alignFixedColumns(), 300);
    setTimeout(() => this.alignFixedColumns(), 600);
  }

  /**
   * Aligns columns by copying computed widths from body table to header table
   * This ensures they use identical column sizing
   */
  private alignFixedColumns() {
    setTimeout(() => {
      const headerWrapper = this.el.shadowRoot?.querySelector('.pds-table-header-wrapper');
      const bodyWrapper = this.el.shadowRoot?.querySelector('.pds-table-body-wrapper');

      if (!headerWrapper || !bodyWrapper) return;

      const bodyTable = bodyWrapper.querySelector('.pds-table');
      const headerTable = headerWrapper.querySelector('.pds-table');

      if (!bodyTable || !headerTable) return;

      // Let the body table calculate its natural column widths first
      (bodyTable as HTMLElement).style.tableLayout = 'auto';
      (bodyTable as HTMLElement).style.width = '100%';

      // Force reflow
      (bodyTable as HTMLElement).offsetWidth;

      // Get all body cells from first row to determine column widths
      const firstBodyRow = bodyWrapper.querySelector('pds-table-row');
      if (!firstBodyRow) return;

      const bodyCells = firstBodyRow.querySelectorAll('pds-table-cell');
      const headerCells = headerWrapper.querySelectorAll('pds-table-head-cell');

      if (bodyCells.length !== headerCells.length) {
        console.warn('Header and body column count mismatch');
        return;
      }

      // Copy computed widths from body to header for ALL columns
      const widths: number[] = [];

      bodyCells.forEach((bodyCell, index) => {
        const bodyRect = bodyCell.getBoundingClientRect();
        widths[index] = bodyRect.width;
      });

      // Apply these exact widths to header cells
      headerCells.forEach((headerCell, index) => {
        const targetWidth = widths[index];
        if (targetWidth > 0) {
          (headerCell as HTMLElement).style.setProperty('width', `${targetWidth}px`, 'important');
          (headerCell as HTMLElement).style.setProperty('min-width', `${targetWidth}px`, 'important');
          (headerCell as HTMLElement).style.setProperty('max-width', `${targetWidth}px`, 'important');
          (headerCell as HTMLElement).style.setProperty('box-sizing', 'border-box', 'important');
        }
      });

      // Now that widths are explicitly set, use fixed layout for the header
      (headerTable as HTMLElement).style.tableLayout = 'fixed';
    }, 200);
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
    if (this.responsive) {
      const hostClasses = [
        'pds-table',
        'is-responsive',
        'pds-table-responsive-host'
      ];

      if (this.fixedHeader) {
        hostClasses.push('has-fixed-header');
      }

      if (this.maxHeight != null && this.maxHeight !== '') {
        hostClasses.push('has-max-height');
      }

      const containerStyle = (this.maxHeight != null && this.maxHeight !== '')
        ? { '--table-max-height': this.maxHeight }
        : {};

      return (
        <Host
          class={hostClasses.join(' ')}
          id={this.componentId}
          role="grid"
          selectable={this.selectable}
          tabindex="0"
        >
          <div class="scroll-shadow-left"></div>
          <div class="scroll-shadow-right"></div>
          {this.fixedHeader && <div class="scroll-shadow-top"></div>}
          {this.fixedHeader && <div class="scroll-shadow-bottom"></div>}

          <div
            class={`pds-table-responsive-container ${this.fixedHeader ? 'has-fixed-header' : ''} ${(this.maxHeight != null && this.maxHeight !== '') ? 'has-max-height' : ''}`}
            style={containerStyle}
          >
            {this.fixedHeader ? (
              <div class="pds-table-fixed-content">
                <div class="pds-table-header-wrapper">
                  <div class={this.classNames()}>
                    <slot name="header"></slot>
                  </div>
                </div>
                <div class="pds-table-body-wrapper">
                  <div class={this.classNames()}>
                    <slot name="body"></slot>
                  </div>
                </div>
              </div>
            ) : (
              <div class="pds-table-responsive-wrapper">
                <div class={this.classNames()}>
                  <slot></slot>
                </div>
              </div>
            )}
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
      >
        <slot></slot>
      </Host>
    );
  }
}
