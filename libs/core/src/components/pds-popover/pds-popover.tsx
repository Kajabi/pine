
import { Component, Element, Event, Host, Prop, State, h, EventEmitter, Method } from '@stencil/core';
import { OverlayPlacementType } from '../../utils/types';

import {
  computePosition,
  flip,
  shift,
  offset,
  arrow,
  autoUpdate
} from '@floating-ui/dom';

/**
 * @slot (default) - The popover's target element
 * @slot content - HTML content for the popover
 * 
 * @part arrow - The popover arrow
 * @part content - The popover content
 */

@Component({
  tag: 'pds-popover',
  styleUrl: 'pds-popover.scss',
  shadow: true,
})
export class PdsPopover {
  private cleanupAutoUpdate: (() => void) | null = null;

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
   * Represents the overlay arrow in the popover
   */
  @Prop({ mutable: true }) arrow: HTMLElement | null;

  /**
   * A unique identifier used for the underlying component id attribute.
   */
  @Prop() componentId: string;

  /**
   * Represents the popover slot content element
   */
  @Prop({ mutable: true }) contentEl: HTMLElement | null;

  /**
   * Represents the popover trigger element
   */
  @Prop({ mutable: true }) triggerEl: HTMLElement | null;

  /**
   * Determines whether or not the popover has an arrow
   * @defaultValue false
   */
  @Prop() hasArrow? = false;

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
   * Sets the offset distance(in pixels) between the popover and the trigger element
   */
  @Prop() offset? = 12;

  /**
   * Determines whether or not the popover is visible
   * @defaultValue false
   */
  @Prop({mutable: true, reflect: true}) opened = false;
  
  /**
   * Sets the padding(in pixels) of the popover content element
   */
  @Prop() padding? = 14;

  /**
   * Determines the preferred position of the popover
   * @defaultValue "right"
   */
  @Prop({ reflect: true }) placement: OverlayPlacementType = 'right';

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

    // Start auto updates
    this.cleanupAutoUpdate = autoUpdate(
      this.triggerEl,
      this.contentEl,
      this.computePopoverPosition.bind(this),
    );
  }

  componentDidUpdate() {
    if (this.opened) {
      this.showPdsPopover();
    }
  }

  componentDidRender() {
    this.computePopoverPosition();
  }

  disconnectedCallback() {
    // Stop auto updates when the component is disconnected
    this.cleanupAutoUpdate?.();
  
    // Remove the global click event listener
    document.removeEventListener('click', this.handleGlobalClick);
  }

  private async computePopoverPosition() {
    if (this.triggerEl && this.contentEl) {
      const { x, y, placement, middlewareData } = await computePosition(this.triggerEl, this.contentEl, {
        placement: this.placement,
        strategy: this.hoisted ? 'fixed' : 'absolute',
        middleware: [
          offset(this.offset),
          flip(),
          shift({padding: this.padding}),
          arrow({element: this.hasArrow ? this.arrow : null}),
        ]
      })
      
      Object.assign(this.contentEl.style, {
        left: `${x}px`,
        top: `${y}px`,
      });

      const {x: arrowX, y: arrowY} = middlewareData.arrow;

      const staticSide = {
        top: 'bottom',
        right: 'left',
        bottom: 'top',
        left: 'right',
      }[placement.split('-')[0]];

      if (this.hasArrow) {
        Object.assign(this.arrow.style, {
          left: arrowX != null ? `${arrowX}px` : '',
          top: arrowY != null ? `${arrowY}px` : '',
          right: '',
          bottom: '',
          [staticSide]: '-4px',
        });
      }
    }
  }

  /**
   * Toggles the popover visibility on click
   */
  @Method()
  async togglePdsPopover() {
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
  async showPdsPopover() {
    this.opened = true;
  }

  /**
   * Hides the popover by disabling the opened property
   */
  @Method()
  async hidePdsPopover() {
    this.opened = false;
  }

  private handleHide = () => {
    this.hidePdsPopover();
    this.pdsPopoverHide.emit();
  };

  private handleShow = () => {
    this.showPdsPopover();
    this.computePopoverPosition();
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

  private popoverClasses() {
    const classNames = [];

    if(this.placement){ classNames.push(`pds-popover--${this.placement}`); }
    if(this.opened){ classNames.push('pds-popover--is-open'); }
    if(!this.hasArrow){ classNames.push('pds-popover--no-arrow'); }
    if(this.hoisted){ classNames.push('pds-popover--hoisted'); }

    return classNames.join('  ');
  };

  render() {
    return (
      <Host exportparts="arrow, content">
        <div
          class={`pds-popover ${this.popoverClasses()}`}
          id={this.componentId}
        >
          <span
            aria-describedby={this.componentId}
            class="pds-popover__trigger"
            onClick={() => this.togglePdsPopover()}
            ref={(el) => (this.triggerEl = el)}
          >
            <slot />
          </span>

          <div class="pds-popover__content"
            aria-hidden={this.opened ? 'false' : 'true'}
            aria-live={this.opened ? 'polite' : 'off'}
            id={`${this.componentId}-content`}
            part="content"
            ref={(el) => (this.contentEl = el)}
          >
            <slot
              name="content"
            ></slot>
            {this.hasArrow &&
              <div class="pds-popover__arrow" 
                part="arrow" 
                ref={(el) => (this.arrow = el)}
              ></div>
            }
          </div>
        </div>
      </Host>
    );
  }
}