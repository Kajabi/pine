import { Component, Element, Event, EventEmitter, h, Host, Method, Prop, State } from '@stencil/core';
import type { BasePdsProps } from '@utils/interfaces';

/**
 * @slot (default) - The item's label.
 * @slot start - Content to display before the item's label, such as a `pds-icon`. A `pds-icon` without an `aria-label` or `aria-labelledby` is decorative; a named one is announced before the label, so leave decorative icons unnamed.
 * @part button - Exposes the item's inner element for styling. Appears on button and informational items, not on links.
 */
@Component({
  tag: 'pds-dropdown-menu-item',
  styleUrl: 'pds-dropdown-menu-item.scss',
  shadow: true,
})
export class PdsDropdownMenuItem implements BasePdsProps {
  @Element() host: HTMLPdsDropdownMenuItemElement;

  /**
   * A unique identifier used for the underlying component `id` attribute.
   */
  @Prop() componentId: string;

  /**
   * Determines whether or not the dropdown menu item is destructive.
   * @defaultValue false
   */
  @Prop() destructive: boolean = false;

  /**
   * Determines whether or not the dropdown menu item is disabled.
   * @defaultValue false
   */
  @Prop({ reflect: true }) disabled: boolean = false;


  /**
   * Prompts the user to save the linked URL instead of navigating to it.
   * It can be used without a value to download with the default filename,
   * or with a string value to suggest a specific filename for the download.
   * Only applies when href is set. Ignored when `informational` is set.
   */
  @Prop() download?: string;

  /**
   *  If provided, renders the dropdown menu item as an anchor (`<a>`) element instead of a button.
   *  Ignored when `informational` is set.
   */
  @Prop() href: string | undefined;

  /**
   * Determines whether or not the dropdown menu item is informational: text that the arrow keys
   * reach but that can't be activated. Takes precedence over `href` and `destructive`.
   * Screen readers announce it as dimmed or unavailable, the same way as a disabled item.
   * @defaultValue false
   */
  @Prop({ reflect: true }) informational: boolean = false;

  /**
   * Shows the external-link (launch) icon. Opens in a new tab unless `target` says otherwise.
   * Only applies when href is set. Ignored when `informational` is set.
   * @defaultValue false
   */
  @Prop({ reflect: true }) external: boolean = false;

  /**
   * Accessible label for the icon that `external` shows, passed to the inner
   * `pds-link` and appended to the item's name. It isn't announced when
   * `target` is anything other than `_blank`. Pass a translated string to
   * localize it; defaults to English. Pass an empty string to make the icon
   * decorative.
   * @defaultValue '(opens in a new tab)'
   */
  @Prop() externalLabel?: string;

  /**
   * Specifies where to open the linked document when href is provided.
   * Overrides the new-tab default of `external`; the icon still shows.
   * Only applies when href is set. Ignored when `informational` is set.
   * @defaultValue undefined
   */
  @Prop({ reflect: true }) target?: '_blank' | '_self' | '_parent' | '_top';

  /**
   * Emitted when the dropdown menu item is clicked.
   *
   */
  @Event() pdsClick: EventEmitter<{itemIndex: number, item: HTMLPdsDropdownMenuItemElement, content: string}>;

  /**
   * Trigger the click event. Does nothing when the item is disabled or informational.
   */
  @Method()
  async clickItem() {
    this.handleClick();
  };


  private handleClick = () => {
    if (this.disabled || this.informational) return;

    // Filter only pds-dropdown-menu-item elements and find the index of the current item
    const menuItems = Array.from(this.host.parentElement?.children ?? []).filter(
      (child) => child.tagName.toLowerCase() === 'pds-dropdown-menu-item'
    );
    const itemIndex = menuItems.indexOf(this.host);

    // The label's text: default-slot content only, so start-slot content stays out of it
    const content = Array.from(this.host.childNodes)
      .filter((node) =>
        node.nodeType === Node.TEXT_NODE ||
        (node.nodeType === Node.ELEMENT_NODE && !(node as Element).getAttribute('slot'))
      )
      .map((node) => node.textContent)
      .join('')
      .trim();

    this.pdsClick.emit({
      itemIndex,
      item: this.host,
      content
    });
  };

  @State() hasFocus: boolean = false;

  private startSlotEl?: HTMLSlotElement;

