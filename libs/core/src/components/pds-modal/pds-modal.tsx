import { Component, Element, Event, EventEmitter, h, Method, Prop, State, Watch } from '@stencil/core';
import { unwrapReconnectedContent } from '@utils/reconnected-content';
import type { ModalSizeType } from '@utils/types';

const PRESET_SIZES: readonly ModalSizeType[] = ['sm', 'md', 'lg', 'fullscreen'];

const isCustomLength = (value: string): boolean =>
  /^[a-z0-9.%+\-*/(), ]+$/i.test(value) &&
  /\d/.test(value) &&
  (typeof CSS === 'undefined' || CSS.supports('max-width', value));

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
   * The size of the modal. Can be a predefined value ('sm', 'md', 'lg', 'fullscreen') or a custom
   * max-width as a CSS length (e.g., '1250px', '80vw'). A custom width stays fluid below that size.
   * A value that is neither falls back to 'md'.
   * @default 'md'
   */
  @Prop() size: ModalSizeType | (string & Record<never, never>) = 'md';

  /**
   * Whether the modal content should be scrollable
   * @default true
   */
  @Prop() scrollable = true;

  /**
   * Whether the modal opens outside the browser top layer as a non-modal dialog.
   * When `true` it opens with `dialog.show()` instead of `dialog.showModal()`, so
   * overlays rendered elsewhere in the DOM (file pickers, editor menus) can display
   * above it via `z-index`. The page is not made inert and focus is not trapped in
   * this mode. Read when the modal opens; changing it while the modal is open is
   * not supported.
   * @default false
   */
  @Prop() disableTopLayer = false;

  /**
   * Whether to skip moving focus into the modal when it opens — both our own
   * `setInitialFocus()` and the browser's native "dialog focusing steps",
   * which move focus into the dialog as soon as `show()`/`showModal()` is
   * called regardless of application code. Focus return on close is
   * unaffected either way. For a modal opened by something other than a
   * direct user click — a redirect, a deep link, a background event —
   * stealing focus on open can interrupt whatever the user was already
   * doing. Default `false` preserves today's behavior for every existing
   * consumer.
   * @default false
   */
  @Prop() disableInitialFocus = false;

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

  componentWillLoad() {
    this.warnOnInvalidSize();
  }

  @Watch('size')
  sizeChanged() {
    this.warnOnInvalidSize();
  }

  componentDidLoad() {
    this.modalRef = this.el.querySelector('.pds-modal__backdrop') as HTMLDialogElement;
    // Add keyboard event listener
    document.addEventListener('keydown', this.handleKeyDown);

    // @Watch('open') only fires on a later change, not the prop's initial
    // value — a modal mounted with `open` already true (static markup, or a
    // framework passing it on first render) would otherwise never call
    // show()/showModal(): the panel still appears, since that's driven by the
    // `open` CSS class, but the native <dialog> itself was never opened, so
    // there's no top-layer promotion, no dialog focusing steps, and no
    // focusable-elements list or previousActiveElement captured.
    if (this.open) {
      this.showModal();
    }
  }

  // Unwraps a nested dialog.pds-modal__backdrop left by a page-cache (Turbo, bfcache) reconnect.
  componentDidRender() {
    unwrapReconnectedContent(this.el.querySelector('.pds-modal'), 'dialog.pds-modal__backdrop', '.pds-modal');
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

    // checkVisibility() also drops an element inside a hidden ancestor, whose own computed
    // display isn't none; such an element can't take focus, so it can't anchor the trap.
    this.focusableElements = this.focusableElements.filter(el => {
      if (typeof el.checkVisibility === 'function') return el.checkVisibility({ checkVisibilityCSS: true });

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

        // showModal() promotes the dialog to the browser top layer (and makes the
        // rest of the page inert), which prevents any overlay outside the dialog
        // from ever painting above it. show() opens a non-modal dialog that stays
        // in the normal stacking context so those overlays can stack above it.
        if (this.disableTopLayer) {
          this.modalRef.show();
        } else {
          this.modalRef.showModal();
        }
        this.open = true;

        // Update focusable elements and set initial focus
        // Using a longer timeout to ensure all components are fully rendered
        setTimeout(() => {
          this.updateFocusableElements();
          if (this.disableInitialFocus) {
            // show()/showModal() also move focus into the dialog natively (the
            // HTML spec's "dialog focusing steps") — that native step isn't
            // necessarily done by the time this task runs either, so counter it
            // here, in the same deferred slot setInitialFocus() below uses for
            // the same reason, rather than racing it synchronously above.
            //
            // disableInitialFocus exists for a drawer that can open in the
            // background while the user is mid-task elsewhere — by the time
            // this runs, they may have already clicked into something of
            // their own outside the dialog. Only act if focus is still where
            // the native steps (or nothing) left it, so that isn't stolen.
            const activeElement = document.activeElement;
            const focusAlreadyClaimedElsewhere =
              activeElement !== null && activeElement !== document.body && !this.modalRef?.contains(activeElement);

            if (!focusAlreadyClaimedElsewhere) {
              if (this.previousActiveElement !== document.body && typeof this.previousActiveElement?.focus === 'function') {
                this.previousActiveElement.focus();
              } else if (activeElement instanceof HTMLElement) {
                // Nothing was focused before opening (previousActiveElement is
                // body), so there's nothing to restore focus to — body.focus()
                // would be a no-op and leave focus wherever the native focusing
                // steps put it, inside the dialog. Blur that instead so focus
                // ends up nowhere, matching the state before opening.
                activeElement.blur();
              }
            }
          } else {
            this.setInitialFocus();
          }
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
        // Capture before close(): with the async task queue, a prop change
        // that triggers hideModal() (e.g. light dismiss setting `open` false
        // on a pointerdown elsewhere) doesn't run until the next frame — by
        // then the browser has already moved focus to whatever the user's
        // click actually landed on. Restoring previousActiveElement in that
        // case would steal focus back from a real new destination; only
        // restore it when focus is still inside the modal (or nowhere, i.e.
        // document.body), meaning nothing else has claimed it since.
        const activeElement = document.activeElement;
        const focusAlreadyMovedElsewhere =
          activeElement !== null && activeElement !== document.body && !this.modalRef.contains(activeElement);

        this.modalRef.close();
        this.open = false;

        // Restore focus to the element that was focused before the modal was opened
        if (
          !focusAlreadyMovedElsewhere &&
          this.previousActiveElement &&
          typeof this.previousActiveElement.focus === 'function'
        ) {
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
   * Whether `active` sits inside a surface actually stacked above this modal.
   *
   * Used to decide whether an Escape keypress belongs to that surface instead
   * of this modal. Focus being merely *outside* this modal is not enough on
   * its own: in `disableTopLayer` mode the page stays interactive (that's the
   * point of a non-modal usage like a drawer), so focus will routinely be on
   * ordinary page content while the modal is open, and that must not be
   * mistaken for "an overlay owns Escape."
   *
   * Two ways a surface can be above: it is itself promoted to the browser's
   * top layer (a regular `showModal()` dialog, which paints above everything
   * outside the top layer regardless of z-index — a sibling pds-modal opened
   * over a `disableTopLayer` drawer typically shares the exact same z-index
   * token, so a numeric comparison alone would miss it), or it has a higher
   * z-index than this modal's own backdrop (a `disableTopLayer` overlay, or
   * anything else deliberately raised above it).
   *
   * `topLayerDialog` / `topLayerDialogWasModal` come pre-snapshotted from the
   * keydown event (see handleKeyDown) rather than being re-derived here: by
   * the time a later sibling modal's listener runs, an earlier one may have
   * already closed itself, which clears `:modal` — reading it live here would
   * lose that evidence depending on listener order.
   */
  private isStackedAboveOverlay(active: Element, topLayerDialog: Element | null, topLayerDialogWasModal: boolean): boolean {
    if (topLayerDialog && topLayerDialog !== this.modalRef && topLayerDialogWasModal) {
      return true;
    }

    const ownZIndex = this.getBackdropZIndex(this.el);

    let node: Element | null = active;
    while (node && node !== document.body) {
      const style = getComputedStyle(node);
      const zIndex = parseInt(style.zIndex, 10);

      if (style.position !== 'static' && !isNaN(zIndex) && zIndex > ownZIndex) {
        return true;
      }

      node = node.parentElement;
    }

    return false;
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
      // Every open pds-modal shares this document-level listener for the
      // same keydown event. Whichever one runs first can synchronously move
      // focus (hideModal() restores it), which would make a later instance's
      // own read of document.activeElement reflect that side effect instead
      // of where focus actually was when the key was pressed — stacking two
      // sibling modals closing on one Escape instead of just the top one.
      // That alone isn't enough, though: isStackedAboveOverlay's `:modal`
      // check reads LIVE top-layer state, and hideModal()'s close() clears it
      // synchronously — so whichever sibling's listener runs first (DOM
      // order, not z-index) can close itself and erase the very evidence a
      // later listener needs to recognize it was stacked above. Snapshot that
      // determination too, in the same first-listener-wins block, before any
      // instance has had a chance to act on this keypress.
      const eventSnapshot = e as KeyboardEvent & {
        __pdsActiveElementAtEscape?: Element | null;
        __pdsTopLayerDialogAtEscape?: Element | null;
        __pdsTopLayerDialogWasModalAtEscape?: boolean;
      };
      if (!('__pdsActiveElementAtEscape' in eventSnapshot)) {
        const activeAtDispatch = document.activeElement;
        eventSnapshot.__pdsActiveElementAtEscape = activeAtDispatch;
        const topLayerDialog = activeAtDispatch?.closest('dialog') ?? null;
        eventSnapshot.__pdsTopLayerDialogAtEscape = topLayerDialog;
        eventSnapshot.__pdsTopLayerDialogWasModalAtEscape = !!(topLayerDialog && topLayerDialog.matches(':modal'));
      }
      // Leave Escape to a genuinely stacked-above overlay (disableTopLayer's
      // reason for existing) — not just to anything outside this modal.
      const active = eventSnapshot.__pdsActiveElementAtEscape;
      if (
        this.disableTopLayer &&
        active &&
        active !== document.body &&
        !this.el.contains(active) &&
        this.isStackedAboveOverlay(
          active,
          eventSnapshot.__pdsTopLayerDialogAtEscape ?? null,
          eventSnapshot.__pdsTopLayerDialogWasModalAtEscape ?? false,
        )
      ) {
        return;
      }
      // Always prevent native dialog close behavior
      e.preventDefault();
      // Only close if backdropDismiss is enabled and this is the innermost modal
      if (this.backdropDismiss && this.isInnermostModal()) {
        this.hideModal();
      }
      return;
    }

    // Handle Tab key for focus trapping
    if (e.key === 'Tab') {
      // In non-top-layer mode the modal is deliberately not focus-isolated: focus
      // must be able to leave it into overlays stacked above (the whole point of
      // disableTopLayer), so do not trap Tab here.
      if (this.disableTopLayer) return;

      // Content can change while the modal is open (rows fetched in, sections shown), so the
      // first and last elements are read now rather than from the list taken on opening.
      this.updateFocusableElements();

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

  private resolveSize(): [string | undefined, string?] {
    const size = (this.size ?? '').trim() || 'md';
    if ((PRESET_SIZES as readonly string[]).includes(size)) return [size];
    return isCustomLength(size) ? ['custom', size] : [undefined];
  }

  private warnOnInvalidSize() {
    if (this.resolveSize()[0] !== undefined) return;
    console.warn(`pds-modal: invalid size "${String(this.size).slice(0, 50)}", using md`);
  }

  render() {
    const [sizeClass = 'md', customSize] = this.resolveSize();

    return (
      <dialog
        class={{
          'pds-modal__backdrop': true,
          'open': this.open
        }}
        aria-modal={this.disableTopLayer ? 'false' : 'true'}
        aria-labelledby={`${this.componentId}-heading`}
        onClick={this.handleBackdropClick}
      >
        <div
          class={{
            'pds-modal': true,
            [`pds-modal--${sizeClass}`]: true,
            'pds-modal--scrollable': this.scrollable
          }}
          style={customSize !== undefined ? { '--pds-modal-max-width': customSize } : undefined}
          part="modal"
        >
          <slot></slot>
        </div>
      </dialog>
    );
  }
}
