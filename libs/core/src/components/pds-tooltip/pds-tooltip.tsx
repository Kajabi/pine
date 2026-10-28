import { Component, Element, Host, Prop, State, h, Method, Watch } from '@stencil/core';
import { PlacementType } from '@utils/types';
import {
  autoUpdate,
  computePosition,
  flip,
  offset,
  shift,
} from '@floating-ui/dom';

const withoutHydrated = (classes: string | null) =>
  (classes ?? '').split(/\s+/).filter(name => name !== '' && name !== 'hydrated').sort().join(' ');

// A class change that only adds or removes Stencil's `hydrated` marker.
const isHydrationOnly = (mutation: MutationRecord) =>
  mutation.type === 'attributes' &&
  mutation.attributeName === 'class' &&
  withoutHydrated(mutation.oldValue) === withoutHydrated((mutation.target as Element).getAttribute('class'));

/**
 * @slot (default) - The tooltip's target element
 * @slot content - HTML content for the tooltip
 * @lightDom renders-markup
 */

@Component({
  tag: 'pds-tooltip',
  styleUrls: ['pds-tooltip.scss'],
  shadow: false,
})

export class PdsTooltip {
  private static instanceCounter = 0;

  /**
   * Internal state: true if the tooltip was opened by user interaction (hover/focus),
   * false if opened via the `opened` prop or currently closed.
   */
  @State() private _isInteractiveOpen = false;

  private portalEl: HTMLElement | null = null;
  private resolvedPlacement: PlacementType = 'right';
  private triggerEl: HTMLElement | null = null;
  private contentDiv: HTMLElement | null = null;
  private slotMutationObserver: MutationObserver | null = null;
  private contentSyncFrame: number | null = null;
  private currentPathname: string = '';
  private pathnameCheckInterval: ReturnType<typeof setInterval> | null = null;
  private stopAutoUpdate: (() => void) | null = null;

  /**
   * Reference to the Host element
   */
  @Element() el: HTMLPdsTooltipElement;

  /**
   * Content for the tooltip. If HTML is required, use the content slot
   */
  @Prop() content: string;

  /**
   * A unique identifier used for the underlying component `id` attribute.
   */
  @Prop() componentId: string;

  /**
   * Determines whether or not the tooltip has an arrow
   * @defaultValue true
   */
  @Prop() hasArrow = true;

  /**
   * Enable this option when using the content slot
   * @defaultValue false
   */
  @Prop() htmlContent = false;

  /**
   * Determines the preferred position of the tooltip
   * @defaultValue "right"
   */
  @Prop({ reflect: true }) placement: PlacementType = 'right';

  /**
   * Sets the maximum width of the tooltip content
   * @defaultValue "352px"
   */
  @Prop() maxWidth: string = '352px';

  /**
   * Determines whether or not the tooltip is visible
   * @defaultValue false
   */
  @Prop({mutable: true, reflect: true}) opened = false;

  @Watch('opened')

  handleOpenToggle(newValue: boolean, oldValue: boolean) {
    if (newValue === false && oldValue === true) {
      this._isInteractiveOpen = false;
    }
  }

  componentWillLoad() {
    this._isInteractiveOpen = false;
    this.resolvedPlacement = this.placement;
  }

  componentDidLoad() {
    window.addEventListener('pageshow', this.handlePageShow);
    this.currentPathname = window.location.pathname;
    this.triggerEl = this.el.querySelector('.pds-tooltip__trigger') as HTMLElement;

    // no return; Stencil ignores teardown functions here
  }

  // connectedCallback fires on every reconnect (unlike componentWillLoad/componentDidLoad,
  // which are one-time), so resetting this here re-arms exactly one reconnect-cleanup pass
  // per connect instead of re-scanning on every render for the component's whole lifetime.
  private hasCheckedReconnect = false;

  connectedCallback() {
    this.hasCheckedReconnect = false;
  }

  disconnectedCallback() {
    window.removeEventListener('pageshow', this.handlePageShow);
    // Ensure global listeners/intervals are removed if still present
    if (this.portalEl !== null) {
      this.removePortal();
    }
    if (this.pathnameCheckInterval !== null) {
      clearInterval(this.pathnameCheckInterval);
      this.pathnameCheckInterval = null;
    }
    // Ensure autoUpdate is stopped if still present
    if (this.stopAutoUpdate !== null) {
      this.stopAutoUpdate();
      this.stopAutoUpdate = null;
    }
  }