  // Checked directly against the light DOM rather than kept in @State: Stencil's JSX doesn't
  // type a `class` prop for `<slot>`, and a ref callback only fires once, on creation, so it
  // can't push a later @State change back onto the element either way. Called once up front
  // (from the ref, since nothing's assigned at componentWillLoad's point) and again on every
  // native slotchange after that, both calling classList directly. add/remove, not the two-argument
  // form of toggle(): Stencil's mock-doc (used by spec tests) implements toggle() as a plain flip
  // and silently ignores a force argument, so a toggle() call that'd be correct against a real
  // DOM can still fail there.
  private updateStartSlotEmpty = () => {
    const hasContent = Array.from(this.host.children).some((child) => child.getAttribute('slot') === 'start');
    if (hasContent) {
      this.startSlotEl?.classList.remove('pds-dropdown-menu-item__start--empty');
    } else {
      this.startSlotEl?.classList.add('pds-dropdown-menu-item__start--empty');
    }
  };

  // Always render the start slot so slotted content is projected reliably, with nothing wrapping
  // it: a wrapper would sit between the slotted content and this host, leaving it without an
  // assignedSlot, which breaks a click-target walk that follows assignedSlot up to find a link
  // (Turbo's link lookup works this way). The --empty class hides it when nothing is slotted, so
  // it adds no gap.
  private renderContent() {
    return [
      <slot
        name="start"
        onSlotchange={this.updateStartSlotEmpty}
        ref={(el) => {
          this.startSlotEl = el;
          if (el) {
            el.classList.add('pds-dropdown-menu-item__start');
            this.updateStartSlotEmpty();
          }
        }}
      ></slot>,
      <slot></slot>
    ];
  }

  private handleFocus = () => {
    this.hasFocus = true;
  }

  private handleBlur = () => {
    this.hasFocus = false;
  }

  // Space would otherwise scroll the page, since nothing in the item takes the key.
  private handleInformationalKeyDown = (event: KeyboardEvent) => {
    if (event.key === ' ') {
      event.preventDefault();
    }
  }

  private renderElement() {
    if (this.informational) {
      return (
        <div
          class={{
            'pds-dropdown-menu-item__content': true,
            'has-focus': this.hasFocus
          }}
          role="menuitem"
          aria-disabled="true"
          part="button"
          tabIndex={this.disabled ? -1 : 0}
          onKeyDown={this.handleInformationalKeyDown}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
        >
          {this.renderContent()}
        </div>
      );
    }

    if (this.href != null) {
      return (
        <pds-link
          download={this.download}
          href={this.disabled ? null : this.href}
          external={this.external}
          externalLabel={this.externalLabel}
          target={this.target}
          class={{
            'pds-dropdown-menu-item__content': true,
            'has-focus': this.hasFocus
          }}
          tabIndex={this.disabled ? -1 : 0}
          onKeyDown={this.handleKeyDown}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          aria-disabled={this.disabled ? 'true' : null}
        >
          {this.renderContent()}
        </pds-link>
      );
    }

    return (
      <button
        class={{
          'pds-dropdown-menu-item__content': true,
          'has-focus': this.hasFocus
        }}
        tabIndex={this.disabled ? -1 : 0}
        type="button"
        part="button"
        onKeyDown={this.handleKeyDown}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        disabled={this.disabled}
        aria-disabled={this.disabled ? 'true' : null}
      >
        {this.renderContent()}
      </button>
    );
  }

  // pds-link's own shadow root, one level in from its host.
  private innerAnchor(): HTMLAnchorElement | null {
    return this.host.shadowRoot?.querySelector('pds-link')?.shadowRoot?.querySelector('a') ?? null;
  }

  private handleKeyDown = (event: KeyboardEvent) => {
    if (this.disabled || event.key !== 'Enter') return;

    if (this.href != null) {
      // Enter on the inner <a> itself follows the link, and its native click reaches the host's
      // click handler below, which emits pdsClick -- returning early here leaves that alone.
      // Safari leaves focus on the pds-link host after a mouse click, not its inner <a>, where
      // Enter would otherwise do nothing: an anchor only activates on Enter when it is itself the
      // focused element, not an ancestor of it. Forwarding the click to the real anchor instead
      // runs the browser's own navigation (hash, download, target), and still reaches the same
      // host click handler, so pdsClick still isn't emitted twice.
      if (event.composedPath()[0] !== this.innerAnchor()) this.innerAnchor()?.click();
      return;
    }

    event.preventDefault();
    this.handleClick();
  }

  render() {
    return (
      <Host id={this.componentId}
        class={{
          'is-disabled': this.disabled,
          'is-informational': this.informational,
          'destructive': !this.disabled && !this.informational && this.destructive
        }}
        onClick={this.handleClick}
        role="none"
        // ARIA ignores role="none" on focusable elements, so a focusable host would sit between
        // the menu and the informational menuitem as an unexpected child.
        tabIndex={this.informational ? null : -1}
        aria-disabled={this.disabled && !this.informational ? 'true' : null}
      >
          {this.renderElement()}
      </Host>
    );
  }
}
