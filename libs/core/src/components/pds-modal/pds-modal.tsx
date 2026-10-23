import { Component, Element, Event, EventEmitter, h, Method, Prop, State, Watch } from '@stencil/core';
import { closest } from '@utils/closest';
import { unwrapReconnectedContent } from '@utils/reconnected-content';
import type { ModalSizeType } from '@utils/types';

const PRESET_SIZES: readonly ModalSizeType[] = ['sm', 'md', 'lg', 'fullscreen'];

const isCustomLength = (value: string): boolean =>
  /^[a-z0-9.%+\-*/(), ]+$/i.test(value) &&
  /\d/.test(value) &&
  (typeof CSS === 'undefined' || CSS.supports('max-width', value));

const TABBABLE = [
  'a[href]',
  'area[href]',
  'button',
  'input:not([type="hidden"])',
  'select',
  'textarea',
  'iframe',
  'summary',
  '[contenteditable]:not([contenteditable="false"])',
  '[tabindex]',
].join(',');

/**
 * Collects the tabbable elements under `root` in focus order, walking into open shadow roots and
 * following slots, so a component's own controls (the input inside pds-combobox or pds-textarea)
 * count without being registered here by tag name. Positive tabindex values are not reordered,
 * and a closed shadow root can't be seen into.
 */
function collectTabbable(root: Element | ShadowRoot, found: HTMLElement[]) {
  for (const child of Array.from(root.children)) visitTabbable(child, found);
}

// An editing host reports tabIndex -1 but is still a Tab stop; editable content inside it is not.
const isTabStop = (el: HTMLElement) =>
  el.tabIndex >= 0 || (el.isContentEditable && !el.hasAttribute('tabindex') && !el.parentElement?.isContentEditable);

function visitTabbable(el: Element, found: HTMLElement[]) {
  if (el.hasAttribute('inert')) return;
  if (el.localName === 'slot') {
    const slot = el as HTMLSlotElement;
    // Fallback content renders only when nothing at all is assigned, text included.
    if ((slot.assignedNodes?.({ flatten: true }) ?? []).length === 0) return collectTabbable(el, found);
    for (const slotted of slot.assignedElements({ flatten: true })) visitTabbable(slotted, found);
    return;
  }
  // A delegatesFocus host passes focus to its first control, which the walk below finds.
  const delegates = el.shadowRoot?.delegatesFocus === true;
  if (el instanceof HTMLElement && !delegates && isTabStop(el) && el.matches(TABBABLE) && !el.matches(':disabled')) {
    found.push(el);
  }
  // A shadow host's light children render only through its slots, which the walk reaches.
  collectTabbable(el.shadowRoot ?? el, found);
}

/** The element as a radio in a named group, or `null`. */
const groupedRadio = (el: HTMLElement): HTMLInputElement | null =>
  el instanceof HTMLInputElement && el.type === 'radio' && el.name !== '' ? el : null;

/**
 * Keeps one radio per named group, as the browser does: the checked one, or the first. The others
 * are reached with the arrow keys, so they can't be the first or last stop of the trap.
 */
function oneRadioPerGroup(elements: HTMLElement[]): HTMLElement[] {
  // Radios group by name and form within one tree, so each shadow root starts its own groups.
  const groups: HTMLInputElement[][] = [];
  for (const el of elements) {
    const radio = groupedRadio(el);
    if (radio === null) continue;
    const group = groups.find(
      ([first]) => first.name === radio.name && first.form === radio.form && first.getRootNode() === radio.getRootNode(),
    );
    if (group) group.push(radio);
    else groups.push([radio]);
  }
  const stops = new Set<HTMLElement>(groups.map((radios) => radios.find((radio) => radio.checked) ?? radios[0]));
  return elements.filter((el) => groupedRadio(el) === null || stops.has(el));
}

/** The controls Tab reaches in `root`, in order: visible ones, and one radio per group. */
function tabbableIn(root: Element): HTMLElement[] {
  const found: HTMLElement[] = [];
  collectTabbable(root, found);
  // checkVisibility() also drops an element inside a hidden ancestor, whose own computed
  // display isn't none; such an element can't take focus.
  const visible = found.filter(el => {
    if (typeof el.checkVisibility === 'function') return el.checkVisibility({ checkVisibilityCSS: true });

    const style = window.getComputedStyle(el);
    return style.display !== 'none' && style.visibility !== 'hidden';
  });
  return oneRadioPerGroup(visible);
}

/** Whether `node` is `ancestor` or inside it, crossing shadow roots, which `Node.contains` doesn't. */
function containsComposed(ancestor: Node, node: Node | null): boolean {
  for (let current = node; current; current = current instanceof ShadowRoot ? current.host : current.parentNode) {
    if (current === ancestor) return true;
  }
  return false;
}

