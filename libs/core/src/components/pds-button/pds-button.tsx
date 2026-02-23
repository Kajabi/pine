import { Component, Element, Event, EventEmitter, Host, h, Listen, Prop, State } from '@stencil/core';
import { hasShadowDom } from '../../utils/utils';

import { caretDown, addCircle } from '@pine-ds/icons/icons';

/**
 * @part button - Exposes the button element for styling.
 * @part button-content - Exposes the button content for styling.
 * @part button-text - Exposes the button text for styling.
 * @part caret - Exposes the caret icon component for styling. Appears only on the disclosure variant.
 * @part icon - Exposes the icon component for styling.
 * @part loader-svg - Exposes the loader SVG element for color customization. Appears only when loading.
 * @slot (default) - Button text.
 * @slot start - Content to display before the button text.
 * @slot end - Content to display after the button text.
*/

@Component({
  tag: 'pds-button',
  styleUrls: ['pds-button.scss'],
  shadow: true,
})
export class PdsButton {
  @Element() el: HTMLPdsButtonElement;

  /**
   * A unique identifier used for the underlying component `id` attribute.
   */
  @Prop() componentId: string;

  /**
   * Prompts the user to save the linked URL instead of navigating to it.
   * Can be used without a value to download with the default filename,
   * or with a string value to suggest a specific filename for the download.
   * Only applies when href is set.
   */
  @Prop() download?: string;

  /**
   * Determines the button's disabled state.
   * @defaultValue false
   */
  @Prop() disabled? = false;

  /**
   * Determines if the button should take up the full width of its container.
   * @defaultValue false
   */
  @Prop() fullWidth? = false;

  /**
   * If provided, renders the component as an anchor (`<a>`) element instead of a button.
   * When using href, button-specific props (type, name, value, loading) will be ignored.
   */
  @Prop() href?: string;

  /**
   * Displays a leading icon in the button. DEPRECATED.
   * @defaultValue null
   * @deprecated Use `start` slot instead.
   */
  @Prop() icon?: string = null;

  /**
   * When true, displays only the icon and visually hides the text (keeping it accessible).
   */
  @Prop() iconOnly? = false;

  /**
   * Determines if the button is in a loading state.
   * When true, displays a loader and hides the button text.
   * @defaultValue false
   */
  @Prop() loading? = false;

  /**
   * Provides the button with a submittable name.
   */
  @Prop() name?: string;

  /**
   * Specifies where to open the linked document when href is provided.
   * Only applies when href is set.
   */
  @Prop() target?: '_blank' | '_self' | '_parent' | '_top';

  /**
   * Provides button with a type.
   * @defaultValue button
   */
  @Prop() type?: 'button' | 'reset' | 'submit' = 'button';

  /**
   * Provides button with a submittable value
   */
  @Prop() value?: string;

  /**
   * Sets the size of the button.
   * @defaultValue default
   */
  @Prop() size?: 'default' | 'small' | 'micro' = 'default';

  /**
   * Sets the style variant of the button.
   * @defaultValue primary
   */
  @Prop() variant: 'primary' | 'secondary' | 'tertiary' | 'accent' | 'disclosure' | 'destructive' | 'unstyled' | 'filter' = 'primary';

  @State() hasStartContent = false;
  @State() hasEndContent = false;

  @Event() pdsClick: EventEmitter<Event>;

  /**
   * Listen for Enter key presses on form inputs to trigger submit
   */
  @Listen('keydown', { target: 'body' })

  handleFormKeyDown(event: KeyboardEvent) {
    // Only handle Enter key for submit buttons that are not disabled
    if (event.key !== 'Enter' || this.type !== 'submit' || this.href || this.disabled) {
      return;
    }

    const target = event.target as Element;

    // Ensure event.target is an Element with matches method before proceeding
    if (!target || typeof target.matches !== 'function') {
      return;
    }
    const form = this.el.closest('form');

    // Check if the Enter key was pressed in a form input within the same form
    if (!form || !target || !form.contains(target)) {
      return;
    }

    // Check if target is a form input element (exclude reset buttons)
    const isFormInput = target.matches('input:not([type="submit"]):not([type="button"]):not([type="reset"])') ||
                       target.matches('pds-input') ||
                       target.matches('pds-select') ||
                       target.matches('pds-switch') ||
                       target.matches('pds-checkbox') ||
                       target.matches('pds-radio');

    if (isFormInput) {
      // Find all submit buttons in the form and check their actual properties
      const allSubmitButtons = Array.from(form.querySelectorAll('pds-button, button[type="submit"], input[type="submit"]'));
      const enabledSubmitButtons = allSubmitButtons.filter(button => {
        if (button.tagName.toLowerCase() === 'pds-button') {
          const pdsButton = button as HTMLPdsButtonElement;
          return pdsButton.type === 'submit' && !pdsButton.disabled;
        } else {
          return !button.hasAttribute('disabled');
        }
      });

      // Only synthesize click if this button is strictly the first enabled submit button
      if (enabledSubmitButtons.length > 0 && enabledSubmitButtons[0] === this.el) {
        event.preventDefault();
        this.el.click();
      }
    }
  }


