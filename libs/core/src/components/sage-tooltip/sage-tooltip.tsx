import { Component, Host, Prop, h } from '@stencil/core';

/**
 * @slot content - Content inside the tooltip
 * @slot target - The tooltip's target element
 */

@Component({
  tag: 'sage-tooltip',
  styleUrl: 'sage-tooltip.scss',
  shadow: true,
})
export class SageTooltip {

  /**
   * Content for the tooltip. If HTML is required, use the content slot
   */
  @Prop() content: '';

  /**
   * Determines whether or not the tooltip have an arrow
   */
  @Prop() hasArrow?: boolean;

  /**
   * Determines the preferred position of the tooltip
   */
   @Prop() placement:
    | 'top'
    | 'top-start'
    | 'top-end'
    | 'right'
    | 'right-start'
    | 'right-end'
    | 'bottom'
    | 'bottom-start'
    | 'bottom-end'
    | 'left'
    | 'left-start'
    | 'left-end' = 'top';

  /**
   * Determines whether or not the tooltip is open.
   */
  @Prop({ reflect: true }) open: boolean;

  // private getText(): string {
  //   return format(this.first, this.middle, this.last);
  // }

  render() {
    return (
      <Host hasArrow={this.hasArrow}>
        <div class="sage-tooltip">
          <slot name="target" aria-describedby="tooltip"></slot>
          <slot
            name="content"
            aria-live={this.open ? 'polite' : 'off'}
          >
            {this.content}
          </slot>
        </div>
      </Host>
    );
  }
}
