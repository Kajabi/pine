import { Component, Element, Event, Host, Listen, Prop, State, h, EventEmitter, Method, Watch } from '@stencil/core';
import {
  // createObserver,
  positionTooltip
} from '../../utils/overlay';

/**
 * @slot - The tooltip's target element
 * @slot content - Content inside the tooltip
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
  // private triggerEl: HTMLElement | null;
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
    | 'left-end' = 'top';

  /**
   * Determines whether or not the tooltip is visible
   */
  @Prop({mutable: true, reflect: true}) opened = false;

  // @Watch('opened')
  handleOpenToggle() {
    this.opened ? this.showTooltip() : this.hideTooltip();
    console.log('after isOpened', this.opened);
  }

  // TODO Q: make better events, maybe before and after hide and show
  /**
   * Emitted after a tooltip is closed
   */
  @Event() sageHide: EventEmitter;

  /**
   * Emitted after a tooltip is shown
   */
  @Event() sageShow: EventEmitter;

  // connectedCallback() {}
  // TODO Q: not working as expected, revisit before putting in review
  // connectedCallback(): void {
  //   console.log('connected callback enter: ', this.intersectionObserver );
  //   createObserver(
  //     this.intersectionObserver,
  //     '0px',
  //     this.contentEl,
  //     () => {
  //       // this.opened = true;
  //       console.log('connected callback');
  //     }
  //   );
  // }

  // disconnectedCallback() {}

  // componentWillLoad() {}

  // componentDidLoad() {}

  // componentShouldUpdate(newVal: any, oldVal: any, propName: string) {}

  // componentWillUpdate() {}

  componentDidUpdate() {
    if (this.opened) {
      this.showTooltip();
    }
  }

  componentDidRender() {
    positionTooltip(this.el, this.placement, this.contentEl);
  }

  // Note to self: Should be click by `mouseover` is causing too many repaints. May need to debounce?
  @Listen('click', { capture: true })
  handleClick() {
    const tooltipContent = this.el.shadowRoot.querySelector('sage-tooltip__content');
    // this.isOpen = !this.isOpen;
    tooltipContent.classList.add('is-open');
  }

  @Method()
  async showTooltip() {
    this.opened = true;
    // TODO: need to use block / none but the tooltip content width and height are needed for calculations
    // this.contentEl.style.display = 'block';
    this.contentEl.style.opacity = '1';
    this.contentEl.style.visibility = 'visible';
  }

  @Method()
  async hideTooltip() {
    this.opened = false;
    // TODO: need to use block / none but the tooltip content width and height are needed for calculations
    // this.contentEl.style.display = '';
    // this.contentEl.style.opacity = '0';
    // this.contentEl.style.visibility = 'hidden';
  }

  private handleShow = () => {
    this.showTooltip();
  };

  private handleHide = () => {
    this.hideTooltip();
  };

  private handleFocus = () => {
    // TODO Q: add focus functionality
    this.showTooltip();
  };

  private handleBlur = () => {
    // TODO Q: add blure functionality
    this.showTooltip();
  };

  render() {
    return (
      <Host
        class={{'sage-tooltip--has-html-content': true}}
        hasArrow={this.hasArrow}
        onMouseEnter={this.handleShow}
        onMouseLeave={this.handleHide}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        // onClick={this.handleClick} TODO
      >
        <div
          class={`
            sage-tooltip
            sage-tooltip--${this.placement}
            ${this.opened ? 'is-open' : ''}
          `}
        >
          <span
            aria-describedby={this.componentId}
            part="trigger"
            // ref={(el) => (this.triggerEl = el)}
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
