import { Component, Element, Event, EventEmitter, Host, h, Prop } from '@stencil/core';
import { hasShadowDom } from '../../utils/utils';

import { caretDown } from '@pine-ds/icons/icons';

/**
 * @part button - Exposes the button element for styling.
 * @part button-content - Exposes the button content for styling.
 * @part button-text - Exposes the button text for styling.
 * @part caret - Exposes the caret icon component for styling. Appears only on the disclosure variant.
 * @part icon - Exposes the icon component for styling.
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
   * Sets the style variant of the button.
   * @defaultValue primary
   */
  @Prop() variant: 'primary' | 'secondary' | 'accent' | 'disclosure' | 'destructive' | 'unstyled' = 'primary';

  @Event() pdsClick: EventEmitter;

  private handleClick = (ev: Event) => {
    if (this.loading) {
      ev.preventDefault();
      return;
    }

    if (!this.href && this.type != 'button') {
      // If button clicked IS NOT associated with a form
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

    if (this.iconOnly) {
      classNames.push('pds-button--icon-only');
    }

    if (this.loading) {
      classNames.push('pds-button--loading');
    }

    return classNames.join(' ');
  }

  private hasSlotContent(slotName: string): boolean {
    const elements = this.el.querySelectorAll(`[slot="${slotName}"]`);
    return elements.length > 0;
  }

  private renderStartContent() {
    const hasIcon = this.icon && this.variant !== 'disclosure';
    const hasStartSlot = this.hasSlotContent('start');

    if (Boolean(hasIcon)) {
      return (
        <pds-icon class={this.loading ? 'pds-button__icon--hidden' : ''} name={this.icon} part="icon" aria-hidden="true"></pds-icon>
      );
    } else if (Boolean(hasStartSlot)) {
      return <span class={`pds-button__icon ${this.loading ? 'pds-button__icon--hidden' : ''}`}><slot name="start" /></span>;
    }

    return null;
  }

  private renderEndContent() {
    if (this.iconOnly) {
      return null;
    }

    if (this.variant === 'disclosure') {
      return (
        <pds-icon class={this.loading ? 'pds-button__icon--hidden' : ''} icon={caretDown} part="caret" aria-hidden="true"></pds-icon>
      );
    } else if (this.hasSlotContent('end')) {
      return <span class={`pds-button__icon ${this.loading ? 'pds-button__icon--hidden' : ''}`}><slot name="end" /></span>;
    }

    return null;
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
            <pds-loader is-loading={true} size="var(--pine-font-size-body-2xl)" variant="spinner">
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
