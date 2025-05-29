import { Component, Element, Event, EventEmitter, h, Method, Prop, State, Watch } from '@stencil/core';

@Component({
  tag: 'pds-modal',
  styleUrl: 'pds-modal.scss',
  shadow: false
})
export class PdsModal {
  private modalRef: HTMLDialogElement;
  private previousActiveElement: HTMLElement;
  private focusableElements: HTMLElement[] = [];

  @Element() el: HTMLPdsModalElement;

  /**
   * Whether the modal can be dismissed by clicking the backdrop
   * @default true
   */
  @Prop() backdropDismiss = true;

  /**
   * A unique identifier used for the underlying component `id` attribute.
   */
  @Prop() componentId: string;

  /**
   * Whether the modal is open
   * @default false
   */
  @Prop({ mutable: true }) open = false;

  /**
   * The size of the modal
   * @default 'md'
   */
  @Prop() size: 'sm' | 'md' | 'lg' | 'fullscreen' = 'md';

  // Modal content is always scrollable by default

  /**
   * Emitted when the modal is opened
   */
  @Event() pdsModalOpen: EventEmitter<void>;

  /**
   * Emitted when the modal is closed
   */
  @Event() pdsModalClose: EventEmitter<void>;

  /**
   * Stores the list of focusable elements in the modal
   */
  @State() focusableElementsArray: HTMLElement[] = [];

  componentDidLoad() {
    this.modalRef = this.el.querySelector('.pds-modal__backdrop') as HTMLDialogElement;
    // Add keyboard event listener
    document.addEventListener('keydown', this.handleKeyDown);
  }

  disconnectedCallback() {
    // Clean up event listener
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  @Watch('open')
  handleOpenChange(newValue: boolean) {
    if (newValue) {
      this.showModal();
    } else {
      this.hideModal();
    }
  }

  /**
   * Updates the list of focusable elements in the modal
   */
  private updateFocusableElements() {
    if (!this.modalRef) return;

    // Get all focusable elements within the modal
    const selector = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      'pds-button:not([disabled])',
      'pds-link:not([disabled])',
      'pds-input:not([disabled])',
      'pds-checkbox:not([disabled])',
      'pds-radio:not([disabled])',
      'pds-switch:not([disabled])',
      'pds-select:not([disabled])',
    ].join(',');

    this.focusableElements = Array.from(
      this.modalRef.querySelectorAll(selector)
    ) as HTMLElement[];

    // Filter out elements with display: none or visibility: hidden
    this.focusableElements = this.focusableElements.filter(el => {
      const style = window.getComputedStyle(el);
      return style.display !== 'none' && style.visibility !== 'hidden';
    });
  }

  /**
   * Sets focus to the first focusable element in the modal
   */
  private setInitialFocus() {
    if (this.focusableElements.length === 0) return;

    // Focus the first focusable element
    const firstElement = this.focusableElements[0];

    // For web components, we need to ensure they're properly focused
    this.focusElement(firstElement);
  }

  /**
   * Helper method to focus an element, with special handling for web components
   */
  private focusElement(element: HTMLElement) {
    if (!element) return;

    try {
      // Try standard focus first
      element.focus();

      // Check if focus worked
      setTimeout(() => {
        if (document.activeElement !== element) {
          // For web components, try to find a focusable element inside
          if (element.shadowRoot) {
            const focusableInShadow = element.shadowRoot.querySelector(
              'button, [tabindex], input, a[href]'
            ) as HTMLElement;

            if (focusableInShadow) {
              focusableInShadow.focus();
            }
          }
        }
      }, 0);
    } catch (error) {
      console.error('Error focusing element:', error);
    }
  }

  /**
   * Opens the modal
   */
  @Method()
  async showModal() {
    if (this.modalRef) {
      try {
        // Store the currently focused element to restore focus when modal closes
        this.previousActiveElement = document.activeElement as HTMLElement;

        // Use native dialog showModal method which makes the rest of the page inert
        this.modalRef.showModal();
        this.open = true;

        // Update focusable elements and set initial focus
        // Using a longer timeout to ensure all components are fully rendered
        setTimeout(() => {
          this.updateFocusableElements();
          this.setInitialFocus();
          this.pdsModalOpen.emit();
        }, 100);
      } catch (error) {
        console.error('Failed to show modal:', error);
      }
    }
  }

