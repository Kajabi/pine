import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'sage-card',
  styleUrl: 'sage-card.scss',
  shadow: true,
})
export class SageCard {
  @Prop() bgColor: string;
  @Prop() border = true;
  @Prop() padding: 'sm' | 'md' | 'none' = 'md';
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
