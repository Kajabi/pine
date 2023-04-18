import { Component, Element, Event, Host, Prop, State, h, EventEmitter, Method, Watch } from '@stencil/core';
import {
  positionTooltip
} from '../../utils/overlay';

/**
 * @slot (default) - The tooltip's target element
 * @slot content - HTML content for the tooltip
 */

@Component({
  tag: 'sage-tooltip',
  styleUrl: 'sage-tooltip.scss',
  shadow: true,
})
export class SageTooltip {
  private contentEl: HTMLElement | null;

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
    if(this.opened) {
      this.handleShow();
    } else {
      this.handleHide();
    }
  }

  /**
   * Emitted after a tooltip is closed
   */
  @Event() sageTooltipHide: EventEmitter;

  /**
   * Emitted after a tooltip is shown
   */
  @Event() sageTooltipShow: EventEmitter;

  componentWillLoad() {
    if (this.opened) {
      this.showTooltip();
    }

    this.el.addEventListener('blur', this.handleHide, true);
    this.el.addEventListener('focus', this.handleShow, true);
  }

  componentDidUpdate() {
    if (this.opened) {
      this.showTooltip();
    }
  }

  componentDidRender() {
    positionTooltip(this.el, this.placement, this.contentEl);
  }

  @Method()
  async showTooltip() {
    this.opened = true;

    if(this.contentEl) {
      // TODO: need to use block / none but the tooltip content width and height are needed for calculations
      // this.contentEl.style.display = 'block';
      this.contentEl.style.opacity = '1';
      this.contentEl.style.visibility = 'visible';
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

  private handleHide = () => {
    this.hideTooltip();
    this.sageTooltipHide.emit();
  };

  private handleShow = () => {
    this.showTooltip();
    this.sageTooltipShow.emit();
  };

  render() {
    return (
      <Host
        class={{'sage-tooltip--has-html-content': this.htmlContent}}
        hasArrow={this.hasArrow}
        onMouseEnter={this.handleShow}
        onMouseLeave={this.handleHide}
        onFocusin={this.handleShow}
        onFocusout={this.handleHide}
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
            class="sage-tooltip__trigger"
          >
            <slot />
          </span>

          <div class="sage-tooltip__content"
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
            {this.hasArrow && (
              <div
                class="sage-tooltip__arrow"
                aria-hidden="true"
              ></div>
            )}
          </div>
        </div>
      </Host>
    );
  }
}
