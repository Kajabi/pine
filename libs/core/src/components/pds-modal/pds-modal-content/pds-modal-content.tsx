import { Component, h, Host, Prop, Element } from '@stencil/core';

declare global {
  interface HTMLPdsModalContentElement extends HTMLElement {
    border: 'none' | 'both';
  }
}

@Component({
  tag: 'pds-modal-content',
  styleUrl: 'pds-modal-content.scss',
})
export class PdsModalContent {

  @Element() el: HTMLPdsModalContentElement;

  /**
   * The border style for the content area. Automatically set based on available space of the modal content.
   * @default 'none'
   */
  @Prop({ reflect: true }) border: 'none' | 'both' | 'top' | 'bottom' = 'none';

  componentDidLoad() {
    const slotContent = this.el.firstElementChild as HTMLElement;
    const isScrollable = slotContent.scrollHeight > slotContent.clientHeight;
    this.border = isScrollable ? 'both' : 'none';
  }
  render() {
    return (
      <Host>
        <div class={{
          'pds-modal-content': true,
          [`pds-modal-content--border-${this.border}`]: true
        }} tabindex="-1">
          <slot></slot>
        </div>
      </Host>
    );
  }
}