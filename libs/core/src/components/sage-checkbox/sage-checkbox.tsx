import { Component, h, Prop, Host } from '@stencil/core';

@Component({
  tag: 'sage-checkbox',
  styleUrl: 'sage-checkbox.scss',
  shadow: true,
})
export class SageCheckbox {
  /**
   * Whether or not the checkbox is checked.
   */
  @Prop() checked: boolean;

  /**
   * Whether or not the checkbox is disabled.
   */
  @Prop() disabled: boolean;

  /**
   * Whether or not the checkbox is invalid.
   */
  @Prop() error: boolean;

  /**
   * String used for checkbox `id` attribute and label `for` attribute.
   */
  @Prop() checkboxId: string;

  /**
   * String used for label text next to checkbox
   */
  @Prop() label: string;

  /**
   * String used for message below checkbox
   */
  @Prop() message: string;

  /**
   * String used for checkbox `name` attribute.
   */
  @Prop() name: string;

  /**
   * Whether or not checkbox should display as indeterminate. Prop is for visual styling only.
   * Only JavaScript can set the objects `indeterminate` property. See [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox#indeterminate_state_checkboxes)
   */
  @Prop() indeterminate: boolean;

  /**
   * Whether or not the checkbox is required.
   */
  @Prop() required: boolean;

  /**
   * The value of the checkbox that is submitted with a form.
   */
  @Prop() value: string;

  private classNames() {
    let className = `sage-checkbox`;

    if (this.error) {
      const errorClassName = 'sage-checkbox--error';
      className += ' ' + errorClassName;
    }

    if (this.indeterminate) {
      const indeterminateClassName = 'sage-checkbox--indeterminate';
      className += ' ' + indeterminateClassName;
    }

    return className;
  }

  render() {
    let message;

    if (this.message) {
      message = <div class={'sage-checkbox__message'}>{this.message}</div>;
    }

    return (
      <Host>
        <div class={this.classNames()}>
          <input
            type="checkbox"
            id={this.checkboxId}
            name={this.name}
            value={this.value}
            checked={this.checked}
            required={this.required}
            disabled={this.disabled}
          />
          <label htmlFor={this.checkboxId}>{this.label}</label>
          {message}
        </div>
      </Host>
    );
  }
}
