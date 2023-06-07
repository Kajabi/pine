import { Component, Prop, Host, h } from '@stencil/core';

@Component({
  tag: 'pds-divider',
  styleUrl: 'pds-divider.scss',
  shadow: true,
})
export class PdsDivider {
  /**
   * Adds offset margin/padding to expand the width (horizontal) or the height (vertical) of divider.
   */
  @Prop() offset: 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

  /**
   * Sets divider to display vertically
   * @defaultValue false
   */
  @Prop() vertical = false;

  private classNames() {
    const classNames = ['pds-divider'];

    if (this.vertical) {
      classNames.push('pds-divider--vertical');
    }

    if (this.offset) {
      const offsetClassName = 'pds-divider--offset-' + this.offset;
      classNames.push(offsetClassName);
    }

    return classNames.join(' ');
  }

  render() {
    return (
      <Host>
        <hr class={this.classNames()} />
      </Host>
    );
  }
}
