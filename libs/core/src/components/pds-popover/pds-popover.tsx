import { Component, Element, Event, Host, Method, Prop, State, h, EventEmitter, Listen } from '@stencil/core';
import {
  positionTooltip
} from '../../utils/overlay';

/**
 * @slot trigger - The popover's target element
 * @slot content - HTML content for the popover
 */

@Component({
  tag: 'pds-popover',
  styleUrls: ['../../global/styles/base.scss', 'pds-popover.scss'],
  shadow: true,
})
export class PdsPopover {
  private contentEl: HTMLElement | null;
  private triggeredEvent: Event;
  /**
   * Reference to the Host element
   */
  @Element() el: HTMLPdsPopoverElement;

  /**
   * Determines when the popover is open
   * @defaultValue false
   */
  @State() isOpen = false;

  /**
   * A unique identifier used for the underlying component `id` attribute.
   */
  @Prop() componentId: string;

  /**
   * Determines whether or not the popover has an arrow
   * @defaultValue true
   */
  @Prop() hasArrow? = true;

  /**
   * Determines the preferred position of the popover
   * @defaultValue "right"
   */
  @Prop({ reflect: true }) placement:
    'top'
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
    | 'left-end' = 'right';

  /**
   * Emitted after a popover is closed
   */
  @Event() pdsPopoverHide: EventEmitter;

  /**
   * Emitted after a popover is shown
   */
  @Event() pdsPopoverShow: EventEmitter;

  componentDidRender() {
    positionTooltip({elem: this.el, elemPlacement: this.placement, overlay: this.contentEl});
  }

  componentDidMount() {
    document.addEventListener('click', this.handleOutsideClick);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleOutsideClick);
  }

  @Listen('click', {
    capture: true
  })
  handleClick(event: MouseEvent) {
    console.log('handleClick');
    const closestTarget = (event.target as HTMLElement).closest("div[slot='trigger']");

    if (!closestTarget) {
      event.stopPropagation();
      return;
    }

    if (!this.isOpen) {
      console.log('calling handleClick SHOW');
      this.show();
    } else {
      console.log('calling handleClick HIDE');
      this.hide();
    }
    event.stopPropagation();
  }

  @Listen('click', {
    target: 'document'
  })
  handleOutsideClick(event: MouseEvent) {
    if (this.isOpen) {
      if(this.contentEl && !this.contentEl.contains(event.target as Node)) {
        this.hide();
      }
    }
  }

  /**
   * Shows the popover by enabling the isOpen state
   */
  @Method()
  async show() {
    this.isOpen = true;
    this.triggeredEvent = this.pdsPopoverShow.emit();
  }

  /**
   * Hides the popover by disabling the isOpen state
   */
  @Method()
  async hide() {
    this.isOpen = false;
    this.triggeredEvent = this.pdsPopoverHide.emit();
  }

  render() {
    return (
      <Host
      >
        <div
          class={`
            pds-popover
            pds-popover--${this.placement}
            ${this.isOpen ? 'pds-popover--is-open' : ''}
            ${this.hasArrow ? '' : 'pds-popover--no-arrow'}
          `}
        >
          <span
            aria-describedby={this.componentId}
            class="pds-popover__trigger"
            onClick={this.handleClick}
          >
            <slot name="trigger"></slot>
          </span>

          <div class="pds-popover__content"
            aria-hidden={this.isOpen ? 'false' : 'true'}
            aria-live={this.isOpen ? 'polite' : 'off'}
            id={this.componentId}
            ref={(el) => (this.contentEl = el)}
          >
            <slot
              name="content"
            ></slot>
          </div>
        </div>
      </Host>
    );
  }
}
