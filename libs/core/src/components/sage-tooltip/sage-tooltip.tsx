// import { computePosition, flip, shift, offset, arrow, inline, autoUpdate } from '@floating-ui/dom';
import { computePosition, arrow, flip, offset, shift } from '@floating-ui/dom';
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
  private arrowEl: HTMLElement | null;
  private triggerEl: HTMLElement | null;
  private tooltipEl: HTMLElement | null;

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
    this.tooltipEl.style.display = 'block';
    this.positionTooltip();
  }

  @Method()
  async hideTooltip() {
    this.opened = false;
    this.tooltipEl.style.display = '';
    this.positionTooltip();
  }

  private handleShow = () => {
    console.log('entered');
    this.showTooltip();
  };

  private handleHide = () => {
    console.log('left');
    this.hideTooltip();
  };

  private positionTooltip() {
    console.log('position');
    console.log(this.triggerEl);
    console.log(this.tooltipEl);
    console.log(this.arrowEl);
    computePosition(this.triggerEl, this.tooltipEl, {
      placement: this.placement,
      strategy: 'fixed',
      middleware: [
        offset(22),
        shift({padding: 22}),
        flip(),
        arrow({element: this.arrowEl}),
      ]
    }).then(({ x, y, placement, middlewareData }) => {
      Object.assign(this.tooltipEl.style, {
        left: `${x}px`,
        top: `${y}px`,
      });

      // Accessing the data
      const {x: arrowX, y: arrowY} = middlewareData.arrow;

      const staticSide = {
        top: 'bottom',
        right: 'left',
        bottom: 'top',
        left: 'right',
      }[placement.split('-')[0]];

      Object.assign(this.arrowEl.style, {
        left: arrowX != null ? `${arrowX}px` : '',
        top: arrowY != null ? `${arrowY}px` : '',
        right: '',
        bottom: '',
        [staticSide]: '-4px',
      });
    });
  }

  render() {
    return (
      <Host
        class={{
          'is-open': this.opened
        }}
        hasArrow={this.hasArrow}
        onMouseEnter={this.handleShow}
        onMouseLeave={this.handleHide}
      >
        <div class="sage-tooltip">
          <span
            aria-describedby={this.componentId}
            part="trigger"
            ref={(el) => (this.triggerEl = el)}
          >
            <slot />
          </span>

          <div class="sage-tooltip__content"
            aria-hidden={this.opened ? 'false' : 'true'}
            id={this.componentId}
            part="content"
            ref={(el) => (this.tooltipEl = el)}
            role="tooltip"
          >
            <slot
              name="content"
              aria-live={this.opened ? 'polite' : 'off'}
            >
              {this.content}
            </slot>
            <div
              aria-hidden="true"
              part="arrow"
              ref={(el) => (this.arrowEl = el)}
            ></div>
          </div>
          {/* {this.hasArrow && <div class="sage-tooltip__arrow" part="arrow">arrow</div>} */}
        </div>
      </Host>
    );
  }
}
