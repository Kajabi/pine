import { Component, Element, Event, EventEmitter, Host, h, Prop } from '@stencil/core';

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

  @Prop() active = false;

  @Prop() popoverTargetAction: 'show' | 'hide' = 'show';

  /**
   * A unique identifier used for the underlying component `id` attribute.
   */
  @Prop() componentId: string;

   /**
   * Emits a custom event when the popover should be shown.
   */
  showPopover() {
    this.active = true;
    this.emitEvent('showPopover');
  }

  /**
   * Emits a custom event when the popover should be hidden.
   */
  hidePopover() {
    this.active = false;
    this.emitEvent('hidePopover');
  }

  private handlePopoverAction() {
    if (this.popoverTargetAction === 'show') {
      this.showPopover();
    } else if (this.popoverTargetAction === 'hide') {
      this.hidePopover();
    }
  }

  private emitEvent(eventName: string) {
    const event = new CustomEvent(eventName, {
      bubbles: true,
      composed: true,
    });
    this.el.dispatchEvent(event);
  }

  @Event() show: EventEmitter;

  @Event() hide: EventEmitter;

  render() {
    return (
      <Host>
        <button
          popoverTarget={this.componentId}
          popoverTargetAction="show"
          onClick={this.handlePopoverAction}
        >
          Show Show popover
        </button>
        <button
          popoverTarget={this.componentId}
          popoverTargetAction="hide"
          onClick={this.handlePopoverAction}
        >
          Hide popover
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
