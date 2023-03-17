import { Component, Element, Event, Host, Listen, Prop, State, h, EventEmitter, Method, Watch } from '@stencil/core';

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
   * Determines the preferred position of the tooltip
   */
  @Prop({ mutable: true }) placement:
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
   * Determines whether or not the tooltip is visible
   */
  @Prop({mutable: true, reflect: true}) opened = false;

  // @Watch('opened')
  handleOpenToggle() {
    this.opened ? this.showTooltip() : this.hideTooltip();
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

  // disconnectedCallback() {}

  // componentWillLoad() {}

  // componentDidLoad() {}

  // componentShouldUpdate(newVal: any, oldVal: any, propName: string) {}

  // componentWillUpdate() {}

  componentDidUpdate() {
    this.positionTooltip();

    if (this.opened) {
      this.showTooltip();
    }
  }

  componentDidRender() {
    this.positionTooltip();
  }

  // Note to self: Should be click by `mouseover` is causing too many repaints. May need to debounce?
  @Listen('click', { capture: true })
  handleClick() {
    const tooltipContent = this.el.shadowRoot.querySelector('sage-tooltip__content');
    this.isOpen = !this.isOpen;
    tooltipContent.classList.add('is-open');
  }

  @Method()
  async showTooltip() {
    this.opened = true;
    // TODO: need to use block / none but the tooltip content width and height are needed for calculations
    // this.contentEl.style.display = 'block';
    this.contentEl.style.opacity = '1';
    this.contentEl.style.visibility = 'visible';
    this.positionTooltip();
  }

  @Method()
  async hideTooltip() {
    this.opened = false;
    // TODO: need to use block / none but the tooltip content width and height are needed for calculations
    // this.contentEl.style.display = '';
    this.contentEl.style.opacity = '0';
    this.contentEl.style.visibility = 'hidden';
    this.positionTooltip();
  }

  private handleShow = () => {
    this.showTooltip();
  };

  private handleHide = () => {
    this.hideTooltip();
  };

  private positionTooltip() {
    const rect = this.el.getBoundingClientRect();
    const contentRect = this.contentEl.getBoundingClientRect();
    const panelNewLoc = {
      top: (rect.height / 2) + contentRect.height
    };

    if (this.placement.includes("right")) {
      this.contentEl.style.top = '50%';
      this.contentEl.style.left = `calc(${rect.width}px + 8px)`;
      this.contentEl.style.transform = 'translateY(-50%)';
    }

    if (this.placement.includes("left")) {
      this.contentEl.style.top = '50%';
      this.contentEl.style.left = `calc((${rect.width}px + 8px) * -1)`;
      this.contentEl.style.transform = 'translateY(-50%)';
    }

    if (this.placement.includes("bottom")) {
      this.contentEl.style.top = `calc(${rect.height}px + 8px)`;
      this.contentEl.style.left = '50%';
      this.contentEl.style.transform = 'translateX(-50%)';
    }

    if (this.placement.includes("top")) {
      this.contentEl.style.top = `calc((${contentRect.height}px + 8px) * -1)`;
      this.contentEl.style.left = '50%';
      this.contentEl.style.transform = 'translateX(-50%)';
    }

    const win = this.contentEl.ownerDocument.defaultView;
    const docEl = window.document.documentElement;

    const viewport = {
      top: docEl.scrollTop,
      bottom: window.pageYOffset + docEl.clientHeight,
    };

    const offset = {
      top: contentRect.top + win.pageYOffset,
      left: contentRect.left + win.pageXOffset,
      bottom: (contentRect.top + win.pageYOffset)
    };

    const panelHeight = contentRect.height;
    const enoughSpaceAbove = viewport.top < (offset.top + panelHeight);
    const enoughSpaceBelow = viewport.bottom > (offset.bottom + panelHeight);

    if (!enoughSpaceBelow && enoughSpaceAbove) {
      this.placement = 'top';
    } else if (!enoughSpaceAbove && enoughSpaceBelow) {
      this.placement = 'bottom';
    }

    if (this.placement === 'top') {
      this.contentEl.style.top = `-${panelNewLoc.top}px`;
    }
  }

  render() {
    return (
      <Host
        hasArrow={this.hasArrow}
        onMouseEnter={this.handleShow}
        onMouseLeave={this.handleHide}
        // onFocus={this.handleFocus} TODO
        // onBlur={this.handleBlur} TODO
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
            id={this.componentId}
            part="content"
            ref={(el) => (this.contentEl = el)}
            role="tooltip"
            // style={styles}
          >
            <slot
              name="content"
              aria-live={this.opened ? 'polite' : 'off'}
            >
              {this.content}
            </slot>
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
