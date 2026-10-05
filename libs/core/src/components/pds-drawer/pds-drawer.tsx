import { Component, Element, Event, EventEmitter, Host, Listen, Prop, State, Watch, h } from '@stencil/core';
import { unwrapReconnectedContent } from '@utils/reconnected-content';

// Known selectors for content Pine components portal to document.body rather
// than rendering in place — pds-popover, pds-tooltip, pds-combobox's dropdown.
// A pointerdown landing on one of these is not "outside" the drawer in the
// sense light dismiss cares about: it belongs to an overlay something inside
// the drawer opened, even though it is not a DOM descendant of the drawer.
const PORTALED_OVERLAY_SELECTOR = '.pds-popover, .pds-tooltip, .pds-combobox-dropdown-portal';

// Initial width plus default drag bounds per size, used whenever `minWidth`/
// `maxWidth` are left unset. Exact pixel values still need design sign-off
// (see the ticket's "Needs a design call" section) — these keep today's
// sm/md initial widths and bracket them with a reasonable range.
const SIZE_SCALE: Record<'sm' | 'md', { width: number; min: number; max: number }> = {
  sm: { width: 360, min: 280, max: 480 },
  md: { width: 500, min: 360, max: 720 },
};

// A step for ArrowLeft/ArrowRight, and a larger one for Shift+Arrow — the
// WAI-ARIA Window Splitter pattern's keyboard contract.
const RESIZE_STEP = 16;
const RESIZE_STEP_LARGE = 64;

/**
 * A non-modal side panel composed from `pds-modal`.
 *
 * Unlike `pds-modal`, the page stays interactive while a drawer is open: no
 * dimming, no blur, no scroll lock, no click blocking. `pds-drawer` renders a
 * `pds-modal` internally with `disableTopLayer` always on and its backdrop
 * suppressed, and adds the edge, width, resize and dismiss behavior a side
 * panel needs on top. It does not reimplement focus, Escape or dialog
 * semantics — those come from `pds-modal` unchanged.
 */
@Component({
  tag: 'pds-drawer',
  styleUrl: 'pds-drawer.scss',
  shadow: false,
})
export class PdsDrawer {
  @Element() el: HTMLPdsDrawerElement;

  // The drawer's own direct inner pds-modal, so pdsModalOpen/pdsModalClose
  // handlers below can tell it apart from a confirm dialog or similar nested
  // pds-modal rendered inside the drawer's own slotted content — both bubble
  // the same event names, and only the former should drive our open state.
  private modalEl?: HTMLPdsModalElement;

  private handleEl?: HTMLDivElement;
  private isDragging = false;
  private activePointerId: number | null = null;
  private dragStartClientX = 0;
  private dragStartWidth = 0;
  // Resolved once per drag from the computed writing direction and the
  // logical `side`, not hardcoded — `side` is free under RTL (see its own
  // prop doc), so which physical edge the pointer has to move toward to
  // widen the panel flips too.
  private dragDirection: 1 | -1 = 1;
  private hasBeenManuallyResized = false;
  private lastCommittedWidth?: number;

  // Unwraps a nested pds-modal left by a page-cache (Turbo, bfcache) reconnect
  // — the same bug class #806 fixed for pds-modal-header/-content/-footer.
  // Every render wraps the slotted content in a fresh pds-modal; a reconnect
  // that restores a prior render's pds-modal in our light DOM ends up with
  // that stale one nested inside the new one.
  //
  // The container has to be the fresh modal's own `.pds-modal` content div,
  // not the `<pds-modal>` tag itself: once pds-modal has actually hydrated
  // (the realistic case — it ships registered in every real app), its own
  // render wraps whatever it received in a `<dialog><div class="pds-modal">`
  // of its own, so a stale nested pds-modal lands inside THAT div, one level
  // deeper than `<pds-modal>`'s own direct children.
  //
  // The match selector has to key on our own panelId specifically, not just
  // "a pds-modal" — slotted content can legitimately include a real nested
  // pds-modal (a confirm dialog opened from within the drawer; see the
  // "nested pds-modal" e2e describe block), and that must not be mistaken
  // for reconnect debris and unwrapped away. Only a stale copy of the one
  // pds-modal we ourselves create carries this exact id.
  componentDidRender() {
    unwrapReconnectedContent(
      this.el.querySelector('pds-modal .pds-modal'),
      `pds-modal[id="${this.panelId}"]`,
      '.pds-modal',
    );
  }