  // Unwraps stale nested trigger/content-slot-wrapper siblings left by a page-cache (Turbo, bfcache) reconnect, rerouting content-slot content back to the real content wrapper. Drains both wrappers (not just trigger) so content rerouted into contentWrapper is itself re-checked for further nesting.
  private unwrapReconnectedSlots() {
    // Direct children only — querySelector would find a stale nested wrapper first.
    const trigger = Array.from(this.el.children).find((child) => child.matches('.pds-tooltip__trigger'));
    const contentWrapper = Array.from(this.el.children).find((child) =>
      child.matches('.pds-tooltip__content-slot-wrapper')
    );
    if (trigger === undefined || contentWrapper === undefined) return;

    const staleSelector = '.pds-tooltip__trigger, .pds-tooltip__content-slot-wrapper';
    const findStaleIn = (root: Element) => Array.from(root.children).find((child) => child.matches(staleSelector));

    [trigger, contentWrapper].forEach((root) => {
      let stale = findStaleIn(root);
      while (stale !== undefined) {
        const destination = stale.matches('.pds-tooltip__content-slot-wrapper') ? contentWrapper : trigger;
        Array.from(stale.childNodes).forEach((node) =>
          destination === root ? root.insertBefore(node, stale) : destination.appendChild(node)
        );
        stale.remove();
        stale = findStaleIn(root);
      }
    });
  }

  componentDidRender() {
    if (!this.hasCheckedReconnect) {
      this.unwrapReconnectedSlots();
      this.hasCheckedReconnect = true;
    }

    if (this.opened && this.portalEl === null) {
      this.createPortal();
    } else if (!this.opened && this.portalEl !== null) {
      this.removePortal();
    }

    // Update portal class when opened state changes
    if (this.portalEl !== null) {
      this.portalEl.className = `pds-tooltip pds-tooltip--${this.resolvedPlacement} ${this.htmlContent ? 'pds-tooltip--has-html-content' : ''} ${this.opened ? 'pds-tooltip--is-open' : ''} ${this.hasArrow ? '' : 'pds-tooltip--no-arrow'}`;

      // Update ARIA attributes to stay in sync with visual open state
      this.portalEl.setAttribute('aria-hidden', this.opened ? 'false' : 'true');
      this.portalEl.setAttribute('aria-live', this.opened ? 'polite' : 'off');
    }
  }

  /**
   * Shows the tooltip by enabling the opened property
   */
  @Method()
  async showTooltip() {
    this.opened = true;
  }

  /**
   * Hides the tooltip by disabling the opened property
   */
  @Method()
  async hideTooltip() {
    this.opened = false;
  }

  private handleHide = () => {
    if (this.opened && !this._isInteractiveOpen) {
      return;
    }

    this.hideTooltip();
    this._isInteractiveOpen = false;
  };

  private handleShow = () => {
    if (this.opened && !this._isInteractiveOpen) {
      return;
    }

    this._isInteractiveOpen = true;
    this.showTooltip();
  };

  private handlePageShow = () => {
    if (this.opened && !this._isInteractiveOpen) {
      return;
    }

    this.opened = false;
    this._isInteractiveOpen = false;
  };


  private handleSpaNavigation = () => {
    if (this.opened && !this._isInteractiveOpen) {
      return;
    }

    this.hideTooltip();
    this._isInteractiveOpen = false;
  };

  private checkPathnameChange = () => {
    if (window.location.pathname !== this.currentPathname) {
      this.currentPathname = window.location.pathname;
      this.handleSpaNavigation();
    }
  };

  /**
   * Determines the most accurate HTML element to use as the anchor for positioning the tooltip.
   * If `htmlContent` is false, it attempts to find the actual element slotted as the trigger.
   * Otherwise, or if no specific element is found, it defaults to the span wrapper around the trigger slot.
   * This helps with precise alignment.
   */
  private determinePositioningAnchor(): HTMLElement | null {
    let positioningAnchor: HTMLElement | null = this.triggerEl;

    if (this.triggerEl !== null) {
      const children = this.triggerEl.childNodes;

      for (let i = 0; i < children.length; i++) {
        const childNode = children[i];

        if (childNode.nodeType === Node.ELEMENT_NODE) {
          positioningAnchor = childNode as HTMLElement;
          break; // Found the first element, use it as the anchor
        }
      }
    }

    // If no ELEMENT_NODE is found within this.triggerEl (e.g., if trigger is just text),
    // positioningAnchor will correctly remain this.triggerEl (the span).
    return positioningAnchor;
  }

