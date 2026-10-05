import { Component, Element, h } from '@stencil/core';
import { unwrapReconnectedContent } from '@utils/reconnected-content';

@Component({
  tag: 'pds-drawer-footer',
  styleUrl: 'pds-drawer-footer.scss',
  shadow: false,
})
export class PdsDrawerFooter {
  @Element() el: HTMLPdsDrawerFooterElement;

  // Unwraps a nested .pds-drawer__footer left by a page-cache (Turbo, bfcache) reconnect.
  componentDidRender() {
    unwrapReconnectedContent(this.el.querySelector('.pds-drawer__footer'), '.pds-drawer__footer');
  }

  render() {
    return (
      <footer class="pds-drawer__footer">
        <slot></slot>
      </footer>
    );
  }
}