  componentWillLoad() {
    this.currentWidth = this.clampWidth(SIZE_SCALE[this.size].width);
  }

  /**
   * A unique identifier used for the underlying component `id` attribute.
   */
  @Prop() componentId: string;

  /**
   * Whether the drawer is open
   * @default false
   */
  @Prop({ mutable: true }) open = false;

  /**
   * Which edge of the viewport the drawer is docked to. Logical, so this is
   * free under RTL — `end` is the inline-end edge regardless of direction.
   * @default 'end'
   */
  @Prop() side: 'start' | 'end' = 'end';

  /**
   * The drawer's initial width. This is the only width control when
   * `resizable` is off; once `resizable` is on, it's the starting point a
   * drag or keyboard step moves from.
   * @default 'md'
   */
  @Prop() size: 'sm' | 'md' = 'md';

  /**
   * Whether the drawer content should be scrollable
   * @default true
   */
  @Prop() scrollable = true;

  /**
   * Whether the drawer can be dismissed with a pointerdown outside it.
   * Replaces `pds-modal`'s `backdropDismiss` — there is no backdrop to click.
   * This also gates Escape, matching how `backdropDismiss` gates Escape on
   * `pds-modal` today: setting this to `false` means the close button is the
   * only way out.
   *
   * A trigger outside the drawer should only ever set `open` to `true` and
   * leave closing to the drawer itself. A toggle-style trigger (`open =
   * !open`) fights light dismiss: clicking it while open closes the drawer
   * on `pointerdown`, then the trigger's own click handler re-opens it.
   * @default true
   */
  @Prop() lightDismiss = true;

  /**
   * Whether to move focus into the drawer when it opens. `auto` is right for
   * a drawer opened by a direct user action (a click, a deep link the user
   * just navigated to). Set to `none` for a drawer that can open from a
   * background event while the user is mid-task elsewhere on the page —
   * moving focus there would interrupt them, and the page stays live under
   * a non-modal drawer, so it is a genuine data-entry risk, not just an
   * annoyance.
   * @default 'auto'
   */
  @Prop() initialFocus: 'auto' | 'none' = 'auto';

  /**
   * Whether the drawer's page-facing edge can be dragged to resize it.
   * Opt-in, so simple cases are unaffected. The handle supports pointer
   * dragging (Escape cancels an in-progress drag and reverts to the
   * pre-drag width) and the WAI-ARIA Window Splitter keyboard pattern:
   * arrow keys step, Shift+arrow steps further, Home/End jump to the
   * bounds, and Enter toggles between the minimum width and the last width
   * you set. Hidden below the `md` (768px) breakpoint, where the panel
   * already occupies nearly the full viewport.
   * @default false
   */
  @Prop() resizable = false;

  /**
   * The minimum width, in px, the panel can be dragged or keyed down to.
   * Defaults from the `size` scale when unset. Only meaningful when
   * `resizable` is true.
   */
  @Prop() minWidth?: number;

  /**
   * The maximum width, in px, the panel can be dragged or keyed up to.
   * Defaults from the `size` scale when unset. Only meaningful when
   * `resizable` is true.
   */
  @Prop() maxWidth?: number;

  /**
   * Accessible name for the resize handle.
   * @default 'Resize drawer'
   */
  @Prop() resizeHandleLabel = 'Resize drawer';

