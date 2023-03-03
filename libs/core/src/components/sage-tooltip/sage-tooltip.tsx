import { Component, Element, Event, Host, Listen, Prop, State, h, EventEmitter } from '@stencil/core';

/**
 * @slot - The tooltip's target element
 * @slot content - Content inside the tooltip
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
   * Determines where the tooltip is open
   */
  @State() isOpen = false;

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

  /**
   * Emitted after a tooltip is closed
   */
  @Event() sageHide: EventEmitter;

  /**
   * Emitted after a tooltip is shown
   */
  @Event() sageShow: EventEmitter;

  // Not to self: Should be click by `mouseover` is causing too many repaints. May need to debounce?
  @Listen('click', { capture: true })
  handleClick() {
    const tooltipContent = this.el.shadowRoot.querySelector('sage-tooltip__content');
    console.log(tooltipContent);
    this.isOpen = !this.isOpen;
    tooltipContent.classList.add('is-open');
  }

  // show the tooltip
  open() {
    // ...
    this.isOpen = true;
  }

  // hide the tooltip
  close() {
    this.isOpen = false;
  }

  render() {
    return (
      <Host
        class={{
          'is-open': this.isOpen
        }}
        hasArrow={this.hasArrow}
      >
        <div class="sage-tooltip">
          <slot aria-describedby="tooltip" />
          <div class="sage-tooltip__content" part="content">
            <slot
              name="content"
              aria-live={this.isOpen ? 'polite' : 'off'}
            >
              {this.content}
            </slot>
          </div>
          {this.hasArrow && <div class="sage-tooltip__arrow" part="arrow">arrow</div>}
        </div>
      </Host>
    );
  }
}
