import { Component, Element, Event, EventEmitter, Host, h, Prop, State, Method, Listen } from '@stencil/core';
import type { BasePdsProps } from '@utils/interfaces';
import type { PdsFilterOpenEventDetail, PdsFilterCloseEventDetail, PdsFilterClearEventDetail, PdsFilterVariant } from './filter-interface';

import { enlarge, trash } from '@pine-ds/icons/icons';

/**
 * Individual filter component with cross-browser popover positioning.
 *
 * Uses a hybrid approach for optimal cross-browser compatibility:
 * - Modern browsers: CSS anchor positioning + JavaScript flip classes
 * - Fallback browsers: JavaScript positioning with viewport boundary detection
 *
 * @part button - Exposes the trigger button element for styling.
 * @part button-content - Exposes the button content container for styling.
 * @part button-text - Exposes the button text for styling.
 * @part icon - Exposes the icon component for styling.
 * @part popover - Exposes the popover container for styling.
 * @slot (default) - Popover content that will be displayed when the filter is open.
 */

@Component({
  tag: 'pds-filter',
  styleUrl: 'pds-filter.scss',
  shadow: true,
})
export class PdsFilter implements BasePdsProps {
  @Element() el!: HTMLPdsFilterElement;

  private popoverEl: HTMLElement;
  private scrollRAF: number | null = null;
  private lastScrollTime = 0;

  /**
   * A unique identifier used for the underlying component `id` attribute.
   */
  @Prop() componentId!: string;

  /**
   * The variant style of the filter trigger.
   * @defaultValue 'default'
   */
  @Prop() variant: PdsFilterVariant = 'default';

  /**
   * The name of the icon to display in the trigger button.
   * For 'clear' variant, this is ignored as it always shows trash icon.
   */
  @Prop() icon?: string;

  /**
   * The text content displayed in the trigger button.
   */
  @Prop() text?: string;


  /**
   * State to track if the popover is open.
   */
  @State() isOpen = false;

  /**
   * Event emitted when the filter popover is opened.
   */
  @Event() pdsFilterOpen: EventEmitter<PdsFilterOpenEventDetail>;

  /**
   * Event emitted when the filter popover is closed.
   */
  @Event() pdsFilterClose: EventEmitter<PdsFilterCloseEventDetail>;

  /**
   * Event emitted when the clear variant is clicked.
   */
  @Event() pdsFilterClear: EventEmitter<PdsFilterClearEventDetail>;


  /**
   * Component lifecycle: Clean up when disconnected from DOM.
   * Prevents memory leaks by canceling pending operations and closing popovers.
   */
  disconnectedCallback() {
    // Cancel pending animation frames
    if (this.scrollRAF) {
      cancelAnimationFrame(this.scrollRAF);
      this.scrollRAF = null;
    }

    this.lastScrollTime = 0;

    // Clean up native popover event listeners
    if (this.popoverEl) {
      const supportsPopoverAPI = HTMLElement.prototype.showPopover && !navigator.userAgent.includes('Firefox');
      if (supportsPopoverAPI) {
        this.popoverEl.removeEventListener('toggle', this.handleNativePopoverToggle);
      }
    }

    // Ensure popover is closed
    if (this.isOpen && this.popoverEl) {
      try {
        this.popoverEl.hidePopover();
      } catch {
        this.popoverEl.style.display = 'none';
        this.popoverEl.classList.remove('is-open');
      }
    }
  }


  componentDidRender() {
    // Note: popoverEl is set via ref callback in render method
    // For browsers with native popover API, we need direct element listeners
    // since the document listener may not capture native popover toggle events
    if (this.popoverEl) {
      const supportsPopoverAPI = HTMLElement.prototype.showPopover && !navigator.userAgent.includes('Firefox');

      if (supportsPopoverAPI) {
        // Remove any existing listeners to avoid duplicates
        this.popoverEl.removeEventListener('toggle', this.handleNativePopoverToggle);
        // Add direct listener for native popover events
        this.popoverEl.addEventListener('toggle', this.handleNativePopoverToggle);
      }
    }
  }

  /**
   * Handle native popover toggle events directly on the element
   * This is needed for browsers with native Popover API support
   */
  private handleNativePopoverToggle = (event: Event) => {
    const target = event.target as HTMLElement;

    if (target && target.id === `${this.componentId}-popover`) {
      // Check current popover state
      let isCurrentlyOpen = false;
      try {
        isCurrentlyOpen = target.matches(':popover-open');
      } catch {
        // Fallback if :popover-open selector isn't supported
        isCurrentlyOpen = target.style.display === 'block';
      }

      // Update state
      this.isOpen = isCurrentlyOpen;

      if (this.isOpen) {
        setTimeout(() => this.adjustPopoverPosition(), 0);

        this.pdsFilterOpen.emit({
          componentId: this.componentId,
          variant: this.variant,
          text: this.text,
        });
      } else {
        this.pdsFilterClose.emit({
          componentId: this.componentId,
          variant: this.variant,
          text: this.text,
        });
      }
    }
  };

