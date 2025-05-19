import { Component, Element, Event, EventEmitter, h, Method, Prop, Watch } from '@stencil/core';

@Component({
  tag: 'pds-modal',
  styleUrl: 'pds-modal.scss',
})
export class PdsModal {
  private modalRef: HTMLElement;

  @Element() el: HTMLPdsModalElement;

  /**
   * Whether the modal can be closed by clicking the backdrop
   * @default true
   */
  @Prop() closeOnBackdropClick = true;

  /**
   * Whether the modal can be closed by pressing the escape key
   * @default true
   */
  @Prop() closeOnEsc = true;

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

  /**
   * Whether the modal content is scrollable
   * @default false
   */
  @Prop() scrollable = false;

  /**
   * Emitted when the modal is opened
   */
  @Event() pdsModalOpen: EventEmitter<void>;

  /**
   * Emitted when the modal is closed
   */
  @Event() pdsModalClose: EventEmitter<void>;

  componentDidLoad() {
    this.modalRef = this.el.querySelector('.pds-modal__backdrop');
    if (this.modalRef) {
      this.modalRef.setAttribute('popover', 'manual');
      // Ensure modal is hidden by default
      this.modalRef.hidePopover();
    }

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
   * Opens the modal
   */
  @Method()
  async showModal() {
    if (this.modalRef) {
      try {
        this.modalRef.showPopover();
        this.open = true;
        this.pdsModalOpen.emit();
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
        this.modalRef.hidePopover();
        this.open = false;
        this.pdsModalClose.emit();
      } catch (error) {
        console.error('Failed to hide modal:', error);
      }
    }
  }

  private handleBackdropClick = (e: MouseEvent) => {
    if (!this.closeOnBackdropClick || !this.open) return;

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
    if (!this.closeOnEsc || e.key !== 'Escape' || !this.open) return;

    // Only close if this is the innermost modal
    if (this.isInnermostModal()) {
      this.hideModal();
    }
  };

  render() {
    return (
      <div
        class={{
          'pds-modal__backdrop': true,
          'open': this.open
        }}
        onClick={this.handleBackdropClick}
      >
        <div
          class={`pds-modal pds-modal--${this.size} ${this.scrollable ? 'pds-modal--scrollable' : ''}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby={`${this.componentId}-heading`}
        >
          <header class="pds-modal__header">
            <slot name="header"></slot>
          </header>
          <div class="pds-modal__content">
            <slot></slot>
          </div>
          <footer class="pds-modal__footer">
            <slot name="footer"></slot>
          </footer>
        </div>
      </div>
    );
  }
}
