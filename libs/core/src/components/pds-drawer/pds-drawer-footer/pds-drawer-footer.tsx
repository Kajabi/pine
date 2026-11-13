import { Component, Element, h } from '@stencil/core';
import { unwrapReconnectedContent } from '@utils/reconnected-content';

/**
 * Holds the drawer's actions in a padded row aligned to the end, with a divider above.
 * @lightDom renders-markup
 */
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
