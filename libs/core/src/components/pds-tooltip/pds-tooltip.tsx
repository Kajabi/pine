import { Component, Element, Event, Host, Prop, State, h, EventEmitter, Method, Watch } from '@stencil/core';

import { ReferenceElement } from "@floating-ui/core";
import { OverlayPlacementType } from '../../utils/types';

/**
 * @slot (default) - The tooltip's target element
 * @slot content - HTML content for the tooltip
 */

@Component({
  tag: 'pds-tooltip',
  styleUrl: 'pds-tooltip.scss',
  shadow: true,
})
export class PdsTooltip {
  private popover: HTMLPdsPopoverElement | null;
  private referenceElement: ReferenceElement | null = null;

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
   * Determines how the popover is positioned relative to the trigger element.
   * By default, the popover will use `absolute` positioning, which allows the
   * popover to scroll with the page. Setting this to `fixed` handles most used.
   * However, if the trigger element is within a container that has `overflow: hidden`
   * set, the popover will not be able to escape the container and get clipped. In
   * this case, you can set the `hoisted` property to `true` to use `fixed` positioning
   * instead. Be aware that this is less performant, as it requires recalculating
   * the popover position on scroll. Only use this option if you need it.
   * @defaultValue false
   */
  @Prop() hoisted? = false;

  /**
   * Enable this option when using the content slot
   * @defaultValue false
   */
  @Prop() htmlContent = false;

  /**
   * Sets the offset distance(in pixels) between the popover and the trigger element
   */
  @Prop() offset? = 12;

  /**
   * Sets the padding(in pixels) of the popover content element
   */
  @Prop() padding? = 14;

  /**
   * Determines the preferred position of the tooltip
   * @defaultValue "right"
   */
  @Prop({ reflect: true }) placement: OverlayPlacementType = 'right';

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

  /**
   * Emitted after a tooltip is closed
   */
  @Event() pdsTooltipHide: EventEmitter;

  /**
   * Emitted after a tooltip is shown
   */
  @Event() pdsTooltipShow: EventEmitter;

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
  }

  /**
   * Shows the tooltip by enabling the opened property
   */
  @Method()
  async showTooltip() {
    this.opened = true;
    console.log('showing tooltip');
    console.log('mymypopover', this.popover);
    this.popover.triggerEl = this.referenceElement;
    this.popover.showPdsPopover(); 
  }

  /**
   * Hides the tooltip by disabling the opened property
   */
  @Method()
  async hideTooltip() {
    this.opened = false;
    this.popover.hidePdsPopover();
  }

  private handleHide = () => {
    this.hideTooltip();
    this.pdsTooltipHide.emit();
  };

  private handleShow = () => {
    this.showTooltip();
    this.pdsTooltipShow.emit(); 
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
            ${this.htmlContent ? 'pds-tooltip--has-html-content' : ''}
          `}
          exportparts="content"
          ref={(el) => (this.referenceElement = el)}
        >
          <pds-popover
            ref={(el) => (this.popover = el)}
            hasArrow={this.hasArrow}
            offset={this.offset}
            opened={this.opened}
            padding={this.padding}
            placement={this.placement}
            // tooltips only show on hover so hoisted={true} is less of a performance
            // issue than click-based triggers
            hoisted={true} 
          >
            <span
              aria-describedby={this.componentId}
              class="pds-tooltip__trigger"
            >
              <slot />
            </span>
            <div slot="content">
              <slot
                name="content"
              ></slot>
              {this.content}
            </div>
          </pds-popover>
        </div>
      </Host>
    );
  }
}