  /**
   * Closes the modal
   */
  @Method()
  async hideModal() {
    if (this.modalRef) {
      try {
        this.modalRef.close();
        this.open = false;

        // Restore focus to the element that was focused before the modal was opened
        if (this.previousActiveElement && typeof this.previousActiveElement.focus === 'function') {
          this.previousActiveElement.focus();
        }

        this.pdsModalClose.emit();
      } catch (error) {
        console.error('Failed to hide modal:', error);
      }
    }
  }

  private handleBackdropClick = (e: MouseEvent) => {
    if (!this.backdropDismiss || !this.open) return;

    if ((e.target as HTMLElement).classList.contains('pds-modal__backdrop')) {
      e.stopPropagation();

      // Only close if this is the innermost modal
      if (this.isInnermostModal()) {
        this.hideModal();
      }
    }
  };

  /**
   * Gets the z-index of a modal's backdrop element
   */
  private getBackdropZIndex(modal: Element): number {
    const backdrop = modal.querySelector('.pds-modal__backdrop');
    return backdrop ? parseInt(getComputedStyle(backdrop).zIndex, 10) : -1;
  }

  /**
   * Checks if this modal is the innermost (highest z-index) modal
   */
  private isInnermostModal(): boolean {
    // Find all open modals
    const openModals = Array.from(document.querySelectorAll('pds-modal')).filter(
      modal => modal.open
    );

    if (openModals.length === 0) return false;

    // Get this modal's backdrop element
    const thisBackdrop = this.el.querySelector('.pds-modal__backdrop');
    if (!thisBackdrop) return false;

    // Get computed z-index of all open modal backdrops
    const modalZIndexes = openModals.map(modal => this.getBackdropZIndex(modal));

    // Get the highest z-index
    const maxZIndex = Math.max(...modalZIndexes);

    // Check if this modal's backdrop has the highest z-index
    const thisZIndex = this.getBackdropZIndex(this.el);
    return thisZIndex === maxZIndex;
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    // If the modal is not open, don't handle any keyboard events
    if (!this.open) return;

    // Handle Escape key to close the modal
    if (e.key === 'Escape') {
      // Only close if this is the innermost modal
      if (this.isInnermostModal()) {
        e.preventDefault();
        this.hideModal();
      }
      return;
    }

    // Handle Tab key for focus trapping
    if (e.key === 'Tab') {
      // If there are no focusable elements, do nothing
      if (this.focusableElements.length === 0) return;

      // Get the first and last focusable elements
      const firstFocusableElement = this.focusableElements[0];
      const lastFocusableElement = this.focusableElements[this.focusableElements.length - 1];

      // Get the current active element
      const activeElement = document.activeElement;

      // Check if we need to wrap focus
      const isFirstElement = activeElement === firstFocusableElement ||
                            firstFocusableElement.contains(activeElement as Node);

      const isLastElement = activeElement === lastFocusableElement ||
                           lastFocusableElement.contains(activeElement as Node);

      // If shift + tab is pressed and focus is on the first element, move to the last element
      if (e.shiftKey && isFirstElement) {
        e.preventDefault();
        this.focusElement(lastFocusableElement);
      }
      // If tab is pressed and focus is on the last element, move to the first element
      else if (!e.shiftKey && isLastElement) {
        e.preventDefault();
        this.focusElement(firstFocusableElement);
      }
    }
  };

  render() {
    return (
      <dialog
        class={{
          'pds-modal__backdrop': true,
          'open': this.open
        }}
        aria-modal="true"
        aria-labelledby={`${this.componentId}-heading`}
        onClick={this.handleBackdropClick}
      >
        <div
          class={`pds-modal pds-modal--${this.size} pds-modal--scrollable`}
        >
          <slot></slot>
        </div>
      </dialog>
    );
  }
}
