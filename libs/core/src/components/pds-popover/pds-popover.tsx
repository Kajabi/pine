import { Component, Element, Event, EventEmitter, Host, Listen, h, Method, Prop } from '@stencil/core';
import { TooltipPlacementType } from '@utils/types';

@Component({
  tag: 'pds-popover',
  styleUrl: 'pds-popover.scss',
  shadow: true,
})
export class PdsPopover {
  /**
   * Reference to the Host element
   */
  @Element() el: HTMLPdsPopoverElement;

  @Prop({ mutable: true }) active = false;

  @Prop() popoverTargetAction: 'show' | 'hide' = 'show';

  /**
   * A unique identifier used for the underlying component `id` attribute.
   */
  @Prop() componentId: string;

  @Prop() text: string;

  @Prop({ reflect: true }) placement: TooltipPlacementType = 'right';

  @Event() showPdsPopover: EventEmitter;

  @Event() hidePdsPopover: EventEmitter;

  @Listen('keydown', {
    capture: true
  })
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ' && !this.active) {
      if (this.active) {
        event.stopPropagation();
        return;
      }
      const closestTarget = (event.target as HTMLElement).closest("div[slot='trigger']");
      if (closestTarget) {
        event.preventDefault();
        event.stopPropagation();
      }

      this.show();
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    if (event.key === 'Escape' && this.active) {
      this.hide();
      event.preventDefault();
      event.stopPropagation();
    }
  }

  @Listen('click', {
    capture: true
  })
  handleClick(event: MouseEvent) {
    const closestTarget = (event.target as HTMLElement).shadowRoot.querySelector(".pds-popover__trigger");

    if (!closestTarget) {
      event.stopPropagation();
      return;
    }

    if (!this.active) {
      this.show();
    }
    event.stopPropagation();
  }


  @Listen('click', {
    target: 'document'
  })
  handleOutsideClick(event: MouseEvent) {
    if (this.active) {
      this.hide();
      event.stopPropagation();
    }
  }

  private handlePopoverPositioning() {
    const triggerEl = this.el.shadowRoot.querySelector('.pds-popover__trigger') as HTMLElement;
    const popoverEl = this.el.shadowRoot.querySelector('div[popover]') as HTMLElement;

    if (!triggerEl || !popoverEl) return;

    const triggerRect = triggerEl.getBoundingClientRect();
    const popoverRect = popoverEl.getBoundingClientRect();

    let top = 0;
    let left = 0;
    // right and bottom are working, but left and top are overlapping the trigger
    // console.log('handlePopoverPositioning');
    // console.log(triggerRect, popoverRect);

    switch (this.placement) {
      case 'top':
        top = triggerRect.top - popoverRect.height;
        left = triggerRect.left + (triggerRect.width - popoverRect.width) / 2;
        break;
      case 'right':
        top = triggerRect.top + (triggerRect.height - popoverRect.height) / 2;
        left = triggerRect.right;
        break;
      case 'bottom':
        top = triggerRect.bottom;
        left = triggerRect.left + (triggerRect.width - popoverRect.width) / 2;
        break;
      case 'left':
        top = triggerRect.top + (triggerRect.height - popoverRect.height) / 2;
        left = triggerRect.left - popoverRect.width;
        break;
    }

    popoverEl.style.top = `${top}px`;
    popoverEl.style.left = `${left}px`;
  }

  /**
   * Shows the popover by enabling the active state
   */
  @Method()
  async show() {
    console.log('show');
    this.active = true;
    this.handlePopoverPositioning();
    this.showPdsPopover.emit();
  }

  /**
   * Hides the popover by disabling the active state
   */
  @Method()
  async hide() {
    this.active = false;
    this.hidePdsPopover.emit();
  }

  render() {
    return (
      <Host>
        <button
          class="pds-popover__trigger"
          popoverTarget={this.componentId}
          popoverTargetAction="show"
          onKeyDown={this.handleKeyDown}
          onClick={this.handleClick}
        >
          {this.text}
          <pds-icon icon="chevron-down"></pds-icon>
        </button>
        <div
          id={this.componentId}
          popover=""
        >
          <slot></slot>
        </div>
      </Host>
    );
  }
}
