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
      this.tableRef.addEventListener('scroll', this.handleScroll);
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

  private handleScroll = () => {
    if (this.tableRef.scrollLeft > 0) {
      this.tableScrolling = true;
    } else {
      this.tableScrolling = false;
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
