import { Component, Element, Event, EventEmitter, Host, h, Prop, State, Listen, Watch, forceUpdate } from '@stencil/core';
import { getScrollOffsetFromStart } from '../../utils/scroll';

// A column with no width of its own, under table-layout: fixed, otherwise shares whatever's left
// after the explicit-width columns -- which can go to nothing on a narrow viewport. Below this,
// it keeps this floor instead, and the table grows wider (scrollable under `responsive`) rather
// than squeeze it further.
const AUTO_COLUMN_FLOOR_WIDTH_PX = 120;

/**
 * @part responsive-container - Exposes the horizontal scroll container for styling. Appears only when `responsive` is set.
 * @part responsive-table - Set on the `pds-table` element itself when `responsive` is set, so `::part(responsive-table)` matches it only from a shadow root that contains it. Style `pds-table` directly instead.
 * @part responsive-wrapper - Exposes the wrapper inside the scroll container for styling. Appears only when `responsive` is set.
 * @part scroll-shadow-left - Exposes the scroll shadow at the inline-start edge for styling. Appears only when `responsive` is set.
 * @part scroll-shadow-right - Exposes the scroll shadow at the inline-end edge for styling. Appears only when `responsive` is set.
 * @part table - Set on the `pds-table` element itself, so `::part(table)` matches it only from a shadow root that contains it. Style `pds-table` directly instead.
 * @part table-inner - Exposes the inner table element around the slotted head and body for styling. Appears only when `responsive` is set.
 */
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
  private _fixedLayoutResizeObserver: ResizeObserver | null = null;
  private _fixedLayoutHandleResize: (() => void) | null = null;

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
   * Determines if the table displays a fixed first column.
   */
  @Prop() fixedColumn: boolean;

  /**
   * Determines if the table displays checkboxes for selectable rows.
   */
  @Prop() selectable: boolean;

  /**
   * Hides the select-all checkbox in the table header while keeping individual row checkboxes functional.
   * Only applies when `selectable` is true.
   * @defaultValue false
   */
  @Prop() disableSelectAll: boolean = false;

  /**
   * Adds divider borders between table rows. The last row will not have a bottom border.
   * @defaultValue false
   */
  @Prop({ reflect: true }) rowDividers: boolean = false;

  /**
   * Sets how the table sizes its columns. With `auto`, each column is sized from its content,
   * so columns can change width when the rows change (for example after a sort). With `fixed`,
   * columns take the `width` set on their `pds-table-head-cell` and ignore their content;
   * columns without a `width` share the remaining space, down to a 120px floor on narrow
   * viewports where the other columns' widths already fill it. Content longer than its column
   * overflows, so add `truncate` to cells whose content may not fit.
   * @defaultValue 'auto'
   */
  @Prop() tableLayout: 'auto' | 'fixed' = 'auto';

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
   * Event that is emitted by `pds-table-head` when the select all checkbox is clicked, carrying the selected value.
   * It bubbles through the table; the table doesn't emit it itself.
   */
  @Event() pdsTableSelectAll: EventEmitter<{ isSelected: boolean }>;

  componentDidLoad() {
    if (this.responsive) {
      this.setupResponsiveScrolling();
    }

    if (this.tableLayout === 'fixed') {
      this.setupFixedLayoutWidths();
    }

    // Apply default sort if specified
    // Use requestAnimationFrame to defer until child components are fully initialized
    if (this.defaultSortColumn) {
      requestAnimationFrame(() => {
        void this.applyDefaultSort().catch((err) => {
          console.warn('Failed to apply default sort.', err);
        });
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

    this.teardownFixedLayoutWidths();
  }

  /**
   * A head cell only reads `tableLayout` during its own render, and the floor this sets lives in
   * inline style, not a re-render -- so switching away from `fixed` (including live, e.g. the
   * Storybook control) needs both cleared explicitly, not just the observer torn down.
   */
  @Watch('tableLayout')
  handleTableLayoutChange(newValue: 'auto' | 'fixed') {
    this.teardownFixedLayoutWidths();
    if (newValue === 'fixed') this.setupFixedLayoutWidths();

    (Array.from(this.el.querySelectorAll('pds-table-head-cell')) as HTMLPdsTableHeadCellElement[]).forEach((cell) => {
      if (newValue !== 'fixed') cell.style.removeProperty('--pds-table-head-cell-auto-floor-width');
      forceUpdate(cell);
    });
  }

  /**
   * Measures the explicit-width columns against the available space and gives the columns with
   * no `width` of their own (which otherwise share whatever's left) a floor so none of them
   * squeeze below `AUTO_COLUMN_FLOOR_WIDTH_PX`. Re-run on resize, since the available space -- the
   * responsive container's width, or the table's own width otherwise -- can change after load.
   * @private
   */
  private recalcAutoColumnWidths = () => {
    if (this.tableLayout !== 'fixed') return;

    const headCells = Array.from(this.el.querySelectorAll('pds-table-head-cell')) as HTMLPdsTableHeadCellElement[];
    const autoCells: HTMLPdsTableHeadCellElement[] = [];
    let explicitWidthPx = 0;

    for (const cell of headCells) {
      if (!cell.getAttribute('width')) {
        autoCells.push(cell);
        continue;
      }

      // Measured from layout rather than parsed from the attribute, so any CSS length -- px,
      // rem, %, a token -- counts correctly, the same as the select-all column below.
      explicitWidthPx += cell.getBoundingClientRect().width;
    }

    if (autoCells.length === 0) return;

    // A selectable table's select-all column lives in pds-table-head's shadow root, out of reach
    // of the query above, and its width is a token rather than a px value -- so measure it.
    if (this.selectable) {
      const selectAllCell = this.el
        .querySelector('pds-table-head')
        ?.shadowRoot?.querySelector('pds-table-head-cell') as HTMLElement | null;
      explicitWidthPx += selectAllCell?.getBoundingClientRect().width ?? 0;
    }

    const measureEl = this.responsive
      ? (this.el.shadowRoot?.querySelector('.pds-table-responsive-container') as HTMLElement | null)
      : this.el;
    const availableWidth = measureEl?.clientWidth ?? 0;
    const sharePerAutoColumn = (availableWidth - explicitWidthPx) / autoCells.length;
    const needsFloor = sharePerAutoColumn < AUTO_COLUMN_FLOOR_WIDTH_PX;

    autoCells.forEach((cell) => {
      if (needsFloor) {
        cell.style.setProperty('--pds-table-head-cell-auto-floor-width', `${AUTO_COLUMN_FLOOR_WIDTH_PX}px`);
      } else {
        cell.style.removeProperty('--pds-table-head-cell-auto-floor-width');
      }
    });
  };

  private setupFixedLayoutWidths() {
    this.recalcAutoColumnWidths();

    if (typeof window === 'undefined') return;

    this._fixedLayoutHandleResize = () => this.recalcAutoColumnWidths();

    if (window.ResizeObserver) {
      try {
        this._fixedLayoutResizeObserver = new ResizeObserver(this._fixedLayoutHandleResize);
        this._fixedLayoutResizeObserver.observe(this.el);
      } catch (error) {
        // ResizeObserver not available in some environments (e.g., tests); window resize still covers it.
      }
    }

    window.addEventListener('resize', this._fixedLayoutHandleResize);
  }

  private teardownFixedLayoutWidths() {
    if (this._fixedLayoutResizeObserver) {
      this._fixedLayoutResizeObserver.disconnect();
      this._fixedLayoutResizeObserver = null;
    }

    if (typeof window !== 'undefined' && this._fixedLayoutHandleResize) {
      window.removeEventListener('resize', this._fixedLayoutHandleResize);
    }

    this._fixedLayoutHandleResize = null;
  }

  /**
   * Sets up responsive scrolling behavior for the table.
   *
   * This method creates a horizontal scrolling system where:
   * - The table content can scroll horizontally when it exceeds the container width
   * - Scroll shadows appear at the inline-start/end edges to indicate scrollable content
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
     * Inline-start shadow: shows when scrolled away from start (hidden if fixedColumn is enabled)
     * Inline-end shadow: shows when there is content to scroll and not at the end
     */
    this._responsiveHandleScroll = () => {
      if (!this.scrollContainer) return;

      const { scrollWidth, clientWidth } = this.scrollContainer;
      const maxScroll = scrollWidth - clientWidth;
      const scrollOffset = getScrollOffsetFromStart(this.scrollContainer);

      // Inline-start shadow when scrolled away from start, but not if there's a fixed column
      leftShadow.style.opacity = (scrollOffset > 0 && !this.fixedColumn) ? '1' : '0';

      // Inline-end shadow when there is content to scroll and not at the end
      rightShadow.style.opacity = (maxScroll > 0 && scrollOffset < maxScroll - 1) ? '1' : '0';
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

    if (this.tableLayout === 'fixed') {
      classNames.push('is-fixed-layout');
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
    if (headerCheckbox) {
      headerCheckbox.checked = allSelectedRows;
      headerCheckbox.indeterminate = !allSelectedRows && !noneSelectedRows;
    }
  }

  render() {
    if (this.responsive) {
      return (
        <Host
          class={`${this.classNames()} pds-table-responsive-host`}
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
