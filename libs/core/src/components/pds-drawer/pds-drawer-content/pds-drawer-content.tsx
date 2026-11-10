import { Component, Element, h } from '@stencil/core';
import { unwrapReconnectedContent } from '@utils/reconnected-content';

/**
 * Fills the space between the drawer header and footer.
 * @lightDom renders-markup
 */
@Component({
  tag: 'pds-drawer-content',
  styleUrl: 'pds-drawer-content.scss',
  shadow: false,
})
export class PdsDrawerContent {
  @Element() el: HTMLPdsDrawerContentElement;

  // Unwraps a nested .pds-drawer-content left by a page-cache (Turbo, bfcache) reconnect.
  componentDidRender() {
    unwrapReconnectedContent(this.el.querySelector('.pds-drawer-content'), '.pds-drawer-content');
  }

  render() {
    return (
      <div class="pds-drawer-content">
        <slot></slot>
      </div>
    );
  }
}
