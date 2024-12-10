import { Component, Element, Event, EventEmitter, Host, Listen, h, Method, Prop, State , Build} from '@stencil/core';
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
   * Determines the action that triggers the popover
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

  /**
   * Emitted when the popover is shown
   */
  @Event() showPdsPopover: EventEmitter;

  /**
   * Emitted when the popover is hidden
   */
  @Event() hidePdsPopover: EventEmitter;

  @Listen('keydown', {
    capture: true
  })
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      if (!this.active) {
        if (this.active) {
          event.stopPropagation();
          return;
        }
        const closestTarget = (event.target as HTMLElement).shadowRoot.querySelector(".pds-popover__trigger");
        if (closestTarget) {
          event.preventDefault();
          event.stopPropagation();
        }

        this.show();
        event.preventDefault();
        event.stopPropagation();
        return;
      } else {
        this.hide();
        event.preventDefault();
        event.stopPropagation();
        return;
      }
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

    if (event.composedPath()[0] !== this.el.shadowRoot.querySelector('.pds-popover__trigger')) {
      // event.stopPropagation();
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
  handleDocumentClick(event: MouseEvent) {
    if (this.active && this.popoverType !== 'manual') {
      this.hide();
      event.stopPropagation();
    }
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
    // right and bottom are working, but left and top are overlapping the trigger

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
        left = triggerRect.left - popoverRect.width - triggerRect.width;
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
    this.active = true;
    this.handlePopoverPositioning();

    const popoverElement = this.el.shadowRoot.querySelector('[popover]') as HTMLElement;
    if (Build.isBrowser) {
      popoverElement.showPopover();
    }

    this.showPdsPopover.emit();
  }

  /**
   * Hides the popover by disabling the active state
   */
  @Method()
  async hide() {
    this.active = false;
    const popoverElement = this.el.shadowRoot.querySelector('[popover]') as HTMLElement;

    if (Build.isBrowser) {
      popoverElement.hidePopover();
    }

    this.hidePdsPopover.emit();
  }

  render() {
    return (
      <Host>
        <button
          class="pds-popover__trigger"
          popoverTarget={this.componentId}
          popoverTargetAction={this.popoverTargetAction}
          onKeyDown={this.handleKeyDown}
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