  /**
   * Reposition popovers on window resize.
   */
  @Listen('resize', { target: 'window' })
  handleWindowResize() {
    if (this.isOpen) {
      setTimeout(() => this.adjustPopoverPosition(), 16);
    }
  }

  /**
   * Reposition popovers on scroll with performance throttling.
   */
  @Listen('scroll', { target: 'window', passive: true })
  handleWindowScroll() {
    if (this.isOpen) {
      const supportsAnchorPositioning = "anchorName" in document.documentElement.style;
      const now = performance.now();

      const throttleMs = supportsAnchorPositioning ? 66 : 33;
      if (now - this.lastScrollTime < throttleMs) {
        return;
      }

      this.lastScrollTime = now;

      if (this.scrollRAF) {
        cancelAnimationFrame(this.scrollRAF);
      }

      this.scrollRAF = requestAnimationFrame(() => {
        if (this.isOpen && this.popoverEl && this.el.isConnected) {
          this.adjustPopoverPosition();
        }
        this.scrollRAF = null;
      });
    }
  }

  /**
   * Closes other open filter popovers to ensure only one is open at a time.
   */
  private closeOtherPopovers() {
    const allFilters = document.querySelectorAll('pds-filter');

    allFilters.forEach((filter) => {
      if (filter === this.el) return;

      const popover = filter.shadowRoot?.querySelector('.pds-filter__popover') as HTMLElement;

      if (popover) {
        // Check for popover API support to avoid crashes
        let isPopoverOpen = false;
        try {
          isPopoverOpen = popover.matches(':popover-open');
        } catch {
          // Fallback if :popover-open selector isn't supported
          isPopoverOpen = popover.style.display === 'block';
        }

        if (isPopoverOpen) {
          try {
            popover.hidePopover();
          } catch {
            popover.style.display = 'none';
            popover.classList.remove('is-open');
          }
        }
      }
    });
  }

  /**
   * Adjusts popover position to keep it within viewport bounds.
   * Uses CSS anchor positioning for modern browsers, JavaScript for fallback browsers.
   */
  private adjustPopoverPosition() {
    if (!this.popoverEl || this.variant === 'clear') return;

    const triggerEl = this.el.shadowRoot?.querySelector('.pds-filter__trigger') as HTMLElement;
    if (!triggerEl) return;

    const triggerRect = triggerEl.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const supportsAnchorPositioning = "anchorName" in document.documentElement.style;

    // Get dimensions for boundary detection
    const popoverWidth = 228;
    const popoverHeight = this.popoverEl.getBoundingClientRect().height || 200;

    // Boundary detection for flipping
    const bufferSpace = 20;
    const wouldOverflowRight = (triggerRect.left + popoverWidth + bufferSpace) > viewportWidth;
    const wouldOverflowBottom = (triggerRect.bottom + 8 + popoverHeight + bufferSpace) > viewportHeight;

    if (supportsAnchorPositioning) {
      // Modern browsers: CSS anchor positioning + JavaScript-controlled flipping
      this.popoverEl.classList.remove('popover-flip-horizontal', 'popover-flip-vertical');

      if (wouldOverflowRight) {
        this.popoverEl.classList.add('popover-flip-horizontal');
      }

      if (wouldOverflowBottom) {
        this.popoverEl.classList.add('popover-flip-vertical');
      }

    } else {
      // Fallback browsers: JavaScript positioning with boundary detection
      let left = triggerRect.left;
      let top = triggerRect.bottom + 8;
      let transformOrigin = 'top left';

      // Apply horizontal flipping if needed
      if (wouldOverflowRight) {
        const actualPopoverWidth = this.popoverEl.getBoundingClientRect().width || popoverWidth;
        left = triggerRect.right - actualPopoverWidth;
        transformOrigin = 'top right';
      }

      // Apply vertical flipping if needed
      if (wouldOverflowBottom) {
        top = triggerRect.top - popoverHeight - 8;
        transformOrigin = transformOrigin.replace('top', 'bottom');
      }

      // Apply positioning in single DOM write for performance
      this.popoverEl.style.cssText = `
        position: fixed;
        left: ${left}px;
        top: ${top}px;
        z-index: var(--pine-z-index-overlay);
        transform-origin: ${transformOrigin};
      `;
    }
  }