  /**
   * Accessible description for the resize handle, surfaced via
   * `aria-describedby` rather than `aria-label` so it doesn't override the
   * name above. The WAI-ARIA Window Splitter pattern calls this out
   * explicitly: since Enter can collapse the panel, assistive technology
   * users need to be told that behavior exists, not just left to discover
   * it by pressing keys.
   * @default 'Use arrow keys to resize. Press Enter to collapse to the minimum width, or to restore the last width you set.'
   */
  @Prop() resizeHandleDescription =
    'Use arrow keys to resize. Press Enter to collapse to the minimum width, or to restore the last width you set.';

  /**
   * Emitted when the drawer is opened
   */
  @Event() pdsDrawerOpen: EventEmitter<void>;

  /**
   * Emitted when the drawer is closed
   */
  @Event() pdsDrawerClose: EventEmitter<void>;

  /**
   * Emitted continuously while the panel is being resized — on every pointer
   * move and on every keyboard step — with the in-progress width in px.
   */
  @Event() pdsDrawerResize: EventEmitter<{ width: number }>;

  /**
   * Emitted once a resize settles: on pointer release, or after each
   * discrete keyboard step. Pine does not persist the width across reloads —
   * whether it survives one, and whether it is per-user or per-surface, is a
   * consumer decision.
   */
  @Event() pdsDrawerResizeEnd: EventEmitter<{ width: number }>;

  // The panel's current width in px, including live updates during a drag
  // or keyboard step (see setWidth) — the single source of truth the CSS
  // custom property and the handle's aria-valuenow both render from.
  @State() currentWidth: number;

  // Not manually resized yet: reset to the new size's default width (a
  // no-op clamp, since a size default is always within its own bounds).
  // Already manually resized: keep the user's width, but bounds track
  // `size` whenever minWidth/maxWidth aren't explicitly pinned (per the
  // ticket: "Drag bounds, defaulted from the size scale"), so re-clamp it
  // against the new bounds rather than leaving `currentWidth`/aria-valuenow
  // out of sync with what the CSS clamp() would render anyway.
  @Watch('size')
  handleSizeChange(newSize: 'sm' | 'md') {
    this.currentWidth = this.hasBeenManuallyResized
      ? this.clampWidth(this.currentWidth)
      : this.clampWidth(SIZE_SCALE[newSize].width);
  }

  // pds-modal closes itself (Escape, light dismiss, a consumer's close
  // button toggling its own `open`) and only updates its own `open` prop —
  // mirror that back onto ours so a consumer's binding stays correct, and
  // re-emit as our own event rather than leaking pds-modal's event name.
  // Both events bubble, so a nested pds-modal (a confirm dialog inside the
  // drawer's own content) would otherwise trigger these too — only react to
  // our own direct inner modal.
  @Listen('pdsModalClose')
  handleModalClose(e: CustomEvent<void>) {
    if (e.target !== this.modalEl) return;
    this.open = false;
    this.pdsDrawerClose.emit();
  }

  @Listen('pdsModalOpen')
  handleModalOpen(e: CustomEvent<void>) {
    if (e.target !== this.modalEl) return;
    this.pdsDrawerOpen.emit();
  }

  // Light dismiss: a pointerdown anywhere outside the drawer closes it. This
  // has to be a listener of our own, not pds-modal's backdrop-click handler —
  // the backdrop is pointer-events:none out here (see pds-drawer.scss) so the
  // page underneath stays genuinely clickable, which means a click there
  // never reaches pds-modal's backdrop element at all.
  @Listen('pointerdown', { target: 'document' })
  handleOutsidePointerDown(e: PointerEvent) {
    if (!this.lightDismiss || !this.open) return;
    const target = e.target as Element | null;
    if (!target) return;
    if (this.el.contains(target)) return;
    if (target.closest(PORTALED_OVERLAY_SELECTOR)) return;
    this.open = false;
  }