/**
 * Every open modal, with the order it opened in, which ranks top-layer modals and the modals
 * inside them. Kept here rather than queried from the document, which can't see a modal inside
 * another component's shadow root.
 */
const openModals = new Map<Element, number>();
let openSequence = 0;

/** Whether the panel of an open popover that takes Escape sits in `root`, including inside shadow roots under it. */
function hasOpenPopover(root: Element | ShadowRoot): boolean {
  if (root.querySelector('[data-pds-popover-open]')) return true;
  return Array.from(root.querySelectorAll('*')).some(el => !!el.shadowRoot && hasOpenPopover(el.shadowRoot));
}

/**
 * Whether `a` comes before `b` in the page. `compareDocumentPosition` is arbitrary across a shadow
 * boundary, so each side climbs to its host until both are in the same tree.
 */
function precedesComposed(a: Element, b: Element): boolean {
  // A document has no host, which ends each climb.
  for (let x: Element | undefined = a; x; x = (x.getRootNode() as ShadowRoot).host) {
    for (let y: Element | undefined = b; y; y = (y.getRootNode() as ShadowRoot).host) {
      if (x.getRootNode() === y.getRootNode()) {
        return !!(x.compareDocumentPosition(y) & Node.DOCUMENT_POSITION_FOLLOWING);
      }
    }
  }
  return false;
}

/** The focused element, followed down through shadow roots to the control that has focus. */
function deepActiveElement(): Element | null {
  let active = document.activeElement;
  while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement;
  return active;
}

