import { Component, Element, Host, h, Prop } from '@stencil/core';
import { hasShadowDom } from '../../utils/utils';

@Component({
  tag: 'pds-button',
  styleUrl: 'pds-button.scss',
  shadow: true,
})
export class PdsButton {
  @Element() el: HTMLPdsButtonElement;

  /**
   * Sets button variant styles as outlined in Figma documentation
    */
  @Prop() variant: 'primary' | 'secondary' | 'accent' | 'disclosure' | 'destructive' | 'unstyled'  = 'primary';

  /**
   * Displays icon before text when icon string matches an icon name
   */
  @Prop() icon?: string = null;

  /**
   * Toggles disabled state of button
   * @defaultValue false
   */
  @Prop() disabled? = false;

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

  private buttonClassNames = () => {
    let className = `pds-button`;
    if (this.variant && this.variant != 'primary') {
      const variantClassName = `pds-button--${this.variant}`;
      className += ' ' + variantClassName;
    }
    return className;
  };

  render() {
    const trashIcon = (
      <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
        <path d="M5.333 0a.667.667 0 0 0-.666.667v2h-4A.667.667 0 1 0 .667 4h14.666a.667.667 0 1 0 0-1.333h-4v-2A.667.667 0 0 0 10.667 0H5.333ZM10 2.667V1.333H6v1.334h4Z" />
        <path d="M2.667 5.333c.368 0 .666.299.666.667v8a.667.667 0 0 0 .667.667h8a.667.667 0 0 0 .667-.667V6A.667.667 0 1 1 14 6v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6c0-.368.298-.667.667-.667Z" />
        <path d="M10.471 7.519c.26.26.26.682 0 .942L8.943 9.99l1.528 1.529a.667.667 0 1 1-.942.942L8 10.933 6.471 12.46a.667.667 0 0 1-.942-.942L7.057 9.99 5.53 8.461a.667.667 0 1 1 .942-.942L8 9.047 9.529 7.52c.26-.26.682-.26.942 0Z" />
      </svg>
    );

    return (
      <Host variant={this.variant} aria-disabled={this.disabled ? 'true' : null} onClick={this.handleClick}>
        <button class={this.buttonClassNames()} disabled={this.disabled} type={this.type} name={this.name} value={this.value} >
          {this.icon == 'trashIcon' && trashIcon}
          <slot />
        </button>
      </Host>
    );
  }
}