  // Number.isFinite rather than a plain ?? — Stencil coerces a number prop's
  // attribute string via Number(), so a non-numeric min-width/max-width
  // attribute (e.g. "abc") yields NaN rather than undefined. NaN would
  // otherwise propagate into the CSS custom property, aria-valuemin/-valuemax
  // and clampWidth's Math.min/Math.max — NaN poisons all of those silently.
  private get effectiveMinWidth(): number {
    return Number.isFinite(this.minWidth) ? (this.minWidth as number) : SIZE_SCALE[this.size].min;
  }

  private get effectiveMaxWidth(): number {
    return Number.isFinite(this.maxWidth) ? (this.maxWidth as number) : SIZE_SCALE[this.size].max;
  }

  private get panelId(): string {
    return `${this.componentId}-panel`;
  }

  private clampWidth(width: number): number {
    return Math.min(Math.max(width, this.effectiveMinWidth), this.effectiveMaxWidth);
  }

  // Updates the in-progress width through reactive @State — a prior version
  // bypassed this with a direct DOM write for perf, but that let an
  // unrelated re-render mid-drag reassert the stale pre-drag style/
  // aria-valuenow and silently clobber it. Stencil's task queue coalesces
  // same-tick writes to one render regardless, so there's no real perf cost
  // to going through state consistently instead.
  private setWidth(width: number) {
    this.currentWidth = width;
    this.pdsDrawerResize.emit({ width });
  }

  private commitWidth(width: number) {
    this.hasBeenManuallyResized = true;
    if (width !== this.effectiveMinWidth) {
      this.lastCommittedWidth = width;
    }
    this.setWidth(width);
    this.pdsDrawerResizeEnd.emit({ width });
  }

  // Reverts to the width the drag started at, without committing — used by
  // both Escape and pointercancel (a browser-interrupted gesture, not a
  // user-intentional release, so landing wherever the pointer happened to
  // be isn't the right call).
  private cancelDrag() {
    this.setWidth(this.dragStartWidth);
    this.isDragging = false;
    this.activePointerId = null;
  }

  private handleHandlePointerDown = (e: PointerEvent) => {
    if (!this.resizable || !this.handleEl) return;
    // Primary mouse button only; any single touch/pen contact is fine.
    if (e.pointerType === 'mouse' && e.button !== 0) return;

    this.handleEl.setPointerCapture(e.pointerId);
    this.isDragging = true;
    this.activePointerId = e.pointerId;
    this.dragStartClientX = e.clientX;
    this.dragStartWidth = this.currentWidth;

    // `side` is logical (free under RTL — see its own prop doc), so the
    // physical edge the panel rests on, and therefore which direction
    // widens it, depends on the computed writing direction too.
    const isRtl = getComputedStyle(this.el).direction === 'rtl';
    const panelPinnedToPhysicalLeft = isRtl ? this.side === 'end' : this.side === 'start';
    this.dragDirection = panelPinnedToPhysicalLeft ? 1 : -1;
  };

  private handleHandlePointerMove = (e: PointerEvent) => {
    if (!this.isDragging || e.pointerId !== this.activePointerId) return;
    const delta = e.clientX - this.dragStartClientX;
    const width = this.clampWidth(this.dragStartWidth + this.dragDirection * delta);
    this.setWidth(width);
  };

  private handleHandlePointerUp = (e: PointerEvent) => {
    if (!this.isDragging || e.pointerId !== this.activePointerId) return;
    this.handleEl?.releasePointerCapture(e.pointerId);
    const delta = e.clientX - this.dragStartClientX;
    const width = this.clampWidth(this.dragStartWidth + this.dragDirection * delta);
    this.commitWidth(width);
    this.isDragging = false;
    this.activePointerId = null;
  };

  private handleHandlePointerCancel = (e: PointerEvent) => {
    if (!this.isDragging || e.pointerId !== this.activePointerId) return;
    this.handleEl?.releasePointerCapture(e.pointerId);
    this.cancelDrag();
  };

