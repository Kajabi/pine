import { Component, Element, Event, EventEmitter, h, Method, Prop, Watch } from '@stencil/core';

@Component({
  tag: 'pds-modal',
  styleUrl: 'pds-modal.scss',
})
export class PdsModal {
  private modalRef: HTMLElement;

  @Element() el: HTMLPdsModalElement;

  /**
   * A unique identifier used for the underlying component `id` attribute.
   */
  @Prop() componentId: string;

  /**
   * The title of the modal
   */
  @Prop() heading: string;

  /**
   * Whether the modal is open
   */
  @Prop({ mutable: true }) open = false;

  /**
   * Whether the modal can be closed by pressing the escape key
   */
  @Prop() closeOnEsc = true;

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
    if ((e.target as HTMLElement).classList.contains('pds-modal__backdrop')) {
      e.stopPropagation();
      this.hideModal();
    }
  };

  private handleKeyDown = (e: KeyboardEvent) => {
    if (!this.closeOnEsc || e.key !== 'Escape' || !this.open) return;

    // Find all open modals
    const openModals = Array.from(document.querySelectorAll('pds-modal')).filter(
      modal => modal.open
    );

    if (openModals.length === 0) return;

    // Get this modal's backdrop element
    const thisBackdrop = this.el.querySelector('.pds-modal__backdrop');
    if (!thisBackdrop) return;

    // Get computed z-index of all open modal backdrops
    const modalZIndexes = openModals.map(modal => {
      const backdrop = modal.querySelector('.pds-modal__backdrop');
      return backdrop ? parseInt(getComputedStyle(backdrop).zIndex, 10) : -1;
    });

    // Get the highest z-index
    const maxZIndex = Math.max(...modalZIndexes);

    // Only close if this modal's backdrop has the highest z-index
    const thisZIndex = parseInt(getComputedStyle(thisBackdrop).zIndex, 10);
    if (thisZIndex === maxZIndex) {
      this.hideModal();
    }
  };

  render() {
    return (
      <div
        class="pds-modal__backdrop"
        onClick={this.handleBackdropClick}
      >
        <div class="pds-modal" role="dialog" aria-modal="true" aria-labelledby={`${this.componentId}-heading`}>
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
