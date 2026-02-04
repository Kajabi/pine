import { Component, Element, Event, EventEmitter, h, Host, Method, Prop, State } from '@stencil/core';
import type { BasePdsProps } from '@utils/interfaces';
import { launch } from '@pine-ds/icons/icons';

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
  @Prop() href: string | undefined;

  /**
   * Determines whether the link should open in a new tab and display an external icon.
   * This is a simpler alternative to using `target="_blank"` for the common case.
   * @defaultValue false
   */
  @Prop({ reflect: true }) external: boolean = false;

  /**
   * Specifies where to open the linked document when href is provided.
   * Takes precedence over the `external` prop if both are set.
   * Only applies when href is set.
   * @defaultValue undefined
   */
  @Prop({ reflect: true }) target?: '_blank' | '_self' | '_parent' | '_top';

  /**
   * HTTP method to use for link navigation.
   * For non-GET methods (post, put, patch, delete), the component will handle
   * form submission internally. Also adds data-method and data-turbo-method
   * attributes to the internal anchor for framework integration.
   * Only applies when href is provided.
   * @defaultValue undefined (link navigates normally)
   */
  @Prop() httpMethod?: 'get' | 'post' | 'put' | 'patch' | 'delete';

  /**
   * Sets data-turbo-frame attribute on the internal anchor.
   * Useful for framework integration with frame-based navigation.
   * Only applies when href is provided.
   * @defaultValue undefined (no data-turbo-frame attribute)
   */
  @Prop() turboFrame?: string;

  /**
   * Sets data-turbo attribute on the internal anchor.
   * Useful for enabling or disabling framework-specific navigation handling.
   * Only applies when href is provided.
   * @defaultValue undefined (no data-turbo attribute)
   */
  @Prop() turbo?: boolean;

  /**
   * Emitted when the dropdown-item is clicked.
   *
   */
  @Event() pdsClick: EventEmitter<{itemIndex: number, item: HTMLPdsDropdownMenuItemElement, content: string}>;

  /**
   * Emitted before form submission for non-GET http methods.
   * Call event.preventDefault() to cancel the submission and handle it yourself.
   * Useful for custom confirmation dialogs or app-specific handling.
   */
  @Event({ cancelable: true }) pdsBeforeSubmit: EventEmitter<{ href: string; method: string }>;

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

  /**
   * Submits a request as a form, handling non-GET HTTP methods.
   * Creates a hidden form with CSRF token and _method field for proper
   * server-side handling of DELETE, PUT, and PATCH requests.
   */
  private submitAsForm() {
    if (!this.href) return;

    // Create a form element
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = this.href;
    form.style.display = 'none';

    // Add CSRF token if available
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (csrfToken) {
      const csrfInput = document.createElement('input');
      csrfInput.type = 'hidden';
      csrfInput.name = 'authenticity_token';
      csrfInput.value = csrfToken;
      form.appendChild(csrfInput);
    }

    // Add _method input for non-POST methods (DELETE, PUT, PATCH)
    if (this.httpMethod && this.httpMethod.toLowerCase() !== 'post') {
      const methodInput = document.createElement('input');
      methodInput.type = 'hidden';
      methodInput.name = '_method';
      methodInput.value = this.httpMethod.toLowerCase();
      form.appendChild(methodInput);
    }

    // Append form to body and submit
    document.body.appendChild(form);
    form.submit();
  }

  /**
   * Handles click on the internal anchor element.
   * Emits pdsClick, then handles form submission for non-GET methods.
   */
  private handleLinkClick = (event: MouseEvent) => {
    // IMPORTANT: Always call handleClick to emit pdsClick event
    // This ensures Stimulus patterns (data-action="pdsClick->...") keep working
    this.handleClick();

    // Only handle form submission for non-GET methods when httpMethod prop is explicitly set
    if (this.httpMethod && this.httpMethod.toLowerCase() !== 'get') {
      // Emit cancellable pdsBeforeSubmit event
      const beforeSubmitEvent = this.pdsBeforeSubmit.emit({
        href: this.href,
        method: this.httpMethod,
      });

      // Check if the event was cancelled (for custom confirmation dialogs, etc.)
      // Stencil's emit() returns the CustomEvent, we check defaultPrevented
      if (!beforeSubmitEvent.defaultPrevented) {
        // No one cancelled - proceed with form submission
        event.preventDefault();
        this.submitAsForm();
      } else {
        // Event was cancelled - app handles it (e.g., showing confirmation dialog)
        event.preventDefault();
      }
    }
    // Otherwise, let the link navigate normally (existing behavior)
  }

  private renderElement() {
    if (this.href !== undefined) {
      const targetValue = this.target || (this.external ? '_blank' : undefined);
      const relValue = targetValue === '_blank' ? 'noopener noreferrer' : undefined;

      // Build link attributes
      const linkAttrs: { [key: string]: string | number | boolean | undefined | null | ((e: MouseEvent) => void) | ((e: KeyboardEvent) => void) | (() => void) | { [key: string]: boolean } } = {
        href: this.disabled ? undefined : this.href,
        target: targetValue,
        rel: relValue,
        class: {
          'pds-dropdown-menu-item__content': true,
          'has-focus': this.hasFocus
        },
        tabIndex: this.disabled ? -1 : 0,
        onClick: this.handleLinkClick,
        onKeyDown: this.handleKeyDown,
        onFocus: this.handleFocus,
        onBlur: this.handleBlur,
        'aria-disabled': this.disabled ? 'true' : null,
      };

      // Add Rails/Turbo compatibility attributes ONLY when props are provided
      if (this.httpMethod) {
        linkAttrs['data-method'] = this.httpMethod;
        linkAttrs['data-turbo-method'] = this.httpMethod;
      }
      if (this.turboFrame) {
        linkAttrs['data-turbo-frame'] = this.turboFrame;
      }
      if (this.turbo !== undefined) {
        linkAttrs['data-turbo'] = this.turbo.toString();
      }

      return (
        <a {...linkAttrs}>
          <slot></slot>
          {this.external && <pds-icon icon={launch} size="sm"></pds-icon>}
        </a>
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
