import { Component, Element, Host, h } from '@stencil/core';

@Component({
  tag: 'pds-table-checkbox-cell',
  styleUrl: 'pds-table-checkbox-cell.scss',
  shadow: true,
})
export class PdsTableCheckboxCell {
  @Element() hostElement: HTMLPdsTableCheckboxCellElement;

  render() {
    return (
      <Host role="gridcell">
        <slot></slot>
      </Host>
    );
  }
}
