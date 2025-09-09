import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'pds-table-body',
  styleUrls: ['pds-table-body.scss'],
  shadow: true,
})
export class PdsTableBody {

  render() {
    return (
      <Host role="rowgroup" part="body">
        <slot></slot>
      </Host>
    );
  }
}
