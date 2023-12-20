
import { Component, Element, Event, Host, Prop, State, h, EventEmitter, Method } from '@stencil/core';
// import {
//   positionTooltip
// } from '../../utils/overlay';
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
 */

@Component({
  tag: 'pds-popover',
  styleUrl: 'pds-popover.scss',
  shadow: true,
})
export class PdsPopover {
  @Prop() arrow: HTMLElement | null;
  @Prop() contentEl: HTMLElement | null;
  @Prop() triggerEl: HTMLElement | null;
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
   * A unique identifier used for the underlying component id attribute.
   */
  @Prop() componentId: string;

  /**
   * Determines whether or not the popover has an arrow
   * @defaultValue false
   */
  @Prop() hasArrow? = false;

  @Prop() hoisted? = false;

  @Prop() offset? = 12;

  @Prop() padding? = 14;

  /**
   * Determines the preferred position of the popover
   * @defaultValue "right"
   */

  @Prop({ reflect: true }) placement: OverlayPlacementType = 'right';

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
          arrow({element: this.arrow}),
        ]
      })
      
      Object.assign(this.contentEl.style, {
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

      Object.assign(this.arrow.style, {
        left: arrowX != null ? `${arrowX}px` : '',
        top: arrowY != null ? `${arrowY}px` : '',
        right: '',
        bottom: '',
        [staticSide]: '-4px',
      });
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
    const popverClasses = `
      pds-popover--${this.placement}
      ${this.opened ? 'pds-popover--is-open' : ''}
      ${this.hasArrow ? '' : 'pds-popover--no-arrow'}
  `};

  render() {
    return (
      <Host>
        <div
          class={`pds-popover ${this.popoverClasses()}`}
          id={this.componentId}
        >
          <span
            aria-describedby={this.componentId}
            class="pds-popover__trigger"
            onClick={() => this.togglePdsPopover()}
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
            <div class="pds-popover__arrow" ref={(el) => (this.arrow = el)}></div>
          </div>
        </div>
      </Host>
    );
  }
}
