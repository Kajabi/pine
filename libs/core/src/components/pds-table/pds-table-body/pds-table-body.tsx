import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'pds-table-body',
  styleUrls: ['../../../global/styles/base.scss', 'pds-table-body.scss'],
  shadow: true,
})
export class PdsTableBody {

  render() {
    return (
      <Host role="rowgroup">
        <slot></slot>
      </Host>
    );
  }
}
