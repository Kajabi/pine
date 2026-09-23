import { Component, Prop, Host, h } from '@stencil/core';

/**
 * @part label - Exposes the label text for styling, such as a custom color. Appears only when `label` is set and `vertical` is `false`.
 */

@Component({
  tag: 'pds-divider',
  styleUrls: ['pds-divider.scss'],
  shadow: true,
})
export class PdsDivider {
  /**
   * A unique identifier used for the underlying component `id` attribute.
   */
  @Prop() componentId: string;

  /**
   * Text to be displayed as the divider label, centered between two lines. Ignored when `vertical` is `true`.
   */
  @Prop() label?: string;

  /**
   * Adds offset margin/padding to expand the width (horizontal) or the height (vertical) of divider.
   */
  @Prop() offset: 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

  /**
   * Sets divider to display vertically.
   * @defaultValue false
   */
  @Prop() vertical = false;

  private get hasLabel() {
    return Boolean(this.label) && !this.vertical;
  }

  private classNames() {
    const classNames = ['pds-divider'];

    if (this.vertical) {
      classNames.push('pds-divider--vertical');
    }

    if (this.hasLabel) {
      classNames.push('pds-divider--labeled');
    }

    if (this.offset) {
      const offsetClassName = 'pds-divider--offset-' + this.offset;
      classNames.push(offsetClassName);
    }

    return classNames.join(' ');
  }

  render() {
    return (
      <Host id={this.componentId}>
        {this.hasLabel ? (
          <div class={this.classNames()} role="separator" aria-label={this.label}>
            <span class="pds-divider__label" part="label">{this.label}</span>
          </div>
        ) : (
          <hr class={this.classNames()} />
        )}
      </Host>
    );
  }
}
