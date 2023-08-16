import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'pds-sortable-item',
  styleUrl: 'pds-sortable-item.css',
  shadow: true,
})
export class PdsSortableItem {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
