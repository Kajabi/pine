import { Component, Element, Event, EventEmitter, Host, h, Prop } from '@stencil/core';
import { hasShadowDom } from '../../utils/utils';

import { caretDown } from '@pine-ds/icons/icons';

/**
 * @part button - Exposes the button element for styling.
 * @part caret - Exposes the caret icon component for styling. Appears only on the disclosure variant.
 * @part icon - Exposes the icon component for styling.
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
   * Displays an icon before the text when
   * the icon string matches an icon name.
   * @defaultValue null
   */
  @Prop() icon?: string = null;

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
   * Provides button with a submittable value
   */
  @Prop() value?: string;

  /**
   * Provides button with a type.
   * @defaultValue button
   */
  @Prop() type?: 'button' | 'reset' | 'submit' = 'button';

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

    if (this.type != 'button') {
      // If button clicked IS NOT associated with a form
      if (hasShadowDom(this.el)) {
        const form = this.el.closest('form')
        if (form) {
          ev.preventDefault()

          const fakeButton = document.createElement('button')
          fakeButton.type = this.type
          fakeButton.style.display = 'none'
          form.appendChild(fakeButton)
          fakeButton.click()
          fakeButton.remove()
        }
      }
    }
    this.pdsClick.emit(ev);
  }

  private classNames() {
    const classNames = ['pds-button'];

    if (this.variant) {
      classNames.push('pds-button--' + this.variant);
    }

    if (this.fullWidth) {
      classNames.push('pds-button--full-width');
    }

    if (this.loading) {
      classNames.push('pds-button--loading');
    }

    return classNames.join('  ');
  }

  render() {
    return (
      <Host
        aria-busy={this.loading ? 'true' : 'false'}
        aria-disabled={this.disabled ? 'true' : null}
        aria-live={this.loading ? 'polite' : null}
        id={this.componentId}
        onClick={this.handleClick}
        variant={this.variant}
      >
        <button
          class={this.classNames()}
          disabled={this.disabled}
          name={this.name}
          part="button"
          type={this.type}
          value={this.value}
        >
          <div class="pds-button__content">
            {this.icon && this.variant !== 'disclosure' &&
              <pds-icon
                class={this.loading ? 'pds-button__icon--hidden' : ''}
                name={this.icon}
                part="icon"
              ></pds-icon>
            }

            <span class={`pds-button__text ${this.loading ? 'pds-button__text--hidden' : ''}`}>
              <slot />
            </span>

            {this.loading &&
              <span class="pds-button__loader">
                <pds-loader
                  is-loading={true}
                  part="loader"
                  size="var(--pine-font-size)"
                  variant="spinner"
                >
                  Loading...
                </pds-loader>
              </span>
            }

            {this.variant === 'disclosure' &&
              <pds-icon
                class={this.loading ? 'pds-button__icon--hidden' : ''}
                icon={caretDown}
                part="caret"
              ></pds-icon>
            }
          </div>
        </button>
      </Host>
    );
  }
}
