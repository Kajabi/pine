import { Component, Element, Host, Prop, State, Watch, h } from '@stencil/core';
import { setupTruncationTooltip } from '../../../utils/truncation-tooltip';

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
  private truncationCleanup: (() => void) | null = null;

  componentWillRender() {
    this.tableRef = this.hostElement.closest('pds-table') as HTMLPdsTableElement;
  }

  componentDidLoad() {
    if (this.tableRef && this.tableRef.responsive && this.tableRef.fixedColumn) {
      // For responsive tables with fixed columns, set up scroll detection
      // This enables the first column to show a shadow when the table is scrolled horizontally
      this.setupScrollListener();
    }

    if (this.truncate) {
      this.initTruncationTooltip();
    }
  }

  disconnectedCallback() {
    this.cleanupScrollListener();
    this.destroyTruncationTooltip();
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
   * Sets the text alignment within the cell.
   */
  @Prop() cellAlign?: 'start' | 'center' | 'end' | 'justify';

  /**
   * Truncates content to a max width and adds an ellipsis.
   * When text overflows, a tooltip showing the full text will appear on hover/focus.
   * Note: When truncate is enabled, the element automatically receives tabindex="0" for keyboard accessibility.
   */
  @Prop() truncate: boolean;

  @Watch('truncate')
  handleTruncateChange(newValue: boolean) {
    if (newValue) {
      this.initTruncationTooltip();
    } else {
      this.destroyTruncationTooltip();
    }
  }

  /**
   * Determines if the table is currently scrolling.
   * @defaultValue false
   */
  @State() private tableScrolling: boolean = false;

  private initTruncationTooltip() {
    this.destroyTruncationTooltip();

    this.truncationCleanup = setupTruncationTooltip({
      hostEl: this.hostElement,
      contentEl: this.hostElement,
      getTooltipText: () => this.hostElement.textContent || '',
    });
  }

  private destroyTruncationTooltip() {
    if (this.truncationCleanup) {
      this.truncationCleanup();
      this.truncationCleanup = null;
    }
  }

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
        part="cell"
        tabIndex={this.truncate ? 0 : undefined}
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