  /**
   * Opens the filter popover programmatically.
   * Note: Clear variant does not support popover functionality.
   */
  @Method()
  async showFilter() {
    if (this.variant === 'clear') {
      console.warn('Clear variant does not support showFilter method');
      return;
    }

    if (this.popoverEl != null) {
      try {
        this.popoverEl.showPopover();
      } catch {
        // Fallback for testing environment where showPopover is not available
        this.popoverEl.style.display = 'block';
        this.popoverEl.classList.add('is-open');
      }
    }
  }

  /**
   * Closes the filter popover programmatically.
   * Note: Clear variant does not support popover functionality.
   */
  @Method()
  async hideFilter() {
    if (this.variant === 'clear') {
      console.warn('Clear variant does not support hideFilter method');
      return;
    }

    if (this.popoverEl != null) {
      try {
        this.popoverEl.hidePopover();
      } catch {
        // Fallback for testing environment where hidePopover is not available
        this.popoverEl.style.display = 'none';
        this.popoverEl.classList.remove('is-open');
      }
    }
  }

  /**
   * Listen for popover toggle events for browsers without native Popover API (fallback).
   * Native API browsers use direct element listeners to avoid conflicts.
   */
  @Listen('toggle', { target: 'document' })
  handlePopoverToggle(event: Event) {
    const target = event.target as HTMLElement;
    const supportsPopoverAPI = HTMLElement.prototype.showPopover && !navigator.userAgent.includes('Firefox');

    // Only handle events for fallback browsers (Firefox) to avoid duplicate handling
    if (!supportsPopoverAPI && target && target.id === `${this.componentId}-popover`) {
      // Check for popover API support to avoid crashes
      let isCurrentlyOpen = false;
      try {
        isCurrentlyOpen = target.matches(':popover-open');
      } catch {
        // Fallback if :popover-open selector isn't supported
        isCurrentlyOpen = target.style.display === 'block';
      }

      // Update state
      this.isOpen = isCurrentlyOpen;

      if (this.isOpen) {
        setTimeout(() => this.adjustPopoverPosition(), 0);

        this.pdsFilterOpen.emit({
          componentId: this.componentId,
          variant: this.variant,
          text: this.text,
        });
      } else {
        this.pdsFilterClose.emit({
          componentId: this.componentId,
          variant: this.variant,
          text: this.text,
        });
      }
    }
  }

  /**
   * Listen for clicks to detect outside dismissal.
   */
  @Listen('click', { target: 'document' })
  handleDocumentClick(event: Event) {
    // Check if click is outside and popover gets closed
    if (!this.el.contains(event.target as Node) && this.isOpen && this.variant !== 'clear') {
      setTimeout(() => {
        if (this.popoverEl && this.isOpen) {
          // Check for popover API support to avoid crashes
          const supportsPopoverAPI = HTMLElement.prototype.showPopover && !navigator.userAgent.includes('Firefox');

          let popoverIsClosed = false;
          if (supportsPopoverAPI) {
            try {
              popoverIsClosed = !this.popoverEl.matches(':popover-open');
            } catch {
              // Fallback if :popover-open selector isn't supported
              popoverIsClosed = this.popoverEl.style.display !== 'block';
            }
          } else {
            // Manual fallback - assume popover was closed by outside click
            popoverIsClosed = true;
          }

          if (popoverIsClosed) {
            this.isOpen = false;
            if (!supportsPopoverAPI) {
              this.popoverEl.style.display = 'none';
              this.popoverEl.classList.remove('is-open');
            }
            this.pdsFilterClose.emit({
              componentId: this.componentId,
              variant: this.variant,
              text: this.text,
            });
          }
        }
      }, 0);
    }
  }

  /**
   * Listen for Escape key to ensure close event fires.
   */
  @Listen('keydown', { target: 'document' })
  handleEscapeKey(event: KeyboardEvent) {
    if (event.key === 'Escape' && this.isOpen && this.variant !== 'clear') {
      // Check if popover was closed by Escape
      setTimeout(() => {
        if (this.popoverEl && this.isOpen) {
          // Check for popover API support to avoid crashes
          const supportsPopoverAPI = HTMLElement.prototype.showPopover && !navigator.userAgent.includes('Firefox');

          let popoverIsClosed = false;
          if (supportsPopoverAPI) {
            try {
              popoverIsClosed = !this.popoverEl.matches(':popover-open');
            } catch {
              // Fallback if :popover-open selector isn't supported
              popoverIsClosed = this.popoverEl.style.display !== 'block';
            }
          } else {
            // Manual fallback - assume popover was closed by Escape
            popoverIsClosed = true;
          }

          if (popoverIsClosed) {
            this.isOpen = false;
            if (!supportsPopoverAPI) {
              this.popoverEl.style.display = 'none';
              this.popoverEl.classList.remove('is-open');
            }
            this.pdsFilterClose.emit({
              componentId: this.componentId,
              variant: this.variant,
              text: this.text,
            });
          }
        }
      }, 0);
    }
  }