  // ArrowRight always widens and ArrowLeft always narrows — a
  // value-increases/decreases semantic, not a screen-direction one, so
  // keyboard behavior doesn't also need to flip under RTL or by `side`
  // (unlike pointer dragging, which does — see handleHandlePointerDown).
  private handleHandleKeyDown = (e: KeyboardEvent) => {
    if (!this.resizable) return;

    if (e.key === 'Escape' && this.isDragging) {
      e.preventDefault();
      // Don't let this Escape also bubble to pds-modal's own document-level
      // Escape handler — cancelling an in-progress resize is what the user
      // means here, not also closing the drawer in the same keypress.
      e.stopPropagation();
      if (this.activePointerId !== null) {
        this.handleEl?.releasePointerCapture(this.activePointerId);
      }
      this.cancelDrag();
      return;
    }

    let next: number;
    switch (e.key) {
      case 'ArrowLeft':
        next = this.currentWidth - (e.shiftKey ? RESIZE_STEP_LARGE : RESIZE_STEP);
        break;
      case 'ArrowRight':
        next = this.currentWidth + (e.shiftKey ? RESIZE_STEP_LARGE : RESIZE_STEP);
        break;
      case 'Home':
        next = this.effectiveMinWidth;
        break;
      case 'End':
        next = this.effectiveMaxWidth;
        break;
      case 'Enter':
        next =
          this.currentWidth === this.effectiveMinWidth
            ? this.lastCommittedWidth ?? SIZE_SCALE[this.size].width
            : this.effectiveMinWidth;
        break;
      default:
        return;
    }

    e.preventDefault();
    this.commitWidth(this.clampWidth(next));
  };

  private get handleDescriptionId(): string {
    return `${this.panelId}-resize-description`;
  }

  private renderHandle() {
    if (!this.resizable) return null;

    return [
      <div
        class="pds-drawer__handle"
        part="handle"
        role="separator"
        aria-orientation="vertical"
        aria-valuenow={this.currentWidth}
        aria-valuemin={this.effectiveMinWidth}
        aria-valuemax={this.effectiveMaxWidth}
        aria-controls={this.panelId}
        aria-label={this.resizeHandleLabel}
        aria-describedby={this.handleDescriptionId}
        tabindex="0"
        ref={(el) => (this.handleEl = el as HTMLDivElement)}
        onPointerDown={this.handleHandlePointerDown}
        onPointerMove={this.handleHandlePointerMove}
        onPointerUp={this.handleHandlePointerUp}
        onPointerCancel={this.handleHandlePointerCancel}
        onKeyDown={this.handleHandleKeyDown}
      ></div>,
      <span id={this.handleDescriptionId} class="visually-hidden">
        {this.resizeHandleDescription}
      </span>,
    ];
  }

  render() {
    return (
      <Host
        class={{
          'pds-drawer': true,
          [`pds-drawer--${this.side}`]: true,
          [`pds-drawer--${this.size}`]: true,
          'pds-drawer--resizable': this.resizable,
        }}
        style={
          this.resizable
            ? {
                '--pds-drawer-width': `${this.currentWidth}px`,
                // The CSS clamp() in pds-drawer.scss reads these two — without
                // reflecting them here, minWidth/maxWidth only ever drove the
                // JS-side clamp and aria-valuemin/-valuemax, while the actual
                // rendered width silently fell back to clamp()'s own 280/720
                // defaults for any bound outside that range.
                '--pds-drawer-min-width': `${this.effectiveMinWidth}px`,
                '--pds-drawer-max-width': `${this.effectiveMaxWidth}px`,
              }
            : {}
        }
      >
        <pds-modal
          id={this.panelId}
          ref={(el) => (this.modalEl = el as HTMLPdsModalElement)}
          componentId={this.componentId}
          open={this.open}
          scrollable={this.scrollable}
          disableTopLayer={true}
          backdropDismiss={this.lightDismiss}
          disableInitialFocus={this.initialFocus === 'none'}
        >
          <slot></slot>
          {this.renderHandle()}
        </pds-modal>
      </Host>
    );
  }
}
