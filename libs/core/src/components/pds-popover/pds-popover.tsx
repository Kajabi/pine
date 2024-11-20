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

  /**
   * A unique identifier used for the underlying component `id` attribute.
   */
  @Prop() componentId: string;

   /**
   * Emits a custom event when the popover should be shown.
   */
  showPopover() {
    this.emitEvent('showPopover');
  }

  /**
   * Emits a custom event when the popover should be hidden.
   */
  hidePopover() {
    this.emitEvent('hidePopover');
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
        <button popoverTarget="mypopover" popoverTargetAction="show">
          Show popover
        </button>
        <button popoverTarget="mypopover" popoverTargetAction="hide">
          Hide popover
        </button>
        {/* <pds-button popoverTarget="mypopover" popoverTargetAction="hide">
          Hide popover
        </pds-button> */}
        <div id="mypopover" popover="">
          <slot></slot>
        </div>
      </Host>
    );
  }
}