  /**
   * Handle keyboard interactions for clear variant only.
   */
  private handleKeyDown = (event: KeyboardEvent) => {
    // Only handle clear variant manually, let native API handle everything else
    if (this.variant === 'clear' && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      this.handleClick();
    }
  };

  /**
   * Handle trigger button click. Clear variant emits event, others toggle popover.
   */
  private handleClick = (event?: Event) => {
    if (this.variant === 'clear') {
      this.pdsFilterClear.emit({
        componentId: this.componentId,
        text: this.text,
      });
      return;
    }

    this.closeOtherPopovers();

    // Check for popover API support
    const supportsPopoverAPI = HTMLElement.prototype.showPopover && !navigator.userAgent.includes('Firefox');

    if (!supportsPopoverAPI) {
      // Manual fallback for browsers without popover API support
      // Prevent default to avoid conflicts with any native behavior
      if (event) {
        event.preventDefault();
      }

      setTimeout(() => {
        if (this.popoverEl != null) {
          this.isOpen = !this.isOpen;
          if (this.isOpen) {
            this.popoverEl.style.display = 'block';
            this.popoverEl.classList.add('is-open');
            this.adjustPopoverPosition();
            this.pdsFilterOpen.emit({
              componentId: this.componentId,
              variant: this.variant,
              text: this.text,
            });
          } else {
            this.popoverEl.style.display = 'none';
            this.popoverEl.classList.remove('is-open');
            this.pdsFilterClose.emit({
              componentId: this.componentId,
              variant: this.variant,
              text: this.text,
            });
          }
        }
      }, 0);
    }
    // For browsers with native popover API, let the native behavior handle the toggle
    // The toggle event listener will capture the state change and emit events
  };

  /**
   * Get the appropriate icon for the variant.
   */
  private getIcon() {
    if (this.variant === 'clear') {
      return trash;
    }
    return this.icon;
  }

  /**
   * Get CSS classes for the trigger button.
   */
  private getTriggerClasses() {
    const classes = ['pds-filter__trigger'];
    classes.push(`pds-filter__trigger--${this.variant}`);

    if (this.isOpen && this.variant !== 'clear') {
      classes.push('pds-filter__trigger--open');
    }

    return classes.join(' ');
  }

  /**
   * Render the trigger icon.
   */
  private renderIcon() {
    const iconToRender = this.getIcon();
    if (iconToRender == null || iconToRender === '') return null;

    return (
      <pds-icon
        icon={iconToRender}
        size="var(--pine-font-size-100)"
        aria-hidden="true"
        part="icon"
      />
    );
  }

  /**
   * Render the dropdown icon for selected variant.
   */
  private renderDropdownIcon() {
    if (this.variant === 'selected') {
      return (
        <pds-icon
          icon={enlarge}
          size="var(--pine-dimension-200)"
          aria-hidden="true"
          class="pds-filter__dropdown-icon"
          part="icon"
        />
      );
    }
    return null;
  }

  render() {
    return (
      <Host id={this.componentId}>
        <button
          class={this.getTriggerClasses()}
          type="button"
          popoverTarget={this.variant !== 'clear' ? `${this.componentId}-popover` : undefined}
          popoverTargetAction={this.variant !== 'clear' ? 'toggle' : undefined}
          onKeyDown={this.variant === 'clear' ? this.handleKeyDown : undefined}
          onClick={(event) => this.handleClick(event)}
          part="button"
          aria-expanded={this.isOpen ? 'true' : 'false'}
          aria-haspopup={this.variant !== 'clear' ? 'true' : undefined}
          aria-controls={this.variant !== 'clear' ? `${this.componentId}-popover` : undefined}
        >
          <span class="pds-filter__button-content" part="button-content">
            {this.renderIcon()}
            {this.text && (
              <span class="pds-filter__button-text" part="button-text">
                {this.text}
              </span>
            )}
            {this.renderDropdownIcon()}
          </span>
        </button>

        {this.variant !== 'clear' && (
          <div
            ref={el => this.popoverEl = el}
            id={`${this.componentId}-popover`}
            class="pds-filter__popover"
            popover="auto"
            part="popover"
          >
            <slot />
          </div>
        )}
      </Host>
    );
  }
}