  private handleStartSlotChange = (event: Event) => {
    this.hasStartContent = (event.target as HTMLSlotElement).assignedElements({ flatten: true }).length > 0;
  };

  private handleEndSlotChange = (event: Event) => {
    this.hasEndContent = (event.target as HTMLSlotElement).assignedElements({ flatten: true }).length > 0;
  };

  private handleClick = (ev: Event) => {
    if (this.loading) {
      ev.preventDefault();
      return;
    }

    // Prevent form submission for disabled buttons
    if (this.disabled) {
      ev.preventDefault();
      return;
    }

    if (!this.href && this.type != 'button') {
      // Handle form submission for Shadow DOM buttons
      if (hasShadowDom(this.el)) {
        const form = this.el.closest('form');
        if (form) {
          ev.preventDefault();

          const fakeButton = document.createElement('button');
          fakeButton.type = this.type;
          fakeButton.style.display = 'none';
          form.appendChild(fakeButton);
          fakeButton.click();
          fakeButton.remove();
        }
      }
    }
    this.pdsClick.emit(ev);
  };

  private classNames() {
    const classNames = ['pds-button'];

    if (this.variant) {
      classNames.push('pds-button--' + this.variant);
    }

    if (this.size && this.size !== 'default') {
      classNames.push('pds-button--' + this.size);
    }

    if (this.iconOnly) {
      classNames.push('pds-button--icon-only');
    }

    if (this.loading) {
      classNames.push('pds-button--loading');
    }

    return classNames.join(' ');
  }

  private renderStartContent() {
    if (this.variant === 'filter') {
      return (
        <pds-icon class={this.loading ? 'pds-button__icon--hidden' : ''} icon={addCircle} part="icon" aria-hidden="true"></pds-icon>
      );
    }

    // Deprecated icon prop still takes precedence over start slot
    const hasIcon = this.icon && this.variant !== 'disclosure';
    if (Boolean(hasIcon)) {
      return (
        <pds-icon class={this.loading ? 'pds-button__icon--hidden' : ''} name={this.icon} part="icon" aria-hidden="true"></pds-icon>
      );
    }

    // Always render the start slot so slotted content is projected reliably.
    // The --empty class hides the wrapper when no content is slotted (prevents empty gap space).
    const startClasses = `pds-button__icon${this.hasStartContent ? '' : ' pds-button__icon--empty'}${this.loading ? ' pds-button__icon--hidden' : ''}`;
    return <span class={startClasses}><slot name="start" onSlotchange={this.handleStartSlotChange} /></span>;
  }

  private renderEndContent() {
    if (this.iconOnly) {
      return null;
    }

    if (this.variant === 'disclosure') {
      return (
        <pds-icon class={this.loading ? 'pds-button__icon--hidden' : ''} icon={caretDown} part="caret" aria-hidden="true"></pds-icon>
      );
    }

    // Always render the end slot so slotted content is projected reliably.
    // The --empty class hides the wrapper when no content is slotted (prevents empty gap space).
    const endClasses = `pds-button__icon${this.hasEndContent ? '' : ' pds-button__icon--empty'}${this.loading ? ' pds-button__icon--hidden' : ''}`;
    return <span class={endClasses}><slot name="end" onSlotchange={this.handleEndSlotChange} /></span>;
  }

  render() {
    // Common props for both button and anchor elements
    const commonProps = {
      class: this.classNames(),
      part: 'button',
    };

    const attributes = () => {
      if (this.href) {
        return {
          // Anchor element props
          ...commonProps,
          download: this.download,
          href: this.disabled ? null : this.href,
          target: this.target,
        };
      }

      return {
        // Button element props
        ...commonProps,
        'aria-busy': this.loading ? 'true' : null,
        'aria-live': this.loading ? 'polite' : null,
        'disabled': this.disabled,
        'name': this.name,
        'type': this.type,
        'value': this.value,
      };
    };

    const ContentElement = this.href ? 'a' : 'button';

    // Hide text when loading or iconOnly is true
    const hideText = this.loading || this.iconOnly;

    const content = (
      <div class="pds-button__content" part="button-content">
        {this.renderStartContent()}

        <span class={`pds-button__text ${hideText ? 'pds-button__text--hidden' : ''}`} part="button-text">
          <slot />
        </span>

        {this.loading && (
          <span class="pds-button__loader">
            <pds-loader is-loading={true} size="var(--pine-font-size-body-2xl)" variant="spinner" exportparts="loader-svg">
              Loading...
            </pds-loader>
          </span>
        )}

        {this.renderEndContent()}
      </div>
    );

    return (
      <Host
        aria-disabled={this.disabled ? 'true' : null}
        id={this.componentId}
        onClick={this.handleClick}
        variant={this.variant}
      >
        <ContentElement {...attributes()}>
          {content}
        </ContentElement>
      </Host>
    );
  }
}
