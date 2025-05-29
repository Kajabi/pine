import { Component, Element, Event, EventEmitter, Host, h, Method, Prop } from '@stencil/core';
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
   */
  @Prop() href: string;

  /**
   * Emitted when the dropdown-item is clicked.
   *
   * @type {EventEmitter<{itemIndex: number, item: HTMLPdsDropdownMenuItemElement, content: string}>}
   * @memberof PdsDropdownMenuItem
   */
  @Event() pdsClick: EventEmitter<{itemIndex: number, item: HTMLPdsDropdownMenuItemElement, content: string}>;

  /**
   * Trigger the click event
   */
  @Method()
  async clickItem() {
    this.handleClick();
  };


  handleClick() {
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

  private renderElement() {
    if (this.href) {
      return (
        <a href={this.href} class="pds-dropdown-menu-item__content" tabIndex={-1}>
          <slot></slot>
        </a>
      );
    }

    return (
      <button class="pds-dropdown-menu-item__content" tabIndex={-1}>
        <slot></slot>
      </button>
    );
  }

  private handleKeyDown = (event: KeyboardEvent) => {
    // Handle keyboard events
    if (!this.disabled && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      this.handleClick();
    }
  }

  render() {
    return (
      <Host id={this.componentId}
        class={{ 'is-disabled': this.disabled, 'destructive': !this.disabled && this.destructive }}
        onClick={() => !this.disabled && this.handleClick()}
        onKeyDown={this.handleKeyDown}
        tabIndex={this.disabled ? -1 : 0}
        role="menuitem"
      >
          {this.renderElement()}
      </Host>
    );
  }
}
