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
   * The border style for the content area. Automatically set based on available space of the modal content.
   * @default 'none'
   */
  @Prop({ reflect: true }) border: 'none' | 'both' | 'top' | 'bottom' = 'none';

  @State() contentMaxHeight: string = 'none';

  componentDidLoad() {
    // Check if parent modal is scrollable first
    const modalElement = this.el.closest('pds-modal');
    const isModalScrollable = modalElement ? modalElement.scrollable !== false : true;

    // Only check content scrollability if modal is scrollable
    if (isModalScrollable) {
      const slotContent = this.el.firstElementChild as HTMLElement;
      const isScrollable = slotContent?.scrollHeight > slotContent?.clientHeight;
      this.border = isScrollable ? 'both' : 'none';
      this.calculateMaxHeight();
    } else {
      this.border = 'none';
    }

    window.addEventListener('resize', this.calculateMaxHeight.bind(this));
  }

  disconnectedCallback() {
    window.removeEventListener('resize', this.calculateMaxHeight.bind(this));

    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
    }
  }

  /**
   * Calculates the max-height based on header and footer heights
   */
  private mutationObserver: MutationObserver;

  /**
   * Calculates the max-height based on header and footer heights
   */
  private calculateMaxHeight() {
    console.log('calculateMaxHeight');
    console.log('this.el', this.el);

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
    console.log('styleObj', styleObj);
    console.log('this.contentMaxHeight', this.contentMaxHeight);

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