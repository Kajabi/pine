import { Component, Element, Event, EventEmitter, h, Host, Method, Prop, State } from '@stencil/core';
import type { BasePdsProps } from '@utils/interfaces';

/**
 * @slot (default) - The item's label.
 * @slot start - Content to display before the item's label, such as a `pds-icon`. A `pds-icon` without an `aria-label` is decorative, so screen readers announce only the label.
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
   * Determines whether the link should open in a new tab and display an external icon.
   * This is a simpler alternative to using `target="_blank"` for the common case.
   * Ignored when `informational` is set.
   * @defaultValue false
   */
  @Prop({ reflect: true }) external: boolean = false;

  /**
   * Accessible label for the external-link icon, passed to the inner
   * `pds-link`. Pass a translated string to localize it; defaults to English.
   * Pass an empty string to make the icon decorative.
   * @defaultValue '(opens in a new tab)'
   */
  @Prop() externalLabel?: string;

  /**
   * Specifies where to open the linked document when href is provided.
   * Takes precedence over the `external` prop if both are set.
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
    const menuItems = Array.from(this.host.parentNode.children).filter(
      (child) => child.tagName.toLowerCase() === 'pds-dropdown-menu-item'
    );
    const itemIndex = menuItems.indexOf(this.host);

    // Get the text content from the slotted content
    const content = this.host.textContent?.trim() || '';

    this.pdsClick.emit({
      itemIndex,
      item: this.host,
      content
    });
  };

  @State() hasFocus: boolean = false;

  @State() hasStartContent = false;

  componentWillLoad() {
    // Seeded from the light DOM so the first render has no empty gap, before slotchange fires.
    this.hasStartContent = Array.from(this.host.children).some((child) => child.getAttribute('slot') === 'start');
  }

  private handleStartSlotChange = (event: Event) => {
    this.hasStartContent = (event.target as HTMLSlotElement).assignedElements({ flatten: true }).length > 0;
  }

  // Always render the start slot so slotted content is projected reliably.
  // The --empty class hides the wrapper when nothing is slotted, so it adds no gap.
  private renderContent() {
    return [
      <span
        class={{
          'pds-dropdown-menu-item__start': true,
          'pds-dropdown-menu-item__start--empty': !this.hasStartContent
        }}
      >
        <slot name="start" onSlotchange={this.handleStartSlotChange}></slot>
      </span>,
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

  private handleKeyDown = (event: KeyboardEvent) => {
    // Handle keyboard events
    if (!this.disabled && (event.key === 'Enter')) {
      // Only prevent default for button elements or Space key
      // For links with Enter key, we want the default navigation behavior
      if (!this.href) {
        event.preventDefault();
      }
      this.handleClick();
    }
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