/**
 * @lightDom renders-markup
 */
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
   * Whether the modal can be dismissed by clicking the backdrop, pressing Escape, or the browser's
   * own close request (such as a back gesture)
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

  // Here rather than in componentDidLoad, which runs once: a modal taken out of the page and put
  // back (a morph or a framework moving it) gets its keyboard handling, and its place among the
  // open modals, back too. Adding the same listener twice is a no-op.
  connectedCallback() {
    document.addEventListener('keydown', this.handleKeyDown);
    if (this.open && !openModals.has(this.el)) openModals.set(this.el, ++openSequence);
  }

  disconnectedCallback() {
    // Clean up event listener
    document.removeEventListener('keydown', this.handleKeyDown);
    openModals.delete(this.el);
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
    this.focusableElements = tabbableIn(this.modalRef);
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
   * Focuses an element from the list. It holds the controls themselves, inside any shadow root,
   * so they take focus directly.
   */
  private focusElement(element: HTMLElement) {
    element?.focus();
  }

  /**
   * Opens the modal
   */
  @Method()
  async showModal() {
    if (this.modalRef) {
      try {
        // Store the currently focused element to restore focus when modal closes. Showing an open
        // modal again (the open watcher does) would record a control inside it instead.
        if (!this.modalRef.open) this.previousActiveElement = document.activeElement as HTMLElement;

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
        // Showing an open modal again doesn't move it above one opened after it.
        if (!openModals.has(this.el)) openModals.set(this.el, ++openSequence);

        // Update focusable elements and set initial focus
        // Using a longer timeout to ensure all components are fully rendered
        const openedAs = openModals.get(this.el) ?? 0;
        setTimeout(() => {
          this.updateFocusableElements();
          // A modal opened above this one in the meantime has focus; don't take it back. Not this
          // modal itself (moving it gives it a new place), and not a disableTopLayer modal outside
          // it while this one is in the top layer, which sits below it.
          const openedAbove = Array.from(openModals).some(
            ([modal, sequence]) =>
              sequence > openedAs &&
              modal !== this.el &&
              (containsComposed(this.el, modal) || !(modal as HTMLPdsModalElement).disableTopLayer || this.disableTopLayer),
          );
          if (openedAbove) {
            this.pdsModalOpen.emit();
            return;
          }
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
        openModals.delete(this.el);

        // Restore focus to the element that was focused before the modal was opened. If that's
        // gone or can't take focus (disabled, hidden, or nothing), fall back to the open modal now
        // on top, so focus doesn't land on an inert page behind it.
        if (!focusAlreadyMovedElsewhere) {
          const previous = this.previousActiveElement;
          if (previous && previous !== document.body && previous.isConnected) previous.focus?.();
          const active = deepActiveElement();
          // document.body isn't a real restore target — it's just where focus lands when nothing
          // was focused before opening, so landing back there never counts as a successful restore.
          if (!previous || previous === document.body || !containsComposed(previous, active) || containsComposed(this.el, active))
            this.focusTopModal();
        }

        this.pdsModalClose.emit();
      } catch (error) {
        console.error('Failed to hide modal:', error);
      }
    }
  }

  /**
   * Focuses the first control of the open modal now on top, when the page behind it is inert: that
   * modal is in the top layer (or paints there inside a top-layer one), or it wraps this one. A
   * non-modal one over an interactive page, like a drawer, is left alone.
   */
  private focusTopModal() {
    const top = this.innermostOpenModal();
    const dialog = top?.querySelector('.pds-modal__backdrop');
    if (!dialog) return;
    if (!closest('dialog:modal', dialog) && !containsComposed(top, this.el)) return;
    tabbableIn(dialog).find(el => !containsComposed(this.el, el))?.focus();
  }


  // The browser's own close request (an Escape nothing prevented, a back gesture) would close the
  // dialog without updating `open`, so close it through hideModal() instead, or not at all.
  private handleCancel = (e: Event) => {
    e.preventDefault();
    if (!this.open) return;
    // The request reaches the top-layer dialog even when a disableTopLayer modal inside it is on
    // top; that one closes first, as it would on Escape.
    const top = this.innermostOpenModal();
    const target = (top && containsComposed(this.el, top) ? top : this.el) as HTMLPdsModalElement;
    if (target.backdropDismiss) target.hideModal();
  };

  private handleBackdropClick = (e: MouseEvent) => {
    if (!this.backdropDismiss || !this.open) return;

    // This modal's own backdrop; a nested modal's backdrop handles its own clicks.
    if (e.target === this.modalRef) {
      e.stopPropagation();

      // Only close if this is the innermost modal
      if (this.innermostOpenModal() === this.el) {
        this.hideModal();
      }
    }
  };

  /**
   * Gets the z-index of a modal's backdrop element
   */
  private getBackdropZIndex(modal: Element): number {
    const backdrop = modal.querySelector('.pds-modal__backdrop');
    // `auto` (no z-index token loaded) parses to NaN, which no comparison can rank.
    const zIndex = backdrop ? parseInt(getComputedStyle(backdrop).zIndex, 10) : -1;
    return Number.isNaN(zIndex) ? 0 : zIndex;
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
    // A top-layer dialog this modal sits inside is underneath it, not an overlay above.
    if (topLayerDialog && topLayerDialog !== this.modalRef && topLayerDialogWasModal && !containsComposed(topLayerDialog, this.el)) {
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
   * The open modal that takes Escape or a backdrop click, among those with no other open modal
   * inside them (a nested modal's backdrop can share its outer modal's z-index). A top-layer dialog
   * (or a modal inside one) paints above anything outside it, and within the top layer the last
   * opened is on top. Modals in the same layer (the page, or one top-layer dialog) then rank by
   * the highest backdrop, then the one later in the page.
   */
  private innermostOpenModal(): Element | null {
    const open = Array.from(openModals.keys()).filter(modal => modal.isConnected);
    const innermost = open.filter(modal => !open.some(other => other !== modal && containsComposed(modal, other)));
    const byDocumentOrder = [...innermost].sort((a, b) => (precedesComposed(a, b) ? -1 : 1));
    // A modal inside a top-layer dialog paints in that dialog's place in the top layer, even when it
    // isn't in the top layer itself (disableTopLayer), so that dialog's open order ranks it first.
    const rank = (modal: Element): [number, number, number, number] => {
      const backdrop = modal.querySelector('.pds-modal__backdrop');
      const topLayerDialog = backdrop ? (closest('dialog:modal', backdrop) as Element | null) : null;
      const topLayerModal = topLayerDialog?.closest('pds-modal');
      const layer = topLayerDialog ? ((topLayerModal && openModals.get(topLayerModal)) ?? 0) : 0;
      return [topLayerDialog ? 1 : 0, layer, this.getBackdropZIndex(modal), byDocumentOrder.indexOf(modal)];
    };
    let top: Element | null = null;
    let topRank: [number, number, number, number] = [-1, -1, -1, -1];
    for (const modal of innermost) {
      const modalRank = rank(modal);
      const above = modalRank.findIndex((value, i) => value !== topRank[i]);
      if (above >= 0 && modalRank[above] > topRank[above]) {
        top = modal;
        topRank = modalRank;
      }
    }
    return top;
  }

  /** Whether a modal dialog other than this one sits between the focused element and this modal. */
  private modalDialogAbove(active: Element): boolean {
    for (let dialog = closest('dialog[open]', active); dialog instanceof HTMLElement; ) {
      if (dialog === this.modalRef) return false;
      if (dialog.matches(':modal')) return true;
      // Up from this dialog, across a shadow root; past the document root, closest() gives nothing.
      dialog = closest('dialog[open]', dialog.parentElement ?? (dialog.getRootNode() as ShadowRoot).host);
    }
    return false;
  }

  /** The focused element's place in the list: its own stop, or the innermost stop it sits in. */
  private stopIndex(active: Element): number {
    const own = this.focusableElements.indexOf(active as HTMLElement);
    if (own >= 0) return own;
    for (let i = this.focusableElements.length - 1; i >= 0; i--) {
      if (containsComposed(this.focusableElements[i], active)) return i;
    }
    return -1;
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
        __pdsDeepActiveElementAtEscape?: Element | null;
        __pdsTopLayerDialogAtEscape?: Element | null;
        __pdsTopLayerDialogWasModalAtEscape?: boolean;
        __pdsEscapeHandledInside?: boolean;
        __pdsInnermostModalAtEscape?: Element | null;
      };
      if (!('__pdsActiveElementAtEscape' in eventSnapshot)) {
        const activeAtDispatch = document.activeElement;
        eventSnapshot.__pdsActiveElementAtEscape = activeAtDispatch;
        // Followed into shadow roots: for a modal inside one, document.activeElement is only the host.
        eventSnapshot.__pdsDeepActiveElementAtEscape = deepActiveElement();
        const topLayerDialog = activeAtDispatch?.closest('dialog') ?? null;
        eventSnapshot.__pdsTopLayerDialogAtEscape = topLayerDialog;
        eventSnapshot.__pdsTopLayerDialogWasModalAtEscape = !!(topLayerDialog && topLayerDialog.matches(':modal'));
        // A control that closed on this Escape (a combobox on its own element, a dropdown menu or
        // multiselect in document's capture phase) has prevented it before this bubble listener.
        // Read before any modal prevents it below.
        eventSnapshot.__pdsEscapeHandledInside = e.defaultPrevented;
        // Which modal is innermost is read once too: the inner one closing first would make its
        // outer modal the innermost by the time that modal's listener runs.
        eventSnapshot.__pdsInnermostModalAtEscape = this.innermostOpenModal();
      }
      if (eventSnapshot.__pdsEscapeHandledInside) return;
      // Leave Escape to a genuinely stacked-above overlay (disableTopLayer's
      // reason for existing) — not just to anything outside this modal.
      const active = eventSnapshot.__pdsActiveElementAtEscape;
      if (
        this.disableTopLayer &&
        active &&
        active !== document.body &&
        !containsComposed(this.el, eventSnapshot.__pdsDeepActiveElementAtEscape ?? active) &&
        this.isStackedAboveOverlay(
          active,
          eventSnapshot.__pdsTopLayerDialogAtEscape ?? null,
          eventSnapshot.__pdsTopLayerDialogWasModalAtEscape ?? false,
        )
      ) {
        return;
      }
      // An open popover inside takes Escape from its own document listener, which runs after this
      // one, so leave the key for it. Its preventDefault() keeps the native dialog open.
      if (this.modalRef && hasOpenPopover(this.modalRef)) return;
      // Always prevent native dialog close behavior
      e.preventDefault();
      // Only close if backdropDismiss is enabled and this is the innermost modal
      if (this.backdropDismiss && eventSnapshot.__pdsInnermostModalAtEscape === this.el) {
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

      // A control inside that handles Tab itself (a popup with its own trap) has already moved
      // focus. This holds only when it listens on its own element, which runs before this
      // document listener; one listening on document too would race it.
      if (e.defaultPrevented) return;

      // Every open modal hears this keydown. When focus is in a modal dialog opened above this one,
      // that dialog traps Tab: this modal's list also holds its controls, so it would wrap first. A
      // non-modal dialog inside (a disableTopLayer modal) doesn't trap, so this one still does.
      const activeElement = deepActiveElement();
      if (!activeElement || this.modalDialogAbove(activeElement)) return;

      // Content can change while the modal is open (rows fetched in, sections shown), so the
      // first and last elements are read now rather than from the list taken on opening.
      this.updateFocusableElements();

      // If there are no focusable elements, do nothing
      if (this.focusableElements.length === 0) return;

      // Get the first and last focusable elements
      const firstFocusableElement = this.focusableElements[0];
      const lastFocusableElement = this.focusableElements[this.focusableElements.length - 1];

      // activeElement is the control inside any shadow root, as the list holds, not the host
      // document.activeElement reports. It's matched to its own stop first, so a stop inside a
      // listed host isn't taken for that host; a focused node that isn't a stop counts as the
      // innermost stop it sits in.
      const stop = this.stopIndex(activeElement);
      const isFirstElement = stop === 0;
      const isLastElement = stop === this.focusableElements.length - 1;

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
        onCancel={this.handleCancel}
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
