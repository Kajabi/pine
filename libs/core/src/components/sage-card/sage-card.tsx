import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'sage-card',
  styleUrl: 'sage-card.scss',
  shadow: true,
})
export class SageCard {
  /**
  * Sets a background color on the card.
  */
  @Prop() bgColor: string;

  /**
  * Determines whether the card should have a border.
  */
  @Prop() border = true;

  /**
  * Sets the padding size for the card.
  */
  @Prop() padding: 'sm' | 'md' | 'none' = 'md';

  /**
  * Determines the shadow size for the card.
  */
  @Prop() shadow: 'sm' | 'md' | 'lg' = null;

  private classNames() {
    const classNames = ['sage-card'];

    if (this.border) {
      classNames.push('has-border');
    }
    if (this.padding) {
      classNames.push('sage-card--padding-' + this.padding);
    }
    if (this.shadow) {
      classNames.push('sage-card--shadow-' + this.shadow);
    }

    return classNames.join('  ');
  }

  render() {
    return (
      <Host
        class={ this.classNames() }
        style={ this.bgColor ? { backgroundColor: this.bgColor } : {} }
      >
        <slot></slot>
      </Host>
    );
  }
}
