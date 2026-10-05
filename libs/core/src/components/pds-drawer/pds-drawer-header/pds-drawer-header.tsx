import { Component, Element, h } from '@stencil/core';
import { unwrapReconnectedContent } from '@utils/reconnected-content';

@Component({
  tag: 'pds-drawer-header',
  styleUrl: 'pds-drawer-header.scss',
  shadow: false,
})
export class PdsDrawerHeader {
  @Element() el: HTMLPdsDrawerHeaderElement;

  // Unwraps a nested .pds-drawer__header left by a page-cache (Turbo, bfcache) reconnect.
  componentDidRender() {
    unwrapReconnectedContent(this.el.querySelector('.pds-drawer__header'), '.pds-drawer__header');
  }

  render() {
    return (
      <header class="pds-drawer__header">
        <slot></slot>
      </header>
    );
  }
}
