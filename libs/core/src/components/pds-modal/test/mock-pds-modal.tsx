import { Component, Prop, Event, EventEmitter, Method, Element, h } from '@stencil/core';

// Define the element interface for the mock component
interface HTMLMockPdsModalElement extends HTMLElement {
  open: boolean;
  showModal: () => Promise<void>;
  hideModal: () => Promise<void>;
  handleBackdropClick: (event: MouseEvent) => void;
  handleKeyDown: (event: KeyboardEvent) => void;
}

/**
 * Mock PdsModal component for testing purposes
 * This component mimics the real PdsModal but without using the Popover API
 */
@Component({
  tag: 'mock-pds-modal',
  styleUrl: '../pds-modal.scss',
  shadow: false,
})
export class MockPdsModal {
  @Element() el!: HTMLMockPdsModalElement;

  /**
   * The ID of the modal component
   */
  @Prop() componentId?: string;

  /**
   * The size of the modal
   */
  @Prop() size: 'sm' | 'md' | 'lg' | 'fullscreen' = 'md';

  /**
   * Whether the modal content is scrollable
   */
  @Prop() scrollable = false;

  /**
   * Whether the modal should close when clicking on the backdrop
   */
  @Prop() closeOnBackdropClick = true;

  // Native dialog element always closes on Escape key press, so no closeOnEsc property is needed

  /**
   * Whether the modal is open
   */
  @Prop({ mutable: true }) open = false;

  // No need for modalRef in the mock implementation

  /**
   * Event emitted when the modal is opened
   */
  @Event() pdsModalOpen: EventEmitter;

  /**
   * Event emitted when the modal is closed
   */
  @Event() pdsModalClose: EventEmitter;

  /**
   * Event emitted when the backdrop is clicked
   */
  @Event() pdsModalBackdropClick: EventEmitter;

  /**
   * Shows the modal
   */
  @Method()
  async showModal() {
    this.open = true;
    this.pdsModalOpen.emit();
  }

  /**
   * Hides the modal
   */
  @Method()
  async hideModal() {
    this.open = false;
    this.pdsModalClose.emit();
  }

  /**
   * Listen for click events on the backdrop
   */
  // Using direct method instead of @Listen to avoid ESLint warning
  handleBackdropClick(event: MouseEvent) {
    const backdrop = this.el.querySelector('.pds-modal__backdrop');
    // Check if the click was directly on the backdrop (not on a child element)
    if (event.target === backdrop && this.closeOnBackdropClick === true) {
      this.pdsModalBackdropClick.emit();
      this.hideModal();
    }
  }

  /**
   * Listen for keydown events to handle Escape key
   * Native dialog element always closes on Escape key press
   */
  // Using direct method instead of @Listen to avoid ESLint warning
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape' && this.open === true) {
      this.hideModal();
    }
  }

  componentDidLoad() {
    // No need to do anything in componentDidLoad for the mock
  }

  render() {
    const modalClasses = {
      'pds-modal': true,
      [`pds-modal--${this.size}`]: true,
      'pds-modal--scrollable': this.scrollable,
    };

    const backdropClasses = {
      'pds-modal__backdrop': true,
      'open': this.open,
    };

    return (
      <div class={backdropClasses}>
        <div
          class={modalClasses}
          role="dialog"
          aria-modal="true"
          aria-labelledby={this.componentId ? `${this.componentId}-heading` : null}
        >
          <div class="pds-modal__header">
            <slot name="header"></slot>
          </div>
          <div class="pds-modal-content">
            <slot></slot>
          </div>
          <div class="pds-modal__footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    );
  }
}
