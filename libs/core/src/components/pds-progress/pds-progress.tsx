import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'pds-progress',
  styleUrls: ['pds-progress.scss'],
  shadow: true,
})
export class PdsProgress {
  /**
  * Determines whether or not progress is animated.
  * @defaultValue false
  */
  @Prop() animated = false;

  /**
  * A unique identifier used for the underlying component `id` attribute and the label `for` attribute.
  */
  @Prop() componentId!: string;

  /**
  * Sets the progress fill color. Accepts a color token or a [valid color value](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value).
  * @defaultValue 'var(--pine-color-blue-300)'
  */
  @Prop() fillColor: string;

  /**
  * String used for label text. Label is visually hidden but required for better accessibility.
  */
  @Prop() label!: string;

  /**
  * Sets the progress fill pecentage and visually displayed when `show-percentage=true`.
  * @defaultValue 0
  */
  @Prop() percent = 0;

  /**
  * Determines whether or not the percent value should be displayed as text.
  * @defaultValue false
  */
  @Prop() showPercent = false;

  render() {
    return (
      <Host class={this.animated ? { 'is-animated': this.animated } : ''}>
        <div class="pds-progress">
          <label class="pds-progress__label" htmlFor={this.componentId}>
            {this.label}
          </label>
          <progress
            id={this.componentId}
            max="100"
            style={this.fillColor ? { '--color-progress-fill': this.fillColor } : {}}
            value={this.percent}
          >
          </progress>
        </div>
        {this.showPercent && <div class="pds-progress__percentage">{this.percent}%</div>}
      </Host>
    );
  }
}
