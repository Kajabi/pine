import { Component, Element, Event, EventEmitter, h, Host, Method, Prop, State } from '@stencil/core';
import type { BasePdsProps } from '@utils/interfaces';

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
   * It determines whether or not the dropdown-item is destructive.
   * @defaultValue false
   */
  @Prop() destructive: boolean = false;

  /**
   * It determines whether or not the dropdown-item is disabled.
   * @defaultValue false
   */
  @Prop() disabled: boolean = false;


  /**
   *  If provided, renders the dropdown-item as an anchor (`<a>`) element instead of a button.
   *  @example
   *  <pds-dropdown-menu-item href="/dashboard">Dashboard</pds-dropdown-menu-item>
   */
  @Prop() href: string | undefined;

  /**
   * Determines whether the link should open in a new tab and display an external icon.
   * This is a simpler alternative to using `target="_blank"` for the common case.
   * @defaultValue false
   * @example
   * <pds-dropdown-menu-item href="https://example.com" external>External Link</pds-dropdown-menu-item>
   */
  @Prop() external: boolean = false;

  /**
   * Specifies where to open the linked document when href is provided.
   * Takes precedence over the `external` prop if both are set.
   * Only applies when href is set.
   * @defaultValue undefined
   * @example
   * <pds-dropdown-menu-item href="https://example.com" target="_blank">External Link</pds-dropdown-menu-item>
   */
  @Prop() target?: '_blank' | '_self' | '_parent' | '_top';

  /**
   * Emitted when the dropdown-item is clicked.
   *
   */
  @Event() pdsClick: EventEmitter<{itemIndex: number, item: HTMLPdsDropdownMenuItemElement, content: string}>;

  /**
   * Trigger the click event
   */
  @Method()
  async clickItem() {
    this.handleClick();
  };


  private handleClick() {
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
  }

  @State() hasFocus: boolean = false;

  private handleFocus = () => {
    this.hasFocus = true;
  }

  private handleBlur = () => {
    this.hasFocus = false;
  }

  private renderElement() {
    if (this.href !== undefined) {
      return (
        <pds-link
          href={this.disabled ? null : this.href}
          external={this.external}
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
          <slot></slot>
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
        onKeyDown={this.handleKeyDown}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        disabled={this.disabled}
        aria-disabled={this.disabled ? 'true' : null}
      >
        <slot></slot>
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
        class={{ 'is-disabled': this.disabled, 'destructive': !this.disabled && this.destructive }}
        onClick={() => !this.disabled && this.handleClick()}
        role="none"
        tabIndex={-1}
        aria-disabled={this.disabled ? 'true' : null}
      >
          {this.renderElement()}
      </Host>
    );
  }
}
