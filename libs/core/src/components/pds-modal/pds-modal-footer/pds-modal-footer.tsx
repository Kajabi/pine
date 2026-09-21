import { Component, Element, h } from '@stencil/core';
import { unwrapReconnectedContent } from '@utils/reconnected-content';

@Component({
  tag: 'pds-modal-footer',
  styleUrl: 'pds-modal-footer.scss',
  shadow: false,
})
export class PdsModalFooter {
  @Element() el: HTMLPdsModalFooterElement;

  // Unwraps a nested .pds-modal__footer left by a page-cache (Turbo, bfcache) reconnect.
  componentDidRender() {
    unwrapReconnectedContent(this.el.querySelector('.pds-modal__footer'), '.pds-modal__footer');
  }

  render() {
    return (
      <footer class="pds-modal__footer">
        <slot></slot>
      </footer>
    );
  }
}
