import { Component, Element, Event, EventEmitter, Host, h, Method, Prop, State, Watch } from '@stencil/core';
import { autoUpdate, computePosition, flip, offset, platform, shift } from '@floating-ui/dom';
import { closest, containsComposed } from '@utils/closest';
import { restoreReflectedDefault } from '@utils/reflected-attribute-default';
import { PlacementType, PopoverPaddingType } from '@utils/types';
import { setAttributesIfChanged } from '@utils/attributes';
import { cssEscape } from '@utils/css';
import { limitRestores } from '@utils/keep-hydrated';
import { PdsPopoverEventDetail } from './popover-interface';

/** Open popovers that close on Escape, in the order they opened: Escape goes to the last one it applies to. */
const popoversTakingEscape: PdsPopover[] = [];

/** Hovering the trigger waits this long before opening, so a pointer passing over it doesn't open it. */
const HOVER_OPEN_DELAY_MS = 120;
/** Leaving the trigger and panel waits this long before closing, which covers the gap between them. */
const HOVER_CLOSE_DELAY_MS = 200;

/**
 * floating-ui reporting viewport coordinates, as `position: fixed` uses without a containing block. Its own
 * containing-block check misses a backdrop filter in WebKit, so handlePopoverPositioning corrects for one itself.
 */
const viewportPlatform = { ...platform, getOffsetParent: () => window };

