import { Component, Element, Event, Host, Prop, State, h, EventEmitter, Method, Watch } from '@stencil/core';
import {
  // createObserver,
  positionTooltip
} from '../../utils/overlay';

/**
 * @slot (default) - The tooltip's target element
 * @slot content - HTML content for the tooltip
 *
 * @part arrow - The arrow attached to the tooltip content.
 * @part content - The tooltip content.
 * @part trigger - The tooltip trigger.
 */

@Component({
  tag: 'sage-tooltip',
  styleUrl: 'sage-tooltip.scss',
  shadow: true,
})
export class SageTooltip {
  // private arrowEl: HTMLElement | null;
  private triggerEl: HTMLElement | null;
  private contentEl: HTMLElement | null;
  // private overlayObserver!: IntersectionObserver;

  /**
   * Reference to the Host element
   */
  @Element() el: HTMLDivElement;

  /**
   * Determines where the tooltip is open
   */
  @State() isOpen = false;

  /**
   * Determines if the overlay is being observed
   */
  // @State() private intersectionObserver: IntersectionObserver;

  /**
   * Content for the tooltip. If HTML is required, use the content slot
   */
  @Prop() content: '';

  /**
   * If populated, this will be the tooltip content's width
   */
  @Prop() customWidth?: number;

  /**
   * Id used to reference the component
   */
  @Prop() componentId: '';

  /**
   * Determines whether or not the tooltip have an arrow
   */
  @Prop() hasArrow?: boolean;


  /**
   * Enable this option when using the content slot
   */
  @Prop() htmlContent?: boolean;

  /**
   * Determines the preferred position of the tooltip
   */
  @Prop() placement:
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
    | 'left-end';

  /**
   * Determines whether or not the tooltip is visible
   */
  @Prop({mutable: true, reflect: true}) opened = false;

  // eslint-disable-next-line @stencil/no-unused-watch
  @Watch('opened')
  handleOpenToggle() {
    // console.log('before isOpened', this.opened);

    if(this.opened) {
      this.handleShow();
    } else {
      this.handleHide();
    }
    // console.log('after isOpened', this.opened);
  }

  /**
   * Determines whether or not the tooltip have an arrow
   */
  @Prop({mutable: true}) disabled = false;

  // TODO Q update this state prop
  // eslint-disable-next-line @stencil/no-unused-watch
  @Watch('disabled')
  handleDisabled() {
    // console.log('disabled')
  }

  // TODO Q: make better events, maybe before and after hide and show
  /**
   * Emitted after a tooltip is closed
   */
  @Event() sageTooltipHide: EventEmitter;

  /**
   * Emitted after a tooltip is shown
   */
  @Event() sageTooltipShow: EventEmitter;

  disconnectedCallback() {
    // this.el.removeEventListener('focus', this.handleFocus);
  }

  componentWillLoad() {
    // console.log('opened: ', this.opened);
    if (this.opened) {
      this.showTooltip();
    }
  }

  componentDidUpdate() {
    if (this.opened) {
      this.showTooltip();
    }
  }

  componentDidRender() {
    // console.log('didRender');
    positionTooltip(this.el, this.placement, this.contentEl);
  }

  @Method()
  async showTooltip() {
    // console.log('showTooltip');

    if(!this.disabled) {
      this.opened = true;
      // TODO: need to use block / none but the tooltip content width and height are needed for calculations
      // this.contentEl.style.display = 'block';
      if(this.contentEl) {
        this.contentEl.style.opacity = '1';
        this.contentEl.style.visibility = 'visible';
      }
    }
  }

  @Method()
  async hideTooltip() {
    this.opened = false;
    // TODO: need to use block / none but the tooltip content width and height are needed for calculations
    // this.contentEl.style.display = '';
    this.contentEl.style.opacity = '0';
    this.contentEl.style.visibility = 'hidden';
  }

  /**
     * Sets element as focused
     */
  @Method()
  async setFocus(options?: FocusOptions) {
      this.triggerEl.focus(options)
  }

  private handleShow = () => {
    // Do not show the overlay if disabled
    if(this.disabled) {
      // console.log('inside disabled');
      return
    }
    // console.log('disabled');
    this.showTooltip();
    this.sageTooltipShow.emit();
  };

  private handleHide = () => {
    this.hideTooltip();
    this.sageTooltipHide.emit();
  };

  private handleFocus = () => {
    console.log('handle focus');
    this.showTooltip();
    this.sageTooltipShow.emit();
  };

  private handleBlur = () => {
    this.showTooltip();
  };

  render() {
    return (
      <Host
        class={{'sage-tooltip--has-html-content': this.htmlContent}}
        disabled={this.disabled}
        hasArrow={this.hasArrow}
        onMouseEnter={this.handleShow}
        onMouseLeave={this.handleHide}
        onFocusin={this.handleFocus}
        onFocusout={this.handleBlur}
        // onClick={this.handleClick}
      >
        <div
          class={`
            sage-tooltip
            ${this.placement ? (`sage-tooltip--${this.placement}`) : ''}
            ${this.opened ? 'sage-tooltip--is-open' : ''}

          `}
        >
          <span
            aria-describedby={this.componentId}
            part="trigger"
            class="sage-tooltip__trigger"
            ref={(el) => (this.triggerEl = el)}
          >
            <slot />
          </span>

          <div class="sage-tooltip__content"
            aria-hidden={this.opened ? 'false' : 'true'}
            aria-live={this.opened ? 'polite' : 'off'}
            id={this.componentId}
            part="content"
            ref={(el) => (this.contentEl = el)}
            role="tooltip"
          >
            <slot
              name="content"
            ></slot>
            {this.content}
            {this.hasArrow && (
              <div
                class="sage-tooltip__arrow"
                aria-hidden="true"
                part="arrow"
                // ref={(el) => (this.arrowEl = el)}
              ></div>
            )}
          </div>
        </div>
      </Host>
    );
  }
}
