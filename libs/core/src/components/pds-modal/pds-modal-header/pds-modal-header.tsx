import { Component, Element, h } from '@stencil/core';
import { unwrapReconnectedContent } from '@utils/reconnected-content';

/**
 * Holds the modal's title and close control. It adds no padding or layout, so wrap its content in a `pds-box` with `padding="md"`.
 * @lightDom renders-markup
 */
@Component({
  tag: 'pds-modal-header',
  styleUrl: 'pds-modal-header.scss',
  shadow: false,
})
export class PdsModalHeader {
  @Element() el: HTMLPdsModalHeaderElement;

  // Unwraps a nested .pds-modal__header left by a page-cache (Turbo, bfcache) reconnect.
  componentDidRender() {
    unwrapReconnectedContent(this.el.querySelector('.pds-modal__header'), '.pds-modal__header');
  }

  render() {
    return (
      <header class="pds-modal__header">
        <slot></slot>
      </header>
    );
  }
}
