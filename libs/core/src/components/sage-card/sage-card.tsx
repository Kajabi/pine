import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'sage-card',
  styleUrl: 'sage-card.scss',
  shadow: true
})
export class SageCard {
  /**
   * It determines whether or not the card has reduced padding.
   */
  @Prop() compact: boolean;

  render() {
    return (
      <Host class={this.compact ? 'is-compact' : null}>
        <slot></slot>
      </Host>
    );
  }
}
