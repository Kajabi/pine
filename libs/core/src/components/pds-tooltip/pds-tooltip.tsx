import { Component, Element, Host, Prop, State, h, Method, Watch } from '@stencil/core';
import { PlacementType } from '@utils/types';
import {
  computePosition,
  flip,
  offset,
  shift,
} from '@floating-ui/dom';

/**
 * @slot (default) - The tooltip's target element
 * @slot content - HTML content for the tooltip
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
  private overlayResizeObserver: ResizeObserver | null = null;
  private currentPathname: string = '';
  private pathnameCheckInterval: ReturnType<typeof setInterval> | null = null;

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
    const contentSlotWrapper = this.el.querySelector('.pds-tooltip__content-slot-wrapper');

    if (contentSlotWrapper !== null) {
      this.slotMutationObserver = new MutationObserver(() => {
        if (this.opened && this.portalEl !== null) {
          this.removePortal();
          this.createPortal();
        }
      });
      this.slotMutationObserver.observe(contentSlotWrapper, { childList: true, subtree: false });
    }

    // no return; Stencil ignores teardown functions here
  }

  disconnectedCallback() {
    window.removeEventListener('pageshow', this.handlePageShow);
    if (this.slotMutationObserver !== null) {
      this.slotMutationObserver.disconnect();
      this.slotMutationObserver = null;
    }
    // Ensure global listeners/intervals are removed if still present
    if (this.portalEl !== null) {
      this.removePortal();
    }
    if (this.pathnameCheckInterval !== null) {
      clearInterval(this.pathnameCheckInterval);
      this.pathnameCheckInterval = null;
    }
  }

  componentDidRender() {
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

  private handleScroll = () => {
    if (this.opened) {
      if (!this._isInteractiveOpen) {
        this.repositionPortal().catch(error => {
          console.warn('Failed to reposition tooltip on scroll:', error);
        });
      } else {
        this.hideTooltip();
        this._isInteractiveOpen = false;
      }
    }
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
    this.portalEl.style.zIndex = '9999';

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

    const contentSlotWrapper = this.el.querySelector('.pds-tooltip__content-slot-wrapper');
    const slottedContentContainer = contentSlotWrapper?.querySelector('[slot="content"]') as HTMLElement | null;
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
              this.contentDiv.appendChild(node.cloneNode(true));
            }
          });
        }
      }
    }

    if (!hasSlottedContent && typeof this.content === 'string' && this.content.trim() !== '') {
      this.contentDiv.textContent = this.content;
    }

    this.portalEl.appendChild(this.contentDiv);
    document.body.appendChild(this.portalEl);

    this.repositionPortal().catch(error => {
      console.warn('Failed to position tooltip on creation:', error);
    });

    if (this.portalEl !== null) {
      this.overlayResizeObserver = new ResizeObserver(() => {
        this.repositionPortal().catch(error => {
          console.warn('Failed to reposition tooltip on resize:', error);
        });
      });
      this.overlayResizeObserver.observe(this.portalEl);
    }

    // Add global listeners when portal is created
    window.addEventListener('scroll', this.handleScroll, true);
    window.addEventListener('popstate', this.handleSpaNavigation, true);
    window.addEventListener('hashchange', this.handleSpaNavigation, true);

    // Start pathname change detection
    this.pathnameCheckInterval = setInterval(this.checkPathnameChange, 100);

    // Add ARIA attribute to trigger, now that portalEl and its ID are confirmed
    if (this.triggerEl !== null && this.portalEl.id !== '') {
      this.triggerEl.setAttribute('aria-describedby', this.portalEl.id);
    }
  }

  private removePortal() {
    if (this.overlayResizeObserver !== null && this.portalEl !== null) {
      this.overlayResizeObserver.unobserve(this.portalEl);
      this.overlayResizeObserver = null;
    }

    // Stop pathname change detection
    if (this.pathnameCheckInterval !== null) {
      clearInterval(this.pathnameCheckInterval);
      this.pathnameCheckInterval = null;
    }

    if (this.portalEl !== null) {
      window.removeEventListener('scroll', this.handleScroll, true);
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