  /**
   * Centralized method to calculate and apply the tooltip's position using floating UI.
   * Uses the determined anchor element and applies computePosition with flip, offset, and shift.
   */
  private async repositionPortal() {
    const anchor = this.determinePositioningAnchor();

    if (anchor !== null && this.portalEl !== null) {
      try {
        const { x, y, placement: computedPlacement } = await computePosition(anchor, this.portalEl, {
          placement: this.placement,
          strategy: 'fixed',
          middleware: [offset(8), flip(), shift({ padding: 5 })],
        });

        this.resolvedPlacement = computedPlacement as PlacementType;

        Object.assign(this.portalEl.style, {
          left: `${x}px`,
          top: `${y}px`,
          position: 'fixed',
        });

        // Update CSS classes to match the resolved placement
        this.portalEl.className = `pds-tooltip pds-tooltip--${this.resolvedPlacement} ${this.htmlContent ? 'pds-tooltip--has-html-content' : ''} ${this.opened ? 'pds-tooltip--is-open' : ''} ${this.hasArrow ? '' : 'pds-tooltip--no-arrow'}`;
      } catch (error) {
        console.warn('Failed to position tooltip:', error);
        this.resolvedPlacement = this.placement; // Fallback to requested placement
        // Fallback to basic positioning if floating UI fails
        const anchorRect = anchor.getBoundingClientRect();
        this.portalEl.style.left = `${anchorRect.right + 8}px`;
        this.portalEl.style.top = `${anchorRect.top}px`;
        this.portalEl.style.position = 'fixed';
      }
    }
  }

  private createPortal() {
    if (this.portalEl !== null) return;

    this.portalEl = document.createElement('div');
    this.portalEl.className = `pds-tooltip pds-tooltip--${this.resolvedPlacement} ${this.htmlContent ? 'pds-tooltip--has-html-content' : ''} ${this.opened ? 'pds-tooltip--is-open' : ''} ${this.hasArrow ? '' : 'pds-tooltip--no-arrow'}`;
    this.portalEl.style.position = 'fixed';
    this.portalEl.style.zIndex = 'var(--pine-z-index-nuclear)';

    if (this.portalEl.id === '') {
      const suffix = PdsTooltip.instanceCounter++;
      const baseId = this.componentId || this.el.id || 'pds-tooltip';
      this.portalEl.id = `${baseId}-portal-${suffix}`;
    }

    if (this.portalEl.getAttribute('id') !== this.portalEl.id) {
      this.portalEl.setAttribute('id', this.portalEl.id);
    }

    this.portalEl.setAttribute('role', 'tooltip');
    this.portalEl.setAttribute('aria-hidden', this.opened ? 'false' : 'true');
    this.portalEl.setAttribute('aria-live', this.opened ? 'polite' : 'off');
    this.portalEl.style.maxWidth = this.maxWidth;

    this.contentDiv = document.createElement('div');
    this.contentDiv.className = 'pds-tooltip__content';
    this.contentDiv.setAttribute('aria-hidden', this.opened ? 'false' : 'true');
    this.contentDiv.setAttribute('aria-live', this.opened ? 'polite' : 'off');

    this.contentDiv.append(...Array.from(this.copySlottedContent().childNodes));

    this.portalEl.appendChild(this.contentDiv);
    document.body.appendChild(this.portalEl);

    this.repositionPortal().catch(error => {
      console.warn('Failed to position tooltip on creation:', error);
    });

    // Use Floating UI's autoUpdate to handle scroll/resize automatically
    if (this.triggerEl && this.portalEl) {
      this.stopAutoUpdate = autoUpdate(
        this.triggerEl,
        this.portalEl,
        () => {
          this.repositionPortal().catch(error => {
            console.warn('Failed to reposition tooltip on auto update:', error);
          });
        }
      );
    }

    // Keep only SPA navigation listeners (not handled by autoUpdate)
    window.addEventListener('popstate', this.handleSpaNavigation, true);
    window.addEventListener('hashchange', this.handleSpaNavigation, true);

    // Start pathname change detection
    this.pathnameCheckInterval = setInterval(this.checkPathnameChange, 100);

    // Add ARIA attribute to trigger, now that portalEl and its ID are confirmed
    if (this.triggerEl !== null && this.portalEl.id !== '') {
      this.triggerEl.setAttribute('aria-describedby', this.portalEl.id);
    }

    this.startContentSync();
  }

  /**
   * The host's own content slot wrapper. Matched among direct children only, so a nested
   * pds-tooltip inside the trigger slot isn't mistaken for this one's.
   */
  private get contentSlotWrapper(): Element | undefined {
    return Array.from(this.el.children).find((child) => child.matches('.pds-tooltip__content-slot-wrapper'));
  }

