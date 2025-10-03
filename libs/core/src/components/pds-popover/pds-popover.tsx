import { Component, Element, Event, EventEmitter, Host, Listen, h, Method, Prop, State } from '@stencil/core';
import { PlacementType } from '@utils/types';
import { PdsPopoverEventDetail, ToggleEvent } from './popover-interface';

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
   * Bound reference to the toggle handler for proper cleanup
   */
  private boundToggleHandler: (event: Event) => void;

  /**
   * Tracks if the component is still mounted to prevent memory leaks
   */
  private isComponentMounted = true;

  /**
   * Emitted when the popover is opened
   */
  @Event() pdsPopoverOpen: EventEmitter<PdsPopoverEventDetail>;

  /**
   * Emitted when the popover is closed
   */
  @Event() pdsPopoverClose: EventEmitter<PdsPopoverEventDetail>;

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

  componentDidLoad() {
    // Attach toggle event listener to the popover element
    const popoverEl = this.el.shadowRoot?.querySelector('div[popover]');
    if (popoverEl != null) {
      this.boundToggleHandler = this.handleToggle.bind(this);
      popoverEl.addEventListener('toggle', this.boundToggleHandler);
    }
  }

  disconnectedCallback() {
    this.isComponentMounted = false;

    // Clean up event listener
    const popoverEl = this.el.shadowRoot?.querySelector('div[popover]');
    if (popoverEl != null && this.boundToggleHandler != null) {
      popoverEl.removeEventListener('toggle', this.boundToggleHandler);
    }
  }

  /**
   * Opens the popover programmatically
   */
  @Method()
  async show() {
    const popoverEl = this.el.shadowRoot?.querySelector('div[popover]') as HTMLElement & { showPopover?: () => void } | null;
    if (popoverEl != null && typeof popoverEl.showPopover === 'function') {
      try {
        popoverEl.showPopover();
      } catch (e) {
        // Popover might already be open
        console.warn('Failed to show popover:', e);
      }
    }
  }

  /**
   * Closes the popover programmatically
   */
  @Method()
  async hide() {
    const popoverEl = this.el.shadowRoot?.querySelector('div[popover]') as HTMLElement & { hidePopover?: () => void } | null;
    if (popoverEl != null && typeof popoverEl.hidePopover === 'function') {
      try {
        popoverEl.hidePopover();
      } catch (e) {
        // Popover might already be closed
        console.warn('Failed to hide popover:', e);
      }
    }
  }

  /**
   * Toggles the popover open/closed state programmatically
   */
  @Method()
  async toggle() {
    const popoverEl = this.el.shadowRoot?.querySelector('div[popover]') as HTMLElement & { togglePopover?: () => void } | null;
    if (popoverEl != null && typeof popoverEl.togglePopover === 'function') {
      try {
        popoverEl.togglePopover();
      } catch (e) {
        console.warn('Failed to toggle popover:', e);
      }
    }
  }

  private handleToggle(event: Event) {
    const toggleEvent = event as ToggleEvent;

    // Prepare event detail
    const eventDetail: PdsPopoverEventDetail = {
      componentId: this.componentId,
      popoverType: this.popoverType,
      text: this.text,
    };

    // Update internal state based on native popover state
    if (toggleEvent.newState === 'open') {
      this.active = true;
      const popoverEl = this.el.shadowRoot?.querySelector('div[popover]');

      // Remove positioned class to hide popover via CSS
      if (popoverEl != null) {
        popoverEl.classList.remove('pds-popover--positioned');
      }

      // Position after the browser has rendered the popover, then show it
      requestAnimationFrame(() => {
        // Prevent memory leak if component unmounts during animation frame
        if (!this.isComponentMounted) return;

        this.handlePopoverPositioning();
        if (popoverEl != null) {
          popoverEl.classList.add('pds-popover--positioned');
        }
      });
      this.pdsPopoverOpen.emit(eventDetail);
    } else if (toggleEvent.newState === 'closed') {
      this.active = false;
      this.pdsPopoverClose.emit(eventDetail);
    }
  }

  @Listen('scroll', {
    target: 'window',
    capture: true
  })
  handleScroll() {
    // Only reposition if the popover is actually open
    const popoverEl = this.el.shadowRoot?.querySelector('div[popover]');
    if (popoverEl != null && this.active === true) {
      this.handlePopoverPositioning();
    }
  }

  private handlePopoverPositioning() {
    const triggerEl = this.el.shadowRoot.querySelector('.pds-popover__trigger');
    const popoverEl = this.el.shadowRoot.querySelector('div[popover]');

    if (triggerEl == null || popoverEl == null) return;

    // Cast to HTMLElement after null check for proper typing
    const triggerElement = triggerEl as HTMLElement;
    const popoverElement = popoverEl as HTMLElement;

    const triggerRect = triggerElement.getBoundingClientRect();
    const popoverRect = popoverElement.getBoundingClientRect();

    let top = 0;
    let left = 0;
    const offset = 8

    switch (this.placement) {
      case 'top':
        top = triggerRect.top - popoverRect.height - offset;
        left = triggerRect.left + (triggerRect.width - popoverRect.width) / 2;
        break;
      case 'top-start':
        top = triggerRect.top - popoverRect.height - offset;
        left = triggerRect.left;
        break;
      case 'top-end':
        top = triggerRect.top - popoverRect.height - offset;
        left = triggerRect.right - popoverRect.width;
        break;
      case 'right':
        top = triggerRect.top + (triggerRect.height - popoverRect.height) / 2;
        left = triggerRect.right + offset;
        break;
      case 'right-start':
        top = triggerRect.top;
        left = triggerRect.right + offset;
        break;
      case 'right-end':
        top = triggerRect.bottom - popoverRect.height;
        left = triggerRect.right + offset;
        break;
      case 'bottom':
        top = triggerRect.bottom + offset;
        left = triggerRect.left + (triggerRect.width - popoverRect.width) / 2;
        break;
      case 'bottom-start':
        top = triggerRect.bottom + offset;
        left = triggerRect.left;
        break;
      case 'bottom-end':
        top = triggerRect.bottom + offset;
        left = triggerRect.right - popoverRect.width;
        break;
      case 'left':
        top = triggerRect.top + (triggerRect.height - popoverRect.height) / 2;
        left = triggerRect.left - popoverRect.width - offset;
        break;
      case 'left-start':
        top = triggerRect.top;
        left = triggerRect.left - popoverRect.width - offset;
        break;
      case 'left-end':
        top = triggerRect.bottom - popoverRect.height;
        left = triggerRect.left - popoverRect.width - offset;
        break;
    }

    popoverElement.style.top = `${top}px`;
    popoverElement.style.left = `${left}px`;
  }

  render() {
    return (
      <Host>
        <button
          class="pds-popover__trigger"
          popoverTarget={this.componentId}
          popoverTargetAction={this.popoverTargetAction}
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
