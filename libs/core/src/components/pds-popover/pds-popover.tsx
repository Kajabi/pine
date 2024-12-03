import { Component, Element, Event, EventEmitter, Host, Listen, h, Prop } from '@stencil/core';

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

  @Prop() text: string;

   /**
   * Emits a custom event when the popover should be shown.
   */
  // showPopover() {
  //   this.active = true;
  //   this.emitEvent('showPdsPopover');
  // }

  /**
   * Emits a custom event when the popover should be hidden.
   */
  // hidePopover() {
  //   this.active = false;
  //   this.emitEvent('hidePdsPopover');
  // }

  @Event() showPdsPopover: EventEmitter;

  @Event() hidePdsPopover: EventEmitter;

  @Listen('showPdsPopover')
  handleShowPopover() {
    this.active = true;
  }

  @Listen('hidePdsPopover')
  handleHidePopover() {
    this.active = false;
  }

  private handlePopoverAction() {
    if (this.popoverTargetAction === 'show') {
      this.showPdsPopover.emit();
    } else if (this.popoverTargetAction === 'hide') {
      this.hidePdsPopover.emit();
    }
  }

  render() {
    return (
      <Host>
        <button
          popoverTarget={this.componentId}
          popoverTargetAction="show"
          // onClick={this.handlePopoverAction}
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
