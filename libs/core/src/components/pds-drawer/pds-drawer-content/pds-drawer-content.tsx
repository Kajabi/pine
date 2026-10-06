import { Component, Element, h } from '@stencil/core';
import { unwrapReconnectedContent } from '@utils/reconnected-content';

/**
 * Fills the drawer panel's height by default — unlike `pds-modal-content`,
 * which caps itself against the viewport for a centered, possibly-shorter
 * modal, a drawer panel is already edge-to-edge, so its content can simply
 * flex to fill whatever space the header and footer leave.
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
