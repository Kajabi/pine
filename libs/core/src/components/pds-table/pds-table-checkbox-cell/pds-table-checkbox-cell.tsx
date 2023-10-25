import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'pds-table-checkbox-cell',
  styleUrl: 'pds-table-checkbox-cell.scss',
  shadow: true,
})
export class PdsTableCheckboxCell {

  render() {
    return (
      <Host role="gridcell">
        <slot></slot>
      </Host>
    );
  }
}
