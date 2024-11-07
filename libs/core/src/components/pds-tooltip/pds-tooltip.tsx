import { Component, Element, Host, Prop, State, h, Method, Watch } from '@stencil/core';
import {
  positionTooltip
} from '../../utils/overlay';

/**
 * @slot (default) - The tooltip's target element
 * @slot content - HTML content for the tooltip
 */

@Component({
  tag: 'pds-tooltip',
  styleUrls: ['../../global/styles/base.scss', 'pds-tooltip.scss'],
  shadow: true,
})
export class PdsTooltip {
  private contentEl: HTMLElement | null;

  /**
   * Reference to the Host element
   */
  @Element() el: HTMLPdsTooltipElement;

  /**
   * Determines when the tooltip is open
   * @defaultValue false
   */
  @State() isOpen = false;

  /**
   * Content for the tooltip. If HTML is required, use the content slot
   */
  @Prop() content: string;

  /**
   * A unique identifier used for the underlying component `id` attribute.
   */
  @Prop() componentId: string;

  /**
   * Determines whether or not the tooltip has an arrow
   * @defaultValue true
   */
  @Prop() hasArrow? = true;

  /**
   * Enable this option when using the content slot
   * @defaultValue false
   */
  @Prop() htmlContent = false;

  /**
   * Determines the preferred position of the tooltip
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
   * Sets the maximum width of the tooltip content
   * @defaultValue "352px"
   */
  @Prop() maxWidth: string = '352px';

  /**
   * Determines whether or not the tooltip is visible
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
    positionTooltip({elem: this.el, elemPlacement: this.placement, overlay: this.contentEl});
  }

  /**
   * Shows the tooltip by enabling the opened property
   */
  @Method()
  async showTooltip() {
    this.opened = true;
  }

  /**
   * Hides the tooltip by disabling the opened property
   */
  @Method()
  async hideTooltip() {
    this.opened = false;
  }

  private handleHide = () => {
    this.hideTooltip();
  };

  private handleShow = () => {
    this.showTooltip();
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
            pds-tooltip
            pds-tooltip--${this.placement}
            ${this.htmlContent ? 'pds-tooltip--has-html-content' : ''}
            ${this.opened ? 'pds-tooltip--is-open' : ''}
            ${this.hasArrow ? '' : 'pds-tooltip--no-arrow'}
          `}
        >
          <span
            aria-describedby={this.componentId}
            class="pds-tooltip__trigger"
          >
            <slot />
          </span>

          <div class="pds-tooltip__content"
            aria-hidden={this.opened ? 'false' : 'true'}
            aria-live={this.opened ? 'polite' : 'off'}
            id={this.componentId}
            ref={(el) => (this.contentEl = el)}
            role="tooltip"
            style={{ maxWidth: this.maxWidth }}
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
