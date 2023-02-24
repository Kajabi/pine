import { Component, Host, Prop, h } from '@stencil/core';

/**
 * @slot - Content inside the tooltip
 */
@Component({
  tag: 'sage-tooltip',
  styleUrl: 'sage-tooltip.scss',
  shadow: true,
})
export class SageTooltip {

  /**
   * Determines whether or not the tooltip have an arrow
   */
  @Prop() hasArrow?: boolean;

  // private getText(): string {
  //   return format(this.first, this.middle, this.last);
  // }

  render() {
    return (
      <Host hasArror={this.hasArrow}>
        <div class="sage-tooltip">
          <slot />
        </div>
      </Host>
    );
  }
}
