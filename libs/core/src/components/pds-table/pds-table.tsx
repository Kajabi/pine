import { Component, Element, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'pds-table',
  styleUrl: 'pds-table.scss',
  shadow: true,
})
export class PdsTable {
  @Element() el: HTMLPdsTableElement;

  /**
   * Determines if table displays compact which reduces the spacing of table cells.
   */
  @Prop() compact: boolean;

  /**
   * A unique identifier used for the table `id` attribute.
   */
  @Prop() componentId!: string;

  /**
   * Determines if table displays checkboxes for selectable rows.
   */
  @Prop() selectable: boolean;

  componentDidLoad() {
    this.passPropsToChildren();
  }

  private passPropsToChildren = () => {
    const tableRows = this.el.querySelectorAll('pds-table-row, pds-table-head');
    const tableCells = this.el.querySelectorAll('pds-table-cell, pds-table-head-cell');

    // Loop through table rows and add the class based on the "selectable" property.
    tableRows.forEach((row) => {
      row['selectable'] = this.selectable;
    });

    tableCells.forEach((cell) => {
      cell['compact'] = this.compact;
      if (this.compact) {
        cell.classList.add('is-compact');
      } else {
        cell.classList.remove('is-compact');
      }
    });
  };

  private classNames() {
    const classNames = ['pds-table'];

    if (this.selectable) {
      classNames.push('pds-table--' + this.selectable);
    }

    if (this.compact) {
      classNames.push('is-compact');
    }

    return classNames.join('  ');
  }

  render() {
    return (
      <Host
        class={this.classNames()}
        id={this.componentId}
        role="grid"
        selectable={this.selectable}
      >
        <slot></slot>
      </Host>
    );
  }
}
