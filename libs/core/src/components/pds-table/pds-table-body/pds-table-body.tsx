import { Component, Host, h } from '@stencil/core';

/**
 * @part body - Set on the `pds-table-body` element itself, so `::part(body)` matches it only from a shadow root that contains it. Style `pds-table-body` directly instead.
 */
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
