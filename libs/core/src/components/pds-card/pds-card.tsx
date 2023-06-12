import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'pds-card',
  styleUrl: 'pds-card.scss',
  shadow: true,
})
export class PdsCard {
  /**
   * Sets a background color on the card.
   */
  @Prop() bgColor: string;

  /**
   * Determines whether the card should have a border.
   * @defaultValue true
   */
  @Prop() border = true;

  /**
   * Sets the padding size for the card.
   */
  @Prop() padding: 'sm' | 'md' | 'none' = 'md';

  /**
   * Sets the shadow size for the card.
   */
  @Prop() shadow: 'sm' | 'md' | 'lg' = null;

  private classNames() {
    const classNames = ['pds-card'];

    if (this.border) {
      classNames.push('has-border');
    }
    if (this.padding) {
      classNames.push('pds-card--padding-' + this.padding);
    }
    if (this.shadow) {
      classNames.push('pds-card--shadow-' + this.shadow);
    }

    return classNames.join('  ');
  }

  private customBackground() {
    const style = {};

    if (this.bgColor) {
      style['--background-custom'] = this.bgColor;
    }

    return style;
  }

  render() {
    return (
      <Host class={this.classNames()} style={this.customBackground()}>
        <slot></slot>
      </Host>
    );
  }
}
