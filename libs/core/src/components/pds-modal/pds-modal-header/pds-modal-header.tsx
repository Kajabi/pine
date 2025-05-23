import { Component, h } from '@stencil/core';

@Component({
  tag: 'pds-modal-header',
  styleUrl: 'pds-modal-header.scss',
  shadow: false,
})
export class PdsModalHeader {
  render() {
    return (
      <header class="pds-modal__header">
        <slot></slot>
      </header>
    );
  }
}
