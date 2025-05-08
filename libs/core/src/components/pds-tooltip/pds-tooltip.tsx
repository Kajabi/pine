import { Component, Element, Host, Prop, State, h, Method, Watch } from '@stencil/core';
import { positionTooltip } from '../../utils/overlay';

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
  private triggerEl: HTMLElement | null = null;
  private contentDiv: HTMLElement | null = null;
  private slotMutationObserver: MutationObserver | null = null;
  private overlayResizeObserver: ResizeObserver | null = null;

  /**
   * Reference to the Host element
   */
  @Element() el: HTMLPdsTooltipElement;

  /**
   * Determines when the tooltip is open
   * @defaultValue false
   */
  @State() isOpen = false;

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
  @Prop() hasArrow? = true;

  /**
   * Enable this option when using the content slot
   * @defaultValue false
   */
  @Prop() htmlContent = false;

  /**
   * Determines the preferred position of the tooltip
   * @defaultValue "right"
   */
  @Prop({ reflect: true }) placement:
    'top'
    | 'top-start'
    | 'top-end'
    | 'right'
    | 'right-start'
    | 'right-end'
    | 'bottom'
    | 'bottom-start'
    | 'bottom-end'
    | 'left'
    | 'left-start'
    | 'left-end' = 'right';

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
  }

  componentDidLoad() {
    window.addEventListener('pageshow', this.handlePageShow);
    this.triggerEl = this.el.querySelector('.pds-tooltip__trigger') as HTMLElement;
    const contentSlotWrapper = this.el.querySelector('.pds-tooltip__content-slot-wrapper');
    if (contentSlotWrapper) {
      this.slotMutationObserver = new MutationObserver(() => {
        if (this.opened && this.portalEl) {
          this.removePortal();
          this.createPortal();
        }
      });
      this.slotMutationObserver.observe(contentSlotWrapper, { childList: true, subtree: false });
    }
    return () => {
      window.removeEventListener('pageshow', this.handlePageShow);
      if (this.slotMutationObserver) {
        this.slotMutationObserver.disconnect();
      }
    };
  }

  componentDidRender() {
    if (this.opened && !this.portalEl) {
      this.createPortal();
    } else if (!this.opened && this.portalEl) {
      this.removePortal();
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
        this.repositionPortal();
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

  /**
   * Determines the most accurate HTML element to use as the anchor for positioning the tooltip.
   * If `htmlContent` is false, it attempts to find the actual element slotted as the trigger.
   * Otherwise, or if no specific element is found, it defaults to the span wrapper around the trigger slot.
   * This helps with precise alignment.
   */
  private determinePositioningAnchor(): HTMLElement | null {
    let positioningAnchor: HTMLElement | null = this.triggerEl; // Default to the span wrapper

    // Always try to find a more specific anchor within this.triggerEl (the span wrapper for the default slot)
    // if this.triggerEl itself exists. This helps with precise alignment for any type of trigger element.
    // The htmlContent prop determines the tooltip's overlay content, not the nature of the trigger.
    if (this.triggerEl) {
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
   * Centralized method to calculate and apply the tooltip's position.
   * Uses the determined anchor element and the current content dimensions.
   */
  private repositionPortal() {
    const anchor = this.determinePositioningAnchor();

    if (anchor && this.contentDiv) {
      positionTooltip({ elem: anchor, elemPlacement: this.placement, overlay: this.contentDiv });
      const placementParts = this.placement.split('-');
      const primaryPlacement = placementParts[0];
      const isCardinalCenterPlacement = placementParts.length === 1;
      if (isCardinalCenterPlacement) {
        const anchorRect = anchor.getBoundingClientRect();
        const overlayRect = this.contentDiv.getBoundingClientRect();
        if (primaryPlacement === 'left' || primaryPlacement === 'right') {
          const currentOverlayTop = parseFloat(this.contentDiv.style.top || '0');
          const anchorCenterY = anchorRect.top + (anchorRect.height / 2);
          const overlayCenterY = overlayRect.top + (overlayRect.height / 2);
          const adjustmentY = anchorCenterY - overlayCenterY;
          if (Math.abs(adjustmentY) > 0.5) {
            this.contentDiv.style.top = `${currentOverlayTop + adjustmentY}px`;
          }
        } else if (primaryPlacement === 'top' || primaryPlacement === 'bottom') {
          const currentOverlayLeft = parseFloat(this.contentDiv.style.left || '0');
          const anchorCenterX = anchorRect.left + (anchorRect.width / 2);
          const overlayCenterX = overlayRect.left + (overlayRect.width / 2);
          const adjustmentX = anchorCenterX - overlayCenterX;
          if (Math.abs(adjustmentX) > 0.5) {
            this.contentDiv.style.left = `${currentOverlayLeft + adjustmentX}px`;
          }
        }
      }
    }
  }

  private createPortal() {
    if (this.portalEl) return;
    this.portalEl = document.createElement('div');
    this.portalEl.className = `pds-tooltip pds-tooltip--${this.placement} ${this.htmlContent ? 'pds-tooltip--has-html-content' : ''} ${this.opened ? 'pds-tooltip--is-open' : ''} ${this.hasArrow ? '' : 'pds-tooltip--no-arrow'}`;
    this.portalEl.style.position = 'fixed';
    this.portalEl.style.zIndex = '9999';
    if (!this.portalEl.id) {
      this.portalEl.id = this.componentId || this.el.id || `pds-tooltip-portal-${PdsTooltip.instanceCounter++}`;
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
    this.contentDiv.setAttribute('role', 'tooltip');
    this.contentDiv.style.maxWidth = this.maxWidth;

    const contentSlotWrapper = this.el.querySelector('.pds-tooltip__content-slot-wrapper');
    const slottedContentContainer = contentSlotWrapper?.querySelector('[slot="content"]') as HTMLElement | null;
    let hasSlottedContent = false;
    if (slottedContentContainer) {
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
      } else {
      }
    } else {
    }

    if (!hasSlottedContent) {
      if (this.content) {
        this.contentDiv.textContent = this.content;
      }
    }

    this.portalEl.appendChild(this.contentDiv);
    document.body.appendChild(this.portalEl);

    this.repositionPortal();

    if (this.contentDiv) {
      this.overlayResizeObserver = new ResizeObserver(() => {
        this.repositionPortal();
      });
      this.overlayResizeObserver.observe(this.contentDiv);
    }

    // Add global listeners when portal is created
    window.addEventListener('scroll', this.handleScroll, true);
    window.addEventListener('popstate', this.handleSpaNavigation, true);
    window.addEventListener('hashchange', this.handleSpaNavigation, true);

    // Add ARIA attribute to trigger, now that portalEl and its ID are confirmed
    if (this.triggerEl && this.portalEl.id) {
      this.triggerEl.setAttribute('aria-describedby', this.portalEl.id);
    }
  }

  private removePortal() {
    if (this.overlayResizeObserver && this.contentDiv) {
      this.overlayResizeObserver.unobserve(this.contentDiv);
      this.overlayResizeObserver = null;
    }

    if (this.portalEl) {
      window.removeEventListener('scroll', this.handleScroll, true);
      window.removeEventListener('popstate', this.handleSpaNavigation, true);
      window.removeEventListener('hashchange', this.handleSpaNavigation, true);
      document.body.removeChild(this.portalEl);
      this.portalEl = null;
    }

    // Remove ARIA attribute from trigger
    if (this.triggerEl) {
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
          onFocus={this.handleShow}
          onBlur={this.handleHide}
          ref={el => this.triggerEl = el}
        >
          <slot />
        </span>
        <div class="pds-tooltip__content-slot-wrapper" style={{ display: 'none' }}>
          <slot name="content"></slot>
        </div>
      </Host>
    );
  }
}
