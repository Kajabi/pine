import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'pds-table-head',
  styleUrl: 'pds-table-head.scss',
  shadow: true,
})
export class PdsTableHead {

    // Prop to receive the selectable value from the pdsTable component
    @Prop() selectable: boolean;

    // Prop to receive the selectable value from the pdsTable component
    @Prop() selectable: boolean;

  render() {
    return (
      <Host role="row">
        {this.selectable && (
          <pds-table-checkbox-cell></pds-table-checkbox-cell>
        )}
        <slot></slot>
      </Host>
    );
  }

}
