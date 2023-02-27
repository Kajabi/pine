import { Component, Element, Host, Prop, State, h } from '@stencil/core';

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
   * Reference to the Host element
   */
  @Element() el: HTMLDivElement;

  /**
   * Content for the tooltip. If HTML is required, use the content slot
   */
  @Prop() content: '';

  /**
   * Determines whether or not the tooltip have an arrow
   */
  @Prop() hasArrow?: boolean;

  /**
   * Determines whether or not the tooltip is visible
   */
  @Prop({mutable: true, reflect: true}) isVisible = false;

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

    // hide the tooltip

  // show the tooltip

  render() {
    return (
      <Host hasArrow={this.hasArrow}>
        <div class="sage-tooltip">
          <slot name="target" aria-describedby="tooltip" />
          <slot
            name="content"
            part="content"
            class="sage-tooltip__content"
            aria-live={this.isVisible ? 'polite' : 'off'}
          >
            {this.content}
          </slot>
        </div>
      </Host>
    );
  }
}
