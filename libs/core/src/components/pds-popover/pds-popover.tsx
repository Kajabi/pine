import { Component, Element, Event, EventEmitter, Host, h, Method, Prop, State, Watch } from '@stencil/core';
import { containsComposed } from '@utils/closest';
import { restoreReflectedDefault } from '@utils/reflected-attribute-default';
import { PlacementType } from '@utils/types';
import { setAttributesIfChanged } from '@utils/attributes';
import { PdsPopoverEventDetail } from './popover-interface';

/**
 * @slot trigger - The trigger element for the popover
 * @slot (default) - The content to display inside the popover
 */
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
   * Tracks if the component is still mounted to prevent memory leaks
   */
  private isComponentMounted = true;

  /**
   * Set once `componentDidLoad` has built the portal, so a later reconnect knows to rebuild it
   */
  private hasLoaded = false;

  /**
   * A popover without a componentId keeps one generated portal id, even when the portal is rebuilt
   */
  private generatedPortalId: string | null = null;

  /**
   * Reference to the trigger element
   */
  private triggerEl: HTMLElement | null = null;

  /**
   * Puts the trigger's ARIA back when something else removes or changes it
   */
  private triggerObserver: MutationObserver | null = null;

  /**
   * Portal element rendered in document.body
   */
  private portalEl: HTMLElement | null = null;

  /**
   * Guard to prevent repositioning loops
   */
  private isRepositioning = false;

  /**
   * Debounce timers for performance optimization
   */
  private scrollDebounceTimer: ReturnType<typeof setTimeout> | null = null;
  private resizeDebounceTimer: ReturnType<typeof setTimeout> | null = null;

  /**
   * Track moved nodes and their placeholders for restoration
   */
  private movedNodes: Array<{ node: Node; placeholder: Comment }> = [];

  /**
   * Timestamp when popover was opened (for preventing immediate close)
   */
  private openTimestamp = 0;

  /**
   * Instance counter for unique IDs
   */
  private static instanceCounter = 0;

  /**
   * Bound handlers for cleanup
   */
  private boundClickOutsideHandler: (event: MouseEvent) => void;
  private boundEscapeKeyHandler: (event: KeyboardEvent) => void;
  private boundScrollHandler: () => void;
  private boundResizeHandler: () => void;

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
   * Sets the maximum width of the popover content
   * @defaultValue 352
   */
  @Prop() maxWidth?: number = 352;

  /**
   * Determines the preferred position of the popover
   * @defaultValue "right"
   */
  @Prop({ reflect: true, mutable: true }) placement: PlacementType = 'right';

  @Watch('placement')
  restorePlacementDefault(newValue: typeof this.placement) {
    this.placement = restoreReflectedDefault(this.el, 'placement', newValue, 'right');
  }

  componentDidLoad() {
    // Bind event handlers for cleanup
    this.boundClickOutsideHandler = this.handleClickOutside.bind(this);
    this.boundEscapeKeyHandler = this.handleEscapeKey.bind(this);
    this.boundScrollHandler = this.handleScroll.bind(this);
    this.boundResizeHandler = this.handleResize.bind(this);

    // Create portal element
    this.createPortal();
    this.hasLoaded = true;

    // Initialize trigger element by calling slot change handler
    // This is a fallback for environments where slot change might not fire reliably
    const triggerSlot = this.el.shadowRoot?.querySelector('slot[name="trigger"]') as HTMLSlotElement;
    if (triggerSlot && this.triggerEl == null) {
      const CustomEvent = (typeof window !== 'undefined' ? window.Event : global.Event) as any;
      const slotChangeEvent = new CustomEvent('slotchange');
      Object.defineProperty(slotChangeEvent, 'target', { value: triggerSlot, enumerable: true });
      this.handleTriggerSlotChange(slotChangeEvent);
    } else {
      // A component trigger delays componentDidLoad, so its slotchange ran before the portal existed.
      this.linkTriggerToPortal();
    }
  }

  /**
   * Handles changes to the trigger slot
   */
  private handleTriggerSlotChange = (event: Event) => {
    const slot = event.target as HTMLSlotElement;
    const assignedElements = slot.assignedElements();

    // Clean up previous trigger's event listener if it exists
    if (this.triggerEl != null) {
      this.triggerEl.removeEventListener('click', this.handleTriggerClick);
    }

    if (assignedElements.length > 0) {
      // Use the first assigned element as the trigger
      this.triggerEl = assignedElements[0] as HTMLElement;

      this.linkTriggerToPortal();

      // Attach click listener to handle popover visibility
      this.triggerEl.addEventListener('click', this.handleTriggerClick);
    } else {
      this.triggerEl = null;
    }

    this.observeTrigger();
  };

  // The trigger is the consumer's element, so anything can rewrite its attributes (a Turbo morph
  // matches it to server HTML that has no ARIA). Put Pine's values back when that happens.
  private observeTrigger() {
    this.triggerObserver?.disconnect();
    this.triggerObserver = null;
    if (this.triggerEl == null || typeof MutationObserver === 'undefined') return;

    this.triggerObserver = new MutationObserver(() => this.linkTriggerToPortal());
    this.triggerObserver.observe(this.triggerEl, {
      attributes: true,
      attributeFilter: ['aria-expanded', 'aria-controls'],
    });
  }

  // Set ARIA attributes to establish relationship between trigger and popover
  // This mirrors the native Popover API's accessibility behavior
  private linkTriggerToPortal() {
    if (this.triggerEl == null || this.portalEl == null) return;

    // Skips values already in place, so the trigger observer's own callback doesn't loop.
    setAttributesIfChanged(this.triggerEl, { 'aria-expanded': String(this.active), 'aria-controls': this.portalEl.id });
  }

  /**
   * Handles changes to the default slot (popover content)
   * When the popover is active, re-sync content with portal to handle dynamic updates
   */
  private handleContentSlotChange = () => {
    if (!this.active) return;
    this.updatePortalContent();
  };

  /**
   * Handles clicks on the trigger element
   */
  private handleTriggerClick = (event: Event) => {
    // Only prevent default if the trigger is not an anchor with href
    // This allows link navigation while still controlling popover visibility
    const composedPath = event.composedPath();
    const anchorWithHref = composedPath.find(
      (el) => el instanceof HTMLAnchorElement && (el as HTMLAnchorElement).href
    );

    if (!anchorWithHref) {
      event.preventDefault();
    }

    // Execute the appropriate action based on popoverTargetAction prop
    switch (this.popoverTargetAction) {
      case 'show':
        this.show();
        break;
      case 'hide':
        this.hide();
        break;
      case 'toggle':
      default:
        this.toggle();
        break;
    }
  };

  // componentDidLoad doesn't run again when a popover comes back, so rebuild whatever
  // disconnectedCallback tore down. Each step is a no-op when nothing was.
  connectedCallback() {
    if (!this.hasLoaded) return;

    this.isComponentMounted = true;
    this.createPortal();
    this.triggerEl?.addEventListener('click', this.handleTriggerClick);
    this.observeTrigger();
    this.linkTriggerToPortal();

    // Still open after a move: the trigger moved, so the portal follows it.
    if (this.active) {
      requestAnimationFrame(() => this.handlePopoverPositioning());
    }
  }

  disconnectedCallback() {
    // Moved in one operation (a DOM morph, or a framework reparenting it), the popover is
    // already back in the page. Its portal is in <body>, untouched, so it stays open, with focus
    // where it was.
    if (this.el.isConnected) return;

    this.isComponentMounted = false;

    // Open, the content sits in the portal; put it back before the portal goes. Only listeners on
    // the popover itself hear the close event now, but those are the ones mirroring its state.
    if (this.active) {
      this.restorePortalContent();
      this.active = false;
      this.linkTriggerToPortal();
      this.pdsPopoverClose.emit({
        componentId: this.componentId,
        popoverType: this.popoverType,
      });
    }

    // Clean up trigger click event listener
    if (this.triggerEl != null) {
      this.triggerEl.removeEventListener('click', this.handleTriggerClick);
    }

    this.triggerObserver?.disconnect();
    this.triggerObserver = null;

    // Clean up all event listeners
    this.removeLightDismissListeners();
    this.removeScrollAndResizeListeners();

    // Clear any pending debounce timers
    this.clearDebounceTimers();

    // Remove portal from DOM
    this.removePortal();
  }

  /**
   * Clears any pending debounce timers
   */
  private clearDebounceTimers() {
    if (this.scrollDebounceTimer !== null) {
      clearTimeout(this.scrollDebounceTimer);
      this.scrollDebounceTimer = null;
    }
    if (this.resizeDebounceTimer !== null) {
      clearTimeout(this.resizeDebounceTimer);
      this.resizeDebounceTimer = null;
    }
  }

  private createPortal() {
    if (this.portalEl !== null) return;

    this.portalEl = document.createElement('div');
    this.portalEl.className = 'pds-popover';

    // Apply all styles inline since portal is outside shadow DOM
    this.portalEl.style.position = 'fixed';
    this.portalEl.style.zIndex = 'var(--pine-z-index-raised)';
    this.portalEl.style.maxWidth = `${this.maxWidth}px`;
    this.portalEl.style.display = 'none';
    this.portalEl.style.opacity = '0';
    this.portalEl.style.visibility = 'hidden';
    this.portalEl.style.backgroundColor = 'var(--pine-color-background-overlay)';
    this.portalEl.style.borderRadius = 'var(--pine-dimension-125)';
    this.portalEl.style.boxShadow = 'var(--pine-box-shadow-200)';
    this.portalEl.style.margin = 'var(--pine-dimension-none)';
    this.portalEl.style.padding = 'var(--pine-dimension-md)';

    // Generate unique ID
    if (!this.componentId) {
      this.generatedPortalId ??= `pds-popover-portal-${PdsPopover.instanceCounter++}`;
      this.portalEl.id = this.generatedPortalId;
    } else {
      this.portalEl.id = `${this.componentId}-portal`;
    }

    // Add accessibility attributes for screen readers
    // Note: Native Popover API doesn't add a specific role, keeping semantic HTML
    this.portalEl.setAttribute('aria-modal', 'false'); // Not a modal, can interact with rest of page

    // Append to body
    document.body.appendChild(this.portalEl);

    // Add global focus styles to match Pine design system
    // This is done after appending to ensure it's part of the document and can access CSS variables
    this.addPortalFocusStyles();
  }

  /**
   * Adds Pine design system focus styles and dark mode border to the portal element
   * Uses CSS variables from Pine's design tokens
   */
  private addPortalFocusStyles() {
    if (!this.portalEl) return;

    const portalId = this.portalEl.id;

    // Check if style element already exists
    const existingStyle = document.querySelector(`style[data-pds-popover-focus="${portalId}"]`);
    if (existingStyle) return;

    // Create style element with Pine's focus ring styles and dark mode border
    const styleEl = document.createElement('style');
    styleEl.setAttribute('data-pds-popover-focus', portalId);
    styleEl.textContent = `
      #${portalId}:focus {
        outline: var(--pine-outline-focus, 2px solid var(--pine-color-focus-ring, #6366f1)) !important;
        outline-offset: var(--pine-border-width, 1px);
      }
      #${portalId}:focus:not(:focus-visible) {
        outline: none;
      }
      [data-theme="dark"] #${portalId} {
        border: var(--pine-border);
      }
    `;

    document.head.appendChild(styleEl);
  }

  /**
   * Moves slot content into portal (preserves event handlers and component instances)
   */
  private updatePortalContent() {
    if (!this.portalEl) return;

    const contentSlotWrapper = this.el.shadowRoot?.querySelector('.pds-popover__content-slot-wrapper');
    const defaultSlot = contentSlotWrapper?.querySelector('slot');

    if (defaultSlot) {
      const assignedNodes = defaultSlot.assignedNodes();

      // Move each node into portal and track with placeholder for restoration
      assignedNodes.forEach(node => {
        // Skip if node is already in the portal or already tracked
        const isAlreadyInPortal = node.parentNode === this.portalEl;
        const isAlreadyTracked = this.movedNodes.some(moved => moved.node === node);

        if (isAlreadyInPortal || isAlreadyTracked) {
          return;
        }

        // Create a placeholder comment to mark original position
        const placeholder = document.createComment('pds-popover-placeholder');

        // Insert placeholder before moving the node
        node.parentNode?.insertBefore(placeholder, node);

        // Move the actual node to portal (preserves all handlers and state)
        this.portalEl!.appendChild(node);

        // Track for restoration
        this.movedNodes.push({ node, placeholder });
      });
    }
  }

  /**
   * Restores moved nodes back to their original positions
   */
  private restorePortalContent() {
    // Restore each moved node to its original position
    this.movedNodes.forEach(({ node, placeholder }) => {
      if (placeholder.parentNode) {
        placeholder.parentNode.insertBefore(node, placeholder);
        placeholder.parentNode.removeChild(placeholder);
      }
    });

    // Clear tracking array
    this.movedNodes = [];
  }

  private removePortal() {
    if (this.portalEl) {
      // Remove the portal element from DOM
      if (this.portalEl.parentNode) {
        this.portalEl.parentNode.removeChild(this.portalEl);
      }

      // Remove the associated focus style element
      const portalId = this.portalEl.id;
      const styleEl = document.querySelector(`style[data-pds-popover-focus="${portalId}"]`);
      if (styleEl && styleEl.parentNode) {
        styleEl.parentNode.removeChild(styleEl);
      }
    }
    this.portalEl = null;
  }

  /**
   * Opens the popover programmatically
   */
  @Method()
  async show() {
    if (this.active || !this.portalEl) return;

    this.active = true;

    // Record open timestamp to prevent immediate close from opening click
    this.openTimestamp = Date.now();

    this.linkTriggerToPortal();

    // Update portal content with latest slot content
    this.updatePortalContent();

    // Show portal
    this.portalEl.style.display = 'block';
    this.portalEl.style.opacity = '1';
    this.portalEl.style.visibility = 'visible';

    // Position the popover
    requestAnimationFrame(() => {
      if (!this.isComponentMounted) return;
      this.handlePopoverPositioning();
    });

    // Add scroll and resize listeners for repositioning (always)
    this.addScrollAndResizeListeners();

    // Add document listeners for light dismiss and escape key (auto type only)
    if (this.popoverType === 'auto') {
      this.addLightDismissListeners();
    }

    // Emit open event
    this.pdsPopoverOpen.emit({
      componentId: this.componentId,
      popoverType: this.popoverType,
    });
  }

  /**
   * Closes the popover programmatically
   */
  @Method()
  async hide() {
    if (!this.active || !this.portalEl) return;

    this.active = false;

    // Restoring the content drops its focus to the body, so check where focus is first.
    const focusWasInside = this.portalEl.contains(document.activeElement);

    this.linkTriggerToPortal();

    // Restore content back to original slot positions
    this.restorePortalContent();

    // Hide portal
    this.portalEl.style.display = 'none';
    this.portalEl.style.opacity = '0';
    this.portalEl.style.visibility = 'hidden';

    // Return focus to trigger for keyboard accessibility
    // This mirrors native Popover API behavior on close
    if (focusWasInside) {
      this.returnFocusToTrigger();
    }

    // Remove all listeners
    this.removeLightDismissListeners();
    this.removeScrollAndResizeListeners();

    // Clear any pending timers
    this.clearDebounceTimers();

    // Emit close event
    this.pdsPopoverClose.emit({
      componentId: this.componentId,
      popoverType: this.popoverType,
    });
  }

  /**
   * Toggles the popover open/closed state programmatically
   */
  @Method()
  async toggle() {
    if (this.active) {
      this.hide();
    } else {
      this.show();
    }
  }

  /**
   * Adds light dismiss listeners (click outside and escape key)
   */
  private addLightDismissListeners() {
    // Add listeners immediately - handleClickOutside will check timestamp
    document.addEventListener('click', this.boundClickOutsideHandler, true);
    document.addEventListener('keydown', this.boundEscapeKeyHandler);
  }

  /**
   * Removes light dismiss listeners
   */
  private removeLightDismissListeners() {
    document.removeEventListener('click', this.boundClickOutsideHandler, true);
    document.removeEventListener('keydown', this.boundEscapeKeyHandler);
  }

  /**
   * Adds scroll and resize listeners for repositioning
   */
  private addScrollAndResizeListeners() {
    window.addEventListener('scroll', this.boundScrollHandler, true);
    window.addEventListener('resize', this.boundResizeHandler);
  }

  /**
   * Removes scroll and resize listeners
   */
  private removeScrollAndResizeListeners() {
    window.removeEventListener('scroll', this.boundScrollHandler, true);
    window.removeEventListener('resize', this.boundResizeHandler);
  }

  /**
   * Handles clicks outside the popover for light dismiss (auto type only)
   */
  private handleClickOutside(event: MouseEvent) {
    // Ignore events that occurred at or before the popover opened
    // This prevents the opening click from immediately closing the popover
    // Convert event.timeStamp (DOMHighResTimeStamp from performance.now()) to epoch time
    // by calculating: currentEpochTime - (currentPerfTime - eventPerfTime)
    const eventTime = event.timeStamp
      ? Date.now() - (performance.now() - event.timeStamp)
      : Date.now();

    if (eventTime <= this.openTimestamp) {
      return;
    }

    const target = event.target as Node;

    // A datepicker's calendar is portaled to the body: a click in the calendar of a datepicker
    // inside this popover, in its content or its trigger, isn't outside it.
    const calendar = (target as Element).closest?.('.pds-datepicker-calendar-portal') as
      | (Element & { pdsDatepicker?: Element })
      | null;
    const owner = calendar?.pdsDatepicker;
    if (owner && (containsComposed(this.portalEl, owner) || containsComposed(this.triggerEl, owner))) return;

    // Check if click is outside both the popover portal and the trigger
    const clickedInsidePopover = this.portalEl?.contains(target);
    const clickedInsideTrigger = this.triggerEl?.contains(target);

    if (!clickedInsidePopover && !clickedInsideTrigger) {
      this.hide();
    }
  }

  /**
   * Returns focus to the trigger element with visible focus indicator
   * This ensures focus rings/outlines are shown as they would be with keyboard navigation
   */
  private returnFocusToTrigger() {
    if (!this.triggerEl) return;

    // Focus immediately while still in keyboard event context
    // This ensures the browser treats it as keyboard-initiated and shows focus ring
    this.triggerEl.focus({ preventScroll: true });
  }

  /**
   * Handles escape key press to close the popover
   * Mirrors native Popover API: Escape closes and returns focus to trigger
   */
  private handleEscapeKey(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      // Prevent default Escape behavior and stop propagation
      // This mirrors native Popover API which handles Escape exclusively
      event.preventDefault();
      event.stopPropagation();

      // Close popover and return focus to trigger
      this.hide();
    }
  }

  /**
   * Handles scroll events to reposition the popover (debounced for performance)
   */
  private handleScroll() {
    if (!this.active) return;

    if (this.scrollDebounceTimer !== null) {
      clearTimeout(this.scrollDebounceTimer);
    }

    this.scrollDebounceTimer = setTimeout(() => {
      this.handlePopoverPositioning();
      this.scrollDebounceTimer = null;
    }, 10); // 10ms debounce for smooth repositioning
  }

  /**
   * Handles resize events to reposition the popover (debounced for performance)
   */
  private handleResize() {
    if (!this.active) return;

    if (this.resizeDebounceTimer !== null) {
      clearTimeout(this.resizeDebounceTimer);
    }

    this.resizeDebounceTimer = setTimeout(() => {
      this.handlePopoverPositioning();
      this.resizeDebounceTimer = null;
    }, 100); // 100ms debounce for resize
  }

  /**
   * Positions the popover relative to its trigger element
   */
  private handlePopoverPositioning() {
    // Prevent repositioning loops
    if (this.isRepositioning) {
      return;
    }

    this.isRepositioning = true;

    if (this.triggerEl == null || this.portalEl == null) {
      this.isRepositioning = false;
      return;
    }

    const triggerRect = this.triggerEl.getBoundingClientRect();
    const popoverRect = this.portalEl.getBoundingClientRect();

    // Safety check: ensure trigger has valid dimensions (is rendered and visible)
    if (triggerRect.width === 0 || triggerRect.height === 0) {
      this.isRepositioning = false;
      return;
    }

    let top = 0;
    let left = 0;
    const offset = 8;

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

    this.portalEl.style.top = `${top}px`;
    this.portalEl.style.left = `${left}px`;

    // Reset the repositioning guard after a short delay
    setTimeout(() => {
      this.isRepositioning = false;
    }, 16); // ~1 frame at 60fps
  }

  render() {
    return (
      <Host id={this.componentId}>
        <span class="pds-popover__trigger-wrapper">
          <slot name="trigger" onSlotchange={this.handleTriggerSlotChange}></slot>
        </span>

        <div class="pds-popover__content-slot-wrapper">
          <slot onSlotchange={this.handleContentSlotChange}></slot>
        </div>
      </Host>
    );
  }
}
