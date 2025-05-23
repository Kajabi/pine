import { Component, h } from '@stencil/core';

@Component({
  tag: 'pds-modal-footer',
  styleUrl: 'pds-modal-footer.scss',
  shadow: false,
})
export class PdsModalFooter {
  render() {
    return (
      <footer class="pds-modal__footer">
        <slot></slot>
      </footer>
    );
  }
}
