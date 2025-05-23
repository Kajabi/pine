import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'pds-modal-content',
  styleUrl: 'pds-modal-content.scss',
})
export class PdsModalContent {
  /**
   * Whether the modal content is scrollable
   * @default false
   */
  @Prop() scrollable = false;

  render() {
    return (
      <div class={{
        'pds-modal__content': true,
        'pds-modal__content--scrollable': this.scrollable
      }} tabindex={this.scrollable ? '-1' : null}>
        <slot></slot>
      </div>
    );
  }
}