import { Component, Element, Event, EventEmitter, Host, Listen, Prop, h } from '@stencil/core';

// Known selectors for content Pine components portal to document.body rather
// than rendering in place — pds-popover, pds-tooltip, pds-combobox's dropdown.
// A pointerdown landing on one of these is not "outside" the drawer in the
// sense light dismiss cares about: it belongs to an overlay something inside
// the drawer opened, even though it is not a DOM descendant of the drawer.
const PORTALED_OVERLAY_SELECTOR = '.pds-popover, .pds-tooltip, .pds-combobox-dropdown-portal';

/**
 * A resizable, non-modal side panel composed from `pds-modal`.
 *
 * Unlike `pds-modal`, the page stays interactive while a drawer is open: no
 * dimming, no blur, no scroll lock, no click blocking. `pds-drawer` renders a
 * `pds-modal` internally with `disableTopLayer` always on and its backdrop
 * suppressed, and adds the edge, width and dismiss behavior a side panel
 * needs on top. It does not reimplement focus, Escape or dialog semantics —
 * those come from `pds-modal` unchanged.
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
   * The drawer's width. This is the only width control; use `pds-drawer`'s
   * `resizable` mode (coming separately) to let the user adjust it.
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
   * Emitted when the drawer is opened
   */
  @Event() pdsDrawerOpen: EventEmitter<void>;

  /**
   * Emitted when the drawer is closed
   */
  @Event() pdsDrawerClose: EventEmitter<void>;

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

  render() {
    return (
      <Host
        class={{
          'pds-drawer': true,
          [`pds-drawer--${this.side}`]: true,
          [`pds-drawer--${this.size}`]: true,
        }}
      >
        <pds-modal
          ref={(el) => (this.modalEl = el as HTMLPdsModalElement)}
          componentId={this.componentId}
          open={this.open}
          scrollable={this.scrollable}
          disableTopLayer={true}
          backdropDismiss={this.lightDismiss}
          disableInitialFocus={this.initialFocus === 'none'}
        >
          <slot></slot>
        </pds-modal>
      </Host>
    );
  }
}
