import { Component, Prop, Host, h } from '@stencil/core';

@Component({
  tag: 'sage-divider',
  styleUrl: 'sage-divider.scss',
  shadow: true,
})
export class SageDivider {
  /**
   * Sets divider to display vertically
   * @defaultValue false
   */
  @Prop() vertical = false;

  /**
   *
   * Adds offset margin/padding to expand the width (horizontal) or the height (vertical) of divider.
   */
  @Prop() offset: 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

  private classNames() {
    let className = `sage-divider`;

    if (this.vertical) {
      const verticalClassName = 'sage-divider--vertical';
      className += ' ' + verticalClassName;
    }

    if (this.offset) {
      const offsetClassName = 'sage-divider--offset-' + this.offset;
      className += ' ' + offsetClassName;
    }

    return className;
  }

  render() {
    return (
      <Host>
        <hr class={this.classNames()} />
      </Host>
    );
  }
}
