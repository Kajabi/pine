import { Component, Element, Event, Host, Prop, State, h, EventEmitter, Listen } from '@stencil/core';
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
    if (!this.isOpen) {
      this.isOpen = true;
      this.pdsPopoverShow.emit();
      event.stopPropagation();
    } else {
      this.isOpen = false;
      this.pdsPopoverHide.emit();
      event.stopPropagation();
    }
  }

  @Listen('click', {
    capture: true,
    target: 'document'
  })
  handleOutsideClick(event: MouseEvent) {
    if (this.isOpen) {
      console.log('click');
      if (!this.el.contains(event.target as Node)) {
        this.isOpen = false;
        this.pdsPopoverHide.emit();
      }
    }
  }

  // private handleClick = () => {
  //   if (!this.isOpen) {
  //     this.isOpen = true;
  //     this.pdsPopoverShow.emit();
  //   }
  // };

  // private handleOutsideClick = (event: MouseEvent) => {
  //   if (!this.el.contains(event.target as Node)) {
  //     this.isOpen = false;
  //     this.pdsPopoverHide.emit();
  //   }
  // };

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
