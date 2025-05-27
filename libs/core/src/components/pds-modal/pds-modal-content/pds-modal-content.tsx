import { Component, h, Prop, Host } from '@stencil/core';

@Component({
  tag: 'pds-modal-content',
  styleUrl: 'pds-modal-content.scss',
})
export class PdsModalContent {
  /**
   * Whether the modal content is scrollable
   * @default false
   */
  @Prop({ reflect: true }) scrollable = false;

  render() {
    return (
      <Host>
        <div class={{
          'pds-modal-content': true,
          'pds-modal-content--scrollable': this.scrollable
        }} tabindex={this.scrollable ? '-1' : null}>
          <slot></slot>
        </div>
      </Host>
    );
  }
}