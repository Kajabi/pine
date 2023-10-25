import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'pds-table-cell',
  styleUrl: 'pds-table-cell.scss',
  shadow: true,
})
export class PdsTableCell {
  /**
   *  Prop to receive the compact value from the `pdsTable` parent component.
   */
  @Prop() compact: boolean;

  private classNames() {
    const classNames = [];

    if (this.compact) {
      classNames.push('is-compact');
    }

    return classNames.join('  ');
  }

  render() {
    return (
      <Host class={this.classNames()} role="gridcell">
        <slot></slot>
      </Host>
    );
  }
}
