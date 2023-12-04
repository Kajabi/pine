import { Component, Element, Event, Host, Prop, State, h, EventEmitter, Method } from '@stencil/core';
import {
  positionTooltip
} from '../../utils/overlay';

/**
 * @slot (default) - The popover's target element
 * @slot content - HTML content for the popover
 */

@Component({
  tag: 'pds-popover',
  styleUrl: 'pds-popover.scss',
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
   * A unique identifier used for the underlying component id attribute.
   */
  @Prop() componentId: string;

  /**
   * Determines whether or not the popover has an arrow
   * @defaultValue true
   */
  @Prop() hasArrow? = false;

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
   * Determines whether or not the popover is visible
   * @defaultValue false
   */
  @Prop({mutable: true, reflect: true}) opened = false;

  /**
   * Emitted after a popover is closed
   */
  @Event() pdsPopoverHide: EventEmitter;

  /**
   * Emitted after a popover is shown
   */
  @Event() pdsPopoverShow: EventEmitter;

  componentDidLoad() {
    document.addEventListener('click', this.handleGlobalClick);
  }

  componentDidUpdate() {
    if (this.opened) {
      this.showPopover();
    }
  }

  componentDidRender() {
    positionTooltip({elem: this.el, elemPlacement: this.placement, overlay: this.contentEl});
  }

  /**
   * Toggles the popover visibility on click
   */
  @Method()
  async togglePopover() {
    this.opened = !this.opened;

    if (this.opened) {
      this.handleShow();
    } else {
      this.handleHide();
    }
  }

  /**
   * Shows the popover by enabling the opened property
   */
  @Method()
  async showPopover() {
    this.opened = true;
  }

  /**
   * Hides the popover by disabling the opened property
   */
  @Method()
  async hidePopover() {
    this.opened = false;
  }

  private handleHide = () => {
    this.hidePopover();
    this.pdsPopoverHide.emit();
  };

  private handleShow = () => {
    this.showPopover();
    this.pdsPopoverShow.emit();
  };

  /**
   * Closes the popover if the click is not inside the popover
   */
  private handleGlobalClick = (event: MouseEvent) => {
    if(this.opened) {
      if (!this.el.contains(event.target as Node)) {
        this.handleHide();
      }
    }
  };

  render() {
    const popverClasses = `
      pds-popover--${this.placement}
      ${this.opened ? 'pds-popover--is-open' : ''}
      ${this.hasArrow ? '' : 'pds-popover--no-arrow'}
    `;
    
    return (
      <Host>
        <div
          class={`pds-popover ${popverClasses}}`}
          id={this.componentId}
        >
          <span
            aria-describedby={this.componentId}
            class="pds-popover__trigger"
            onClick={() => this.togglePopover()}
          >
            <slot />
          </span>

          <div class="pds-popover__content"
            aria-hidden={this.opened ? 'false' : 'true'}
            aria-live={this.opened ? 'polite' : 'off'}
            id={`${this.componentId}-content`}
            ref={(el) => (this.contentEl = el)}
            role="dialog"
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
