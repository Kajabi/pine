import { Component, h, Host, Prop, Element, State } from '@stencil/core';

declare global {
  interface HTMLPdsModalContentElement extends HTMLElement {
    border: 'none' | 'both';
  }
}

@Component({
  tag: 'pds-modal-content',
  styleUrl: 'pds-modal-content.scss',
})
export class PdsModalContent {

  @Element() el: HTMLPdsModalContentElement;

  /**
   * The border style for the content area. When not explicitly set, automatically determined based on scroll state.
   * @default 'none'
   */
  @Prop({ reflect: true }) border: 'none' | 'both' | 'top' | 'bottom' = 'none';

  @State() contentMaxHeight: string = 'none';

  /**
   * Tracks whether the border prop was explicitly set by the user
   */
  private userSetBorder = false;

  componentWillLoad() {
    // Check if border was explicitly set via attribute or property
    const borderAttr = this.el.getAttribute('border');
    const hasBorderAttribute = borderAttr !== null;

    // If border attribute exists or border prop is not the default, user set it
    this.userSetBorder = hasBorderAttribute || this.border !== 'none';
  }

  componentDidLoad() {
    this.calculateMaxHeight();

    // Set up resize listener
    window.addEventListener('resize', this.handleResize.bind(this));

    // Only set up scroll listener for border updates if borders are managed automatically
    if (!this.userSetBorder) {
      setTimeout(() => {
        const contentElement = this.el.querySelector('.pds-modal-content') as HTMLElement;
        if (contentElement) {
          contentElement.addEventListener('scroll', this.updateBorders.bind(this));
        }
      }, 100);
    }
  }

  disconnectedCallback() {
    window.removeEventListener('resize', this.handleResize.bind(this));

    // Clean up scroll listener only if it was set up
    if (!this.userSetBorder) {
      const contentElement = this.el.querySelector('.pds-modal-content') as HTMLElement;
      if (contentElement) {
        contentElement.removeEventListener('scroll', this.updateBorders.bind(this));
      }
    }

    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
    }
  }

  /**
   * Handle resize events
   */
  private handleResize() {
    this.calculateMaxHeight();
    // Update borders after resize as content scrollability might change
    setTimeout(() => this.updateBorders(), 50);
  }

  /**
   * Calculates the max-height based on header and footer heights
   */
  private mutationObserver: MutationObserver;

  /**
   * Updates border visibility based on scroll state (only if not user-defined)
   */
  private updateBorders() {
    // If user explicitly set a border value, don't override it
    if (this.userSetBorder) {
      return;
    }

    // Find the modal element (parent of this component)
    const modalElement = this.el.closest('pds-modal');
    if (!modalElement) return;

    // Only apply border logic if modal is scrollable
    const isModalScrollable = modalElement.scrollable !== false;
    if (!isModalScrollable) {
      this.border = 'none';
      return;
    }

    // Get the content element
    const contentElement = this.el.querySelector('.pds-modal-content') as HTMLElement;
    if (!contentElement) return;

    // Check if content is actually scrollable
    const isContentScrollable = contentElement.scrollHeight > contentElement.clientHeight;

    if (!isContentScrollable) {
      this.border = 'none';
      return;
    }

    // Determine border position based on scroll position
    const { scrollTop, scrollHeight, clientHeight } = contentElement;
    const isAtTop = scrollTop === 0;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1; // Allow for small rounding errors

    if (isAtTop && isAtBottom) {
      // Content fits exactly, no borders needed
      this.border = 'none';
    } else if (isAtTop) {
      // At top, show bottom border only
      this.border = 'bottom';
    } else if (isAtBottom) {
      // At bottom, show top border only
      this.border = 'top';
    } else {
      // In middle, show both borders
      this.border = 'both';
    }
  }

  /**
   * Calculates the max-height based on header and footer heights
   */
  private calculateMaxHeight() {
    // Find the modal element (parent of this component)
    const modalElement = this.el.closest('pds-modal');
    if (!modalElement) return;

    // Check if the parent modal is scrollable
    const isScrollable = modalElement.scrollable !== false;

    setTimeout(() => {
      // If modal is not scrollable, don't apply max-height constraints
      if (!isScrollable) {
        this.contentMaxHeight = 'none';
        const contentElement = this.el.querySelector('.pds-modal-content') as HTMLElement;
        if (contentElement) {
          contentElement.style.maxHeight = 'none';
        }
        return;
      }

      // Find header and footer elements
      const headerElement = modalElement.querySelector('pds-modal-header');
      const footerElement = modalElement.querySelector('pds-modal-footer');

      // Get header and footer heights
      const headerHeight = headerElement ? headerElement.offsetHeight : 0;
      const footerHeight = footerElement ? footerElement.offsetHeight : 0;

      // Set the max-height as a calculation
      if (headerHeight > 0 || footerHeight > 0) {
        // Calculate the available height by subtracting:
        // 1. Header and footer heights
        // 2. Modal padding (48px)
        // 3. Additional space for modal positioning (6vh)
        // 4. Extra adjustment for perfect fit (50px)
        const viewportAdjustment = Math.round(window.innerHeight * 0.06); // 6vh approximation
        const totalReduction = headerHeight + footerHeight + 48 + viewportAdjustment + 50;

        // Set the content max height
        this.contentMaxHeight = `calc(100vh - ${totalReduction}px)`;

        // Apply the style directly to ensure it takes effect
        const contentElement = this.el.querySelector('.pds-modal-content') as HTMLElement;
        if (contentElement) {
          contentElement.style.maxHeight = this.contentMaxHeight;
        }
      } else {
        this.contentMaxHeight = 'none'; // Default fallback
      }

      // Update borders after height calculations
      setTimeout(() => this.updateBorders(), 50);
    }, 100); // Delay to ensure DOM is fully rendered

    // Set up mutation observer if not already done
    if (!this.mutationObserver && modalElement) {
      this.mutationObserver = new MutationObserver(() => {
        this.calculateMaxHeight();
      });

      // Observe changes to the modal's children
      this.mutationObserver.observe(modalElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class']
      });
    }
  }
  render() {
    // Only apply max-height style if it's not 'none'
    const styleObj = this.contentMaxHeight !== 'none' ? { maxHeight: this.contentMaxHeight } : {};

    return (
      <Host>
        <div
          class={{
            'pds-modal-content': true,
            [`pds-modal-content--border-${this.border}`]: true
          }}
          style={styleObj}
          tabindex="-1"
        >
          <slot></slot>
        </div>
      </Host>
    );
  }
}