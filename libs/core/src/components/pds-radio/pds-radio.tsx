import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'pds-radio',
  styleUrl: 'pds-radio.scss',
  shadow: true,
})
export class PdsRadio {
  /**
   * Determines whether or not the radio is checked.
   */
  @Prop() checked: boolean;

  /**
   * Determines whether or not the radio is disabled.
   */
  @Prop() disabled: boolean;

  /**
   * It determines whether or not the radio is invalid.
   */
  @Prop() invalid: boolean;

  /**
   * String used for radio `id` attribute and label `for` attribute.
   */
  @Prop() componentId: string;

  /**
   * String used for label text next to radio.
   */
  @Prop() label: string;

  /**
   * String used for helper message below radio.
   */
  @Prop() helperMessage: string;

  /**
   * String used for radio `name` attribute.
   */
  @Prop() name: string;

  /**
   * It determines whether or not the radio is required.
   */
  @Prop() required: boolean;

  /**
   * The value of the radio that is submitted with a form.
   */
  @Prop() value: string;

  private classNames() {
    const classNames = [];

    if (this.invalid) {
      classNames.push('is-invalid');
    }
    if (this.disabled) {
      classNames.push('is-disabled');
    }

    return classNames.join('  ');
  }

  render() {
    return (
      <Host class={this.classNames()}>
        <input
          type="radio"
          id={this.componentId}
          name={this.name}
          value={this.value}
          checked={this.checked}
          required={this.required}
          disabled={this.disabled}
          // onChange={(event) => this.handleRadioChange(event)}
        />
        <label htmlFor={this.componentId}>{this.label}</label>
        {this.helperMessage && <div class={'sage-radio__message'}>{this.helperMessage}</div>}
      </Host>
    );
  }
}
