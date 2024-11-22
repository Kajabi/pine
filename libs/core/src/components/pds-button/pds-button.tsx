import { Component, Element, Host, h, Prop } from '@stencil/core';
import { hasShadowDom } from '../../utils/utils';

import { caretDown } from '@pine-ds/icons/icons';

/**
 * @part button - The main button element that represents the button component.
 * @part caret - The caret icon element that appears when the button variant is 'disclosure'.
 * @part icon - The icon element that appears before the text in the button, if provided.
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
   * Toggles disabled state of button
   * @defaultValue false
   */
  @Prop() disabled? = false;

  /**
   * Displays icon before text when icon string matches an icon name
   */
  @Prop() icon?: string = null;

  /**
   * Provides button with a submittable name
   */
  @Prop() name?: string;

  /**
   * Provides button with a submittable value
   */
  @Prop() value?: string;

  /**
   * Provides button with a type
   * @defaultValue button
   */
  @Prop() type?: 'button' | 'reset' | 'submit' = 'button';

  /**
   * Sets button variant styles as outlined in Figma documentation
   */
  @Prop() variant: 'primary' | 'secondary' | 'accent' | 'disclosure' | 'destructive' | 'unstyled' = 'primary';

  private handleClick = (ev: Event) => {
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
  }

  private classNames() {
    const classNames = ['pds-button'];

    if (this.variant) {
      classNames.push('pds-button--' + this.variant);
    }

    return classNames.join('  ');
  }

  render() {
    return (
      <Host
        aria-disabled={this.disabled ? 'true' : null}
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
          {this.icon && this.variant !== 'disclosure' && <pds-icon name={this.icon} part="icon"></pds-icon>}
          <slot />
          {this.variant === 'disclosure' && <pds-icon icon={caretDown} part="caret"></pds-icon>}
        </button>
      </Host>
    );
  }
}