/** The focused element, followed down through shadow roots to the control that has focus. */
function deepActiveElement(): Element | null {
  let active = document.activeElement;
  while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement;
  return active;
}

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
   * Portal element: in document.body, or in the open dialog the popover is in
   */
  private portalEl: HTMLElement | null = null;

  /**
   * Stops floating-ui's autoUpdate, which repositions the open panel as its trigger or the page moves or resizes
   */
  private stopAutoUpdate: (() => void) | null = null;

  /**
   * Counts positioning runs, so a run that resolves after a newer one started is dropped
   */
  private positioningRun = 0;

  /**
   * The latest positioning run, which pdsPopoverOpen waits for so the panel's side is set when it fires
   */
  private positioning: Promise<void> = Promise.resolve();

  /**
   * Set while show() waits to emit pdsPopoverOpen, so a hide() in the meantime emits it first
   */
  private openEventPending = false;

  /**
   * Track moved nodes and their placeholders for restoration
   */
  private movedNodes: Array<{ node: Node; placeholder: Comment }> = [];

  /**
   * Timestamp when popover was opened (for preventing immediate close)
   */
  private openTimestamp = 0;

  /**
   * Set while hover holds the popover open, until a click pins it or it closes
   */
  private hoverOpened = false;
  private hoverOpenTimer?: ReturnType<typeof setTimeout>;
  private hoverCloseTimer?: ReturnType<typeof setTimeout>;

  /**
   * Set when the pointer left while focus was in the panel, so focus leaving it closes it instead
   */
  private closeWhenFocusLeaves = false;

  /**
   * How far the pointer was from the panel at its last move after leaving the trigger
   */
  private panelDistance = Infinity;

  /**
   * Instance counter for unique IDs
   */
  private static instanceCounter = 0;

  /**
   * Bound handlers for cleanup
   */
  private boundClickOutsideHandler: (event: MouseEvent) => void;
  private boundEscapeKeyHandler: (event: KeyboardEvent) => void;

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
   * Determines how the popover opens. With `hover`, it also opens when the pointer rests on the trigger and closes
   * when the pointer leaves, until a click on the trigger keeps it open. Enter or Space on the trigger opens it either way.
   * @defaultValue "click"
   */
  @Prop() openOn?: 'click' | 'hover' = 'click';

  @Watch('openOn')
  protected openOnChanged() {
    this.pin();
    this.stopListeningForHover(this.triggerEl);
    this.stopListeningForHover(this.portalEl);
    // Out of the page, connectedCallback binds them when it comes back.
    if (!this.isComponentMounted) return;
    this.listenForHover(this.triggerEl);
    this.listenForHover(this.portalEl);
  }

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
   * Sets the padding of the popover content
   * @defaultValue "md"
   */
  @Prop() padding?: PopoverPaddingType = 'md';

  @Watch('padding')
  applyPadding() {
    if (this.portalEl != null) this.portalEl.style.padding = this.paddingToken();
  }

  private paddingToken() {
    switch (this.padding) {
      case 'none':
        return 'var(--pine-dimension-none)';
      case 'xs':
        return 'var(--pine-dimension-xs)';
      case 'sm':
        return 'var(--pine-dimension-sm)';
      default:
        return 'var(--pine-dimension-md)';
    }
  }

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
      this.stopListeningForHover(this.triggerEl);
    }

    if (assignedElements.length > 0) {
      // Use the first assigned element as the trigger
      this.triggerEl = assignedElements[0] as HTMLElement;

      this.linkTriggerToPortal();

      // Attach click listener to handle popover visibility
      this.triggerEl.addEventListener('click', this.handleTriggerClick);
      this.listenForHover(this.triggerEl);
    } else {
      this.triggerEl = null;
    }

    // autoUpdate watches the trigger it started with, so an open popover starts it again on the new one.
    if (this.active) this.addScrollAndResizeListeners();

    this.observeTrigger();
  };

  // The trigger is the consumer's element, so anything can rewrite its attributes (a Turbo morph
  // matches it to server HTML that has no ARIA). Put Pine's values back when that happens.
  private observeTrigger() {
    this.triggerObserver?.disconnect();
    this.triggerObserver = null;
    if (this.triggerEl == null || typeof MutationObserver === 'undefined') return;

    // Capped against a script that keeps undoing it; opening and closing still write it directly.
    this.triggerObserver = new MutationObserver(
      limitRestores(
        () => this.linkTriggerToPortal(),
        'pds-popover: stopped restoring its trigger ARIA, as another script keeps changing it. It may be wrong until the popover opens or closes.',
        this.triggerEl,
      ),
    );
    this.triggerObserver.observe(this.triggerEl, {
      attributes: true,
      attributeFilter: ['aria-expanded', 'aria-controls'],
    });
  }

  // Set ARIA attributes to establish relationship between trigger and popover
  // This mirrors the native Popover API's accessibility behavior
  private linkTriggerToPortal() {
    if (this.triggerEl == null || this.portalEl == null) return false;

    // Skips values already in place, so the trigger observer's own callback doesn't loop.
    return setAttributesIfChanged(this.triggerEl, { 'aria-expanded': String(this.active), 'aria-controls': this.portalEl.id });
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

    if (this.openOn === 'hover' && this.popoverTargetAction !== 'hide') {
      const heldByHover = this.hoverOpened;
      this.pin();
      // Pinning, not toggling: the hover before a click has already opened it.
      if (heldByHover) return;
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

  private listenForHover(el: HTMLElement | null) {
    if (this.openOn !== 'hover' || el == null) return;
    el.addEventListener('pointerenter', this.handleHoverEnter);
    el.addEventListener('pointerleave', this.handleHoverLeave);
    el.addEventListener('focusout', this.handleHoverFocusOut);
  }

  private stopListeningForHover(el: HTMLElement | null) {
    if (el == null) return;
    el.removeEventListener('pointerenter', this.handleHoverEnter);
    el.removeEventListener('pointerleave', this.handleHoverLeave);
    el.removeEventListener('focusout', this.handleHoverFocusOut);
  }

  // A tap sends touch pointer events and then a click, so touch takes the click path alone.
  private handleHoverEnter = (event: PointerEvent) => {
    if (event.pointerType === 'touch') return;
    this.clearHoverTimers();
    if (this.active) return;
    this.hoverOpenTimer = setTimeout(() => {
      this.hoverOpenTimer = undefined;
      if (this.active || this.portalEl == null) return;
      this.hoverOpened = true;
      this.show();
    }, HOVER_OPEN_DELAY_MS);
  };

  private handleHoverLeave = (event: PointerEvent) => {
    if (event.pointerType === 'touch') return;
    this.clearHoverTimers();
    if (!this.hoverOpened) return;
    this.hoverCloseTimer = setTimeout(this.closeFromHover, HOVER_CLOSE_DELAY_MS);
    if (event.currentTarget !== this.triggerEl) return;
    this.panelDistance = this.distanceToPanel(event);
    document.addEventListener('pointermove', this.handleMoveTowardPanel);
  };

  // A slow diagonal from the trigger to a panel shorter than it runs beside the panel for longer
  // than the close delay, so each move that brings the pointer closer starts the delay again.
  private handleMoveTowardPanel = (event: PointerEvent) => {
    const distance = this.distanceToPanel(event);
    if (distance < this.panelDistance) {
      clearTimeout(this.hoverCloseTimer);
      this.hoverCloseTimer = setTimeout(this.closeFromHover, HOVER_CLOSE_DELAY_MS);
    }
    this.panelDistance = distance;
  };

  private distanceToPanel({ clientX, clientY }: PointerEvent) {
    const panel = this.portalEl!.getBoundingClientRect();
    return Math.hypot(Math.max(panel.left - clientX, 0, clientX - panel.right), Math.max(panel.top - clientY, 0, clientY - panel.bottom));
  }

  private handleHoverFocusOut = (event: FocusEvent) => {
    if (!this.closeWhenFocusLeaves || containsComposed(this.portalEl, event.relatedTarget as Node | null)) return;
    this.closeWhenFocusLeaves = false;
    this.hoverCloseTimer = setTimeout(this.closeFromHover, HOVER_CLOSE_DELAY_MS);
  };

  private closeFromHover = () => {
    this.clearHoverTimers();
    if (!this.hoverOpened) return;
    // Content shown on hover stays while focus is in it (WCAG 1.4.13).
    if (containsComposed(this.portalEl, deepActiveElement())) {
      this.closeWhenFocusLeaves = true;
      return;
    }
    this.hide();
  };

  /**
   * Keeps a popover that hover opened open, closing from then on as one opened by a click does. A
   * manual one gives up Escape again, which it took only while hover held it.
   */
  private pin() {
    this.clearHoverTimers();
    if (!this.hoverOpened) return;
    this.hoverOpened = false;
    if (this.popoverType === 'auto') return;
    this.forgetOpen();
    this.portalEl?.removeAttribute('data-pds-popover-open');
    document.removeEventListener('keydown', this.boundEscapeKeyHandler);
  }

  private clearHoverTimers() {
    clearTimeout(this.hoverOpenTimer);
    clearTimeout(this.hoverCloseTimer);
    this.hoverOpenTimer = undefined;
    this.hoverCloseTimer = undefined;
    this.closeWhenFocusLeaves = false;
    document.removeEventListener('pointermove', this.handleMoveTowardPanel);
  }

  // componentDidLoad doesn't run again when a popover comes back, so rebuild whatever
  // disconnectedCallback tore down. Each step is a no-op when nothing was.
  connectedCallback() {
    if (!this.hasLoaded) return;

    this.isComponentMounted = true;
    this.createPortal();
    this.triggerEl?.addEventListener('click', this.handleTriggerClick);
    this.listenForHover(this.triggerEl);
    this.observeTrigger();
    this.linkTriggerToPortal();

    // Still open after a move: the trigger moved, so the portal follows it, into the dialog it
    // is in now, if any.
    if (this.active) {
      this.placePortal();
      // autoUpdate listens to the scroll containers around where the trigger was, so it starts again.
      this.addScrollAndResizeListeners();
    }
  }

  disconnectedCallback() {
    // Moved in one operation (a DOM morph, or a framework reparenting it), the popover is
    // already back in the page. Its portal is outside the popover, so it stays open, with focus
    // where it was; connectedCallback moves it to follow the popover.
    if (this.el.isConnected) return;

    this.isComponentMounted = false;
    this.unwatchDialogClose();
    this.forgetOpen();

    // Open, the content sits in the portal; put it back before the portal goes. Only listeners on
    // the popover itself hear the close event now, but those are the ones mirroring its state.
    if (this.active) {
      this.restorePortalContent();
      this.active = false;
      this.linkTriggerToPortal();
      this.emitOpenEvent();
      this.pdsPopoverClose.emit({
        componentId: this.componentId,
        popoverType: this.popoverType,
      });
    }

    // Clean up trigger click event listener
    if (this.triggerEl != null) {
      this.triggerEl.removeEventListener('click', this.handleTriggerClick);
    }
    this.stopListeningForHover(this.triggerEl);

    this.triggerObserver?.disconnect();
    this.triggerObserver = null;

    // Clean up all event listeners
    this.removeLightDismissListeners();
    this.removeScrollAndResizeListeners();
    document.removeEventListener('submit', this.handleSubmitFromPanel, true);

    this.clearHoverTimers();
    this.hoverOpened = false;

    // Remove portal from DOM
    this.removePortal();
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
    this.portalEl.style.padding = this.paddingToken();

    // Generate unique ID
    if (!this.componentId) {
      this.generatedPortalId ??= `pds-popover-portal-${PdsPopover.instanceCounter++}`;
      this.portalEl.id = this.generatedPortalId;
    } else {
      this.portalEl.id = `${this.componentId}-portal`;
    }

    // Append to body
    document.body.appendChild(this.portalEl);

    // Add global focus styles to match Pine design system
    // This is done after appending to ensure it's part of the document and can access CSS variables
    this.addPortalFocusStyles();
    this.listenForHover(this.portalEl);
  }

  /**
   * Adds Pine design system focus styles and dark mode border to the portal element
   * Uses CSS variables from Pine's design tokens
   */
  private addPortalFocusStyles() {
    if (!this.portalEl) return;

    const portalId = this.portalEl.id;
    // componentId comes from the consumer, so it can carry characters cssEscape needs to
    // neutralize before the id is used as a selector or interpolated into stylesheet text.
    const escapedPortalId = cssEscape(portalId);

    // Check if style element already exists
    const existingStyle = document.querySelector(`style[data-pds-popover-focus="${escapedPortalId}"]`);
    if (existingStyle) return;

    // Create style element with Pine's focus ring styles and dark mode border
    const styleEl = document.createElement('style');
    styleEl.setAttribute('data-pds-popover-focus', portalId);
    styleEl.textContent = `
      #${escapedPortalId}:focus {
        outline: var(--pine-outline-focus, 2px solid var(--pine-color-focus-ring, #6366f1)) !important;
        outline-offset: var(--pine-border-width, 1px);
      }
      #${escapedPortalId}:focus:not(:focus-visible) {
        outline: none;
      }
      [data-theme="dark"] #${escapedPortalId} {
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

  /** The focus style copied into a shadow root the panel opened in, which `document.head` can't reach. */
  private shadowFocusStyle: HTMLStyleElement | null = null;

  private copyFocusStylesInto(root: Node) {
    // Outside a shadow root the document's own style applies, so drop a copy left in one.
    if (!(root instanceof ShadowRoot)) {
      this.shadowFocusStyle?.remove();
      this.shadowFocusStyle = null;
      return;
    }
    if (this.shadowFocusStyle?.parentNode === root || !this.portalEl) return;
    const source = document.querySelector(`style[data-pds-popover-focus="${cssEscape(this.portalEl.id)}"]`);
    if (!source) return;
    this.shadowFocusStyle?.remove();
    this.shadowFocusStyle = source.cloneNode(true) as HTMLStyleElement;
    root.appendChild(this.shadowFocusStyle);
  }

  private removePortal() {
    this.shadowFocusStyle?.remove();
    this.shadowFocusStyle = null;
    if (this.portalEl) {
      // Remove the portal element from DOM
      if (this.portalEl.parentNode) {
        this.portalEl.parentNode.removeChild(this.portalEl);
      }

      // Remove the associated focus style element
      const portalId = this.portalEl.id;
      const styleEl = document.querySelector(`style[data-pds-popover-focus="${cssEscape(portalId)}"]`);
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

    this.placePortal();

    // Update portal content with latest slot content
    this.updatePortalContent();

    // Show portal. The attribute tells a modal around it that this popover takes Escape first; only
    // an auto popover, or one hover opened, listens for Escape.
    if (this.popoverType === 'auto' || this.hoverOpened) this.portalEl.setAttribute('data-pds-popover-open', '');
    this.portalEl.style.display = 'block';
    this.portalEl.style.opacity = '1';
    this.portalEl.style.visibility = 'visible';

    // Position the popover now, and again whenever its trigger or the page moves or resizes
    this.addScrollAndResizeListeners();
    document.addEventListener('submit', this.handleSubmitFromPanel, true);

    // Add document listeners for light dismiss and escape key (auto type only), or for the escape
    // key alone while hover holds a manual popover open
    if (this.popoverType === 'auto') {
      popoversTakingEscape.push(this);
      this.addLightDismissListeners();
    } else if (this.hoverOpened) {
      popoversTakingEscape.push(this);
      document.addEventListener('keydown', this.boundEscapeKeyHandler);
    }

    // Emit open event once the panel is positioned, with the side it took already on it. A reconnect, a
    // trigger swap or another show() can start a newer run meanwhile, which drops this one, so wait for the latest.
    this.openEventPending = true;
    let positioning: Promise<void>;
    do {
      positioning = this.positioning;
      await positioning;
    } while (positioning !== this.positioning);
    this.emitOpenEvent();
  }

  private emitOpenEvent() {
    if (!this.openEventPending) return;
    this.openEventPending = false;
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
    this.clearHoverTimers();
    if (!this.active || !this.portalEl) return;

    this.active = false;
    this.hoverOpened = false;
    this.unwatchDialogClose();

    // Restoring the content drops its focus to the body, so check where focus is first. In a
    // shadow root, document.activeElement is only its host.
    const focusWasInside = containsComposed(this.portalEl, deepActiveElement());

    this.linkTriggerToPortal();

    // Restore content back to original slot positions
    this.restorePortalContent();

    // Hide portal. The dark-mode border set in a shadow root is worked out again on the next open.
    this.portalEl.style.border = '';
    this.portalEl.removeAttribute('data-pds-popover-open');
    this.portalEl.removeAttribute('data-pds-popover-placement');
    this.portalEl.style.display = 'none';
    this.portalEl.style.opacity = '0';
    this.portalEl.style.visibility = 'hidden';

    // Return focus to trigger for keyboard accessibility
    // This mirrors native Popover API behavior on close
    if (focusWasInside) {
      this.returnFocusToTrigger();
    }

    // Remove all listeners
    this.forgetOpen();
    this.removeLightDismissListeners();
    this.removeScrollAndResizeListeners();
    document.removeEventListener('submit', this.handleSubmitFromPanel, true);

    // Closed before its first position resolved, it still announces the open before the close.
    this.emitOpenEvent();

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
   * Puts the panel where it shows above everything around the popover. In an open dialog, it goes
   * inside it: a modal dialog sits in the top layer above the body and makes the rest of the page
   * inert, and a non-modal one sits above it by z-index. Right after the popover, it's next in the
   * Tab order. In another component's slot, though, it would have no slot to render in, and in a
   * form its buttons would submit it, so there it goes at the end of the dialog.
   */
  private placePortal() {
    if (!this.portalEl) return;
    const dialog = closest('dialog[open]', this.el) as HTMLDialogElement | null;
    if (!dialog) {
      this.unwatchDialogClose();
      this.portalEl.style.border = '';
      if (this.portalEl.parentElement !== document.body) document.body.appendChild(this.portalEl);
      this.copyFocusStylesInto(document);
      return;
    }
    const form = closest('form', this.el) as Element | null;
    const besidePopover = !this.el.parentElement?.shadowRoot && !(form && containsComposed(dialog, form));
    if (besidePopover) {
      if (this.el.nextElementSibling !== this.portalEl) this.el.parentNode?.insertBefore(this.portalEl, this.el.nextSibling);
    } else if (this.portalEl.parentNode !== dialog) {
      dialog.appendChild(this.portalEl);
    }
    this.watchDialogClose(dialog);
    const root = this.portalEl.getRootNode();
    this.copyFocusStylesInto(root);
    // In a shadow root, the copied dark-mode rule can't see a [data-theme="dark"] on the page.
    this.portalEl.style.border = root instanceof ShadowRoot && closest('[data-theme="dark"]', this.el) ? 'var(--pine-border)' : '';
  }

  private forgetOpen() {
    const index = popoversTakingEscape.indexOf(this);
    if (index >= 0) popoversTakingEscape.splice(index, 1);
  }

  /**
   * Whether an Escape is this popover's. One from a dialog the popover isn't in belongs to that
   * dialog when it's above it: a top-layer dialog or a pds-modal. A plain non-modal dialog inside
   * the popover's modal doesn't close on Escape, so the popover takes it.
   */
  private takesEscapeFrom(event: KeyboardEvent) {
    const origin = (event.composedPath?.()[0] ?? event.target) as Element;
    const dialog = closest('dialog[open]', origin) as HTMLDialogElement | null;
    if (!dialog || containsComposed(dialog, this.portalEl)) return true;
    return !(dialog.classList.contains('pds-modal__backdrop') || dialog.matches(':modal'));
  }

  /**
   * Adds light dismiss listeners (click outside and escape key)
   */
  private addLightDismissListeners() {
    // Add listeners immediately - handleClickOutside will check timestamp
    document.addEventListener('click', this.boundClickOutsideHandler, true);
    document.addEventListener('keydown', this.boundEscapeKeyHandler);
  }

  /** The dialog the panel was opened in, closed along with it. */
  private watchedDialog: HTMLDialogElement | null = null;

  private onDialogClose = () => {
    this.hide();
  };

  /** Closes the popover when the dialog it opened in closes, so it isn't left open inside. */
  private watchDialogClose(dialog: HTMLDialogElement) {
    if (this.watchedDialog === dialog) return;
    this.unwatchDialogClose();
    this.watchedDialog = dialog;
    dialog.addEventListener('close', this.onDialogClose);
  }

  private unwatchDialogClose() {
    this.watchedDialog?.removeEventListener('close', this.onDialogClose);
    this.watchedDialog = null;
  }

  /**
   * Removes light dismiss listeners
   */
  private removeLightDismissListeners() {
    document.removeEventListener('click', this.boundClickOutsideHandler, true);
    document.removeEventListener('keydown', this.boundEscapeKeyHandler);
  }

  /**
   * Inside a dialog, the panel can sit in a form that wraps the dialog, which a body portal never
   * did. A submit from the panel (a button in it, or Enter in a field in it) is stopped, so the
   * panel behaves as it does in the body.
   */
  private handleSubmitFromPanel = (event: SubmitEvent) => {
    if (!this.portalEl || !containsComposed(event.target as Node, this.portalEl)) return;
    if (containsComposed(this.portalEl, event.submitter) || containsComposed(this.portalEl, deepActiveElement())) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  /**
   * Adds scroll and resize listeners for repositioning
   */
  private addScrollAndResizeListeners() {
    this.removeScrollAndResizeListeners();
    if (this.triggerEl == null || this.portalEl == null) return;
    this.stopAutoUpdate = autoUpdate(this.triggerEl, this.portalEl, () => {
      this.positioning = this.handlePopoverPositioning().catch(error => console.warn('pds-popover: failed to position the panel', error));
    });
  }

  /**
   * Removes scroll and resize listeners
   */
  private removeScrollAndResizeListeners() {
    this.stopAutoUpdate?.();
    this.stopAutoUpdate = null;
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

    // In a shadow root, event.target is only its host.
    const target = (event.composedPath?.()[0] ?? event.target) as Node;

    // A datepicker's calendar is portaled to the body: a click in the calendar of a datepicker
    // inside this popover, in its content or its trigger, isn't outside it. The target can be
    // inside the calendar's shadow root, so look up across it.
    const calendar = closest('.pds-datepicker-calendar-portal', target as Element) as
      | (Element & { pdsDatepicker?: Element })
      | null;
    const owner = calendar?.pdsDatepicker;
    if (owner && (containsComposed(this.portalEl, owner) || containsComposed(this.triggerEl, owner))) return;

    // Check if click is outside both the popover portal and the trigger
    const clickedInsidePopover = containsComposed(this.portalEl, target);
    const clickedInsideTrigger = containsComposed(this.triggerEl, target);

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
    // A control inside that closes on Escape (a datepicker, a combobox) has handled it already.
    if (event.key !== 'Escape' || event.defaultPrevented) return;
    // Like the native Popover API, Escape closes only the top popover: the last one opened that
    // it applies to. Every open popover hears it, so each checks whether it's that one.
    const top = [...popoversTakingEscape].reverse().find(popover => popover.takesEscapeFrom(event));
    if (top !== this) return;

    // Take the key, so the dialog or modal around it doesn't close too.
    event.preventDefault();
    event.stopPropagation();

    // Close popover and return focus to trigger
    this.hide();
  }

  /**
   * Positions the popover relative to its trigger element, flipping to the opposite side when only that side has
   * room and shifting to stay 8px inside the viewport. The side it takes goes on the panel's `data-pds-popover-placement`.
   */
  private async handlePopoverPositioning() {
    // Counted before the guards, so a run still in flight is dropped even when this one can't position.
    const run = ++this.positioningRun;
    if (this.triggerEl == null || this.portalEl == null) return;

    // Safety check: ensure trigger has valid dimensions (is rendered and visible)
    const triggerRect = this.triggerEl.getBoundingClientRect();
    if (triggerRect.width === 0 || triggerRect.height === 0) return;

    const portal = this.portalEl;
    const { x: left, y: top, placement } = await computePosition(this.triggerEl, portal, {
      placement: this.placement,
      strategy: 'fixed',
      // With no room on either side, stay on the preferred side: the side that overflows less can still push
      // a tall panel's start above the viewport.
      middleware: [offset(8), flip({ fallbackStrategy: 'initialPlacement' }), shift({ padding: 8 })],
      platform: viewportPlatform,
    });
    if (!this.active || run !== this.positioningRun || portal !== this.portalEl) return;

    portal.setAttribute('data-pds-popover-placement', placement);
    portal.style.top = `${top}px`;
    portal.style.left = `${left}px`;

    // `position: fixed` measures from the viewport unless an ancestor becomes its containing block,
    // as a modal dialog does with its backdrop filter. Shift by however far it landed from the spot.
    const placed = portal.getBoundingClientRect();
    if (Math.abs(placed.top - top) > 0.5 || Math.abs(placed.left - left) > 0.5) {
      portal.style.top = `${2 * top - placed.top}px`;
      portal.style.left = `${2 * left - placed.left}px`;
    }
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
