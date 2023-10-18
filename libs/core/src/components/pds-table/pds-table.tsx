import { Component, Element, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'pds-table',
  styleUrl: 'pds-table.scss',
  shadow: true,
})
export class PdsTable {


  @Element() el: HTMLPdsTableElement;

  componentDidLoad() {
    this.passPropsToChildren()
  }

  private passPropsToChildren = () => {

    const tableRows = this.el.querySelectorAll('pds-table-row, pds-table-head');
    tableRows.forEach(child => {
      child['selectable'] = this.selectable;
    });
  }

  /**
   * A unique identifier used for the table `id` attribute.
   */
  @Prop() componentId!: string;

  /**
   * Determines if table displays checkboxes for selectable rows.
   */
  @Prop() selectable: boolean;

  private classNames() {
    const classNames = ['pds-table'];

    if (this.selectable) {
      classNames.push('pds-table--' + this.selectable);
    }

    return classNames.join('  ');
  }

  render() {
    return (
      <Host class={this.classNames()} id={this.componentId} selectable={this.selectable} role="grid">
        <slot></slot>
      </Host>
    );
  }
}