  /**
   * Copies the slotted content (or the `content` prop's text) into a detached container. The
   * portal holds copies so the framework that owns the slotted nodes keeps them.
   */
  private copySlottedContent(): HTMLElement {
    const copy = document.createElement('div');
    const slottedContentContainer = this.contentSlotWrapper?.querySelector('[slot="content"]') as HTMLElement | null;
    let hasSlottedContent = false;

    if (slottedContentContainer !== null) {
      const childrenToClone = Array.from(slottedContentContainer.childNodes);

      if (childrenToClone.length > 0) {
        const hasMeaningfulNode = childrenToClone.some(node =>
          node.nodeType === Node.ELEMENT_NODE ||
          (node.nodeType === Node.TEXT_NODE && node.textContent?.trim() !== '')
        );

        if (hasMeaningfulNode) {
          hasSlottedContent = true;
          childrenToClone.forEach((node /*, index*/) => {
            if (node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent?.trim() !== '')) {
              copy.appendChild(node.cloneNode(true));
            }
          });
        }
      }
    }

    if (!hasSlottedContent && typeof this.content === 'string' && this.content.trim() !== '') {
      copy.textContent = this.content;
    }

    return copy;
  }

  /**
   * While the tooltip is open, keeps the portal's copy in step with the slotted content at any
   * depth: content that loads or re-renders after opening (a Turbo Frame that finishes loading, a
   * framework re-render) shows without reopening. Changes are batched to one re-copy per animation
   * frame, and a re-copy that matches what the portal shows is dropped, so screen readers aren't
   * re-announced, iframes don't reload and the tooltip isn't repositioned for nothing. Only the
   * hidden slot wrapper is observed, so copying into the portal can't trigger another sync.
   */
  private startContentSync() {
    const contentSlotWrapper = this.contentSlotWrapper;
    if (contentSlotWrapper === undefined || typeof MutationObserver === 'undefined') return;

    this.slotMutationObserver = new MutationObserver(this.scheduleContentSync);
    this.slotMutationObserver.observe(contentSlotWrapper, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeOldValue: true,
      characterData: true,
    });
  }

  // Stencil marking a slotted component `hydrated` isn't a content change; skipping it here saves
  // building a throwaway copy on every component that hydrates.
  private scheduleContentSync = (mutations: MutationRecord[]) => {
    if (this.contentSyncFrame !== null || mutations.every(isHydrationOnly)) return;

    this.contentSyncFrame = requestAnimationFrame(() => {
      this.contentSyncFrame = null;
      if (this.portalEl === null || this.contentDiv === null) return;

      const copy = this.copySlottedContent();
      if (copy.innerHTML === this.contentDiv.innerHTML) return;

      this.contentDiv.textContent = '';
      this.contentDiv.append(...Array.from(copy.childNodes));
      this.repositionPortal().catch(error => {
        console.warn('Failed to reposition tooltip after a content change:', error);
      });
    });
  };

  private stopContentSync() {
    if (this.slotMutationObserver !== null) {
      this.slotMutationObserver.disconnect();
      this.slotMutationObserver = null;
    }
    if (this.contentSyncFrame !== null) {
      cancelAnimationFrame(this.contentSyncFrame);
      this.contentSyncFrame = null;
    }
  }

  private removePortal() {
    this.stopContentSync();

    // Stop Floating UI's autoUpdate
    if (this.stopAutoUpdate !== null) {
      this.stopAutoUpdate();
      this.stopAutoUpdate = null;
    }

    // Stop pathname change detection
    if (this.pathnameCheckInterval !== null) {
      clearInterval(this.pathnameCheckInterval);
      this.pathnameCheckInterval = null;
    }

    if (this.portalEl !== null) {
      // Remove only SPA navigation listeners (scroll/resize handled by autoUpdate)
      window.removeEventListener('popstate', this.handleSpaNavigation, true);
      window.removeEventListener('hashchange', this.handleSpaNavigation, true);

      // Safely remove portal from DOM
      try {
        if (this.portalEl.parentNode) {
          this.portalEl.parentNode.removeChild(this.portalEl);
        }
      } catch (error) {
        // Portal might have already been removed by test cleanup
        console.warn('Portal element could not be removed from DOM:', error);
      }

      this.portalEl = null;
    }

    // Remove ARIA attribute from trigger
    if (this.triggerEl !== null) {
      this.triggerEl.removeAttribute('aria-describedby');
    }
    this.contentDiv = null;
  }

  render() {
    const hostId = this.componentId || undefined;

    return (
      <Host id={hostId} class={{ 'pds-tooltip--is-open': this.opened }}>
        <span
          class="pds-tooltip__trigger"
          onMouseEnter={this.handleShow}
          onMouseLeave={this.handleHide}
          /* focusin/out bubble; ensure keyboard users see tooltips */
          onFocusin={this.handleShow as any}
          onFocusout={this.handleHide as any}
          ref={el => this.triggerEl = el}
        >
          <slot />
        </span>
        <div class="pds-tooltip__content-slot-wrapper" hidden>
          <slot name="content"></slot>
        </div>
      </Host>
    );
  }
}
