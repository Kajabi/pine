import { Component, Element, Host, Listen, h, Prop, State } from '@stencil/core';
import { PlacementType } from '@utils/types';

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
   * Determines when the popover is active
   * @defaultValue false
   */
  @State() active = false;

  /**
   * Determines the action that triggers the popover. For manual popovers, the consumer is responsible for toggling this value.
   * @defaultValue "show"
   */
  @Prop() popoverTargetAction: 'show' | 'toggle' | 'hide' = 'show';

  /**
   * Determines the type of popover. Auto popovers can be "light dismissed" by clicking outside of the popover.
   * Manual popovers require the consumer to handle the visibility of the popover.
   */
  @Prop() popoverType: 'auto' | 'manual' = 'auto';

  /**
   * A unique identifier used for the underlying component `id` attribute.
   */
  @Prop() componentId: string;

  /**
   * Text that appears on the trigger element
   */
  @Prop() text: string;

  /**
   * Sets the maximum width of the popover content
   * @defaultValue 352
   */
  @Prop() maxWidth?: number = 352;

  /**
   * Determines the preferred position of the popover
   * @defaultValue "right"
   */
  @Prop({ reflect: true }) placement: PlacementType = 'right';

  componentWillRender() {
    this.handlePopoverPositioning();
  }

  @Listen('click', {
    capture: true
  })
  handleClick() {
    this.active = !this.active;
  }

  @Listen('scroll', {
    target: 'window',
    capture: true
  })
  handleScroll() {
    if (this.active) {
      this.handlePopoverPositioning();
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
    const offset = 8

    switch (this.placement) {
      case 'top':
        top = triggerRect.top - popoverRect.height - offset;
        left = triggerRect.left;
        break;
      case 'right':
        top = triggerRect.top;
        left = triggerRect.right + offset;
        break;
      case 'bottom':
        top = triggerRect.bottom + offset;
        left = triggerRect.left;
        break;
      case 'left':
        top = triggerRect.top;
        left = triggerRect.left - popoverRect.width - offset;
        break;
    }

    popoverEl.style.top = `${top}px`;
    popoverEl.style.left = `${left}px`;
  }

  render() {
    return (
      <Host>
        <button
          class="pds-popover__trigger"
          popoverTarget={this.componentId}
          popoverTargetAction={this.popoverTargetAction}
          onClick={this.handleClick}
        >
          {this.text}
        </button>
        <div
          class={`pds-popover ${this.active ? 'pds-popover--active' : ''}`}
          id={this.componentId}
          popover={this.popoverType}
          style={{ maxWidth: `${this.maxWidth}px` }}
        >
          <slot></slot>
        </div>
      </Host>
    );
  }
}
