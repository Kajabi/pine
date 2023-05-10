import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'sage-card',
  styleUrl: 'sage-card.scss',
  shadow: true,
})
export class SageCard {
  /**
  * Determines the background color of the card.
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
  @Prop() shadow: 'sm' | 'md' | 'lg' | 'none' = 'none';

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
    const style = this.bgColor ? { backgroundColor: this.bgColor } : {};
    return (
      <Host class={this.classNames()} style={style}>
        <slot></slot>
      </Host>
    );
  }
}
