import { Component, Element, Event, Host, Prop, State, h, EventEmitter, Method, Watch } from '@stencil/core';
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
   * Content for the popover. If HTML is required, use the content slot
   */
  @Prop() content: string;

  /**
   * Id used to reference the component
   */
  @Prop() componentId: string;

  /**
   * Determines whether or not the popover has an arrow
   * @defaultValue true
   */
  @Prop() hasArrow? = true;

  /**
   * Enable this option when using the content slot
   * @defaultValue false
   */
  @Prop() htmlContent = false;

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

  @Watch('opened')
  handleOpenToggle() {
    if (this.opened) {
      this.handleShow();
    } else {
      this.handleHide();
    }
  }

  /**
   * Emitted after a popover is closed
   */
  @Event() pdsPopoverHide: EventEmitter;

  /**
   * Emitted after a popover is shown
   */
  @Event() pdsPopoverShow: EventEmitter;

  componentWillLoad() {
    if (this.opened) {
      this.showPopover();
    }

    this.el.addEventListener('blur', this.handleHide, true);
    this.el.addEventListener('focus', this.handleShow, true);
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

  render() {
    return (
      <Host
        onMouseEnter={this.handleShow}
        onMouseLeave={this.handleHide}
        onFocusin={this.handleShow}
        onFocusout={this.handleHide}
      >
        <div
          class={`
            pds-popover
            pds-popover--${this.placement}
            ${this.htmlContent ? 'pds-popover--has-html-content' : ''}
            ${this.opened ? 'pds-popover--is-open' : ''}
            ${this.hasArrow ? '' : 'pds-popover--no-arrow'}
          `}
        >
          <span
            aria-describedby={this.componentId}
            class="pds-popover__trigger"
          >
            <slot />
          </span>

          <div class="pds-popover__content"
            aria-hidden={this.opened ? 'false' : 'true'}
            aria-live={this.opened ? 'polite' : 'off'}
            id={this.componentId}
            ref={(el) => (this.contentEl = el)}
            role="tooltip"
          >
            <slot
              name="content"
            ></slot>
            {this.content}
          </div>
        </div>
      </Host>
    );
  }
}
