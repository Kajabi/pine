import { Component, h, Prop, Host, Event, EventEmitter } from '@stencil/core';

@Component({
  tag: 'pds-checkbox',
  styleUrl: 'pds-checkbox.scss',
  shadow: true,
})
export class PdsCheckbox {
  /**
   * It determines whether or not the checkbox is checked.
   */
  @Prop() checked: boolean;

  /**
   * It determines whether or not the checkbox is disabled.
   */
  @Prop() disabled: boolean;

  /**
   * It determines whether or not the checkbox is invalid.
   */
  @Prop() invalid: boolean;

  /**
   * String used for checkbox `id` attribute and label `for` attribute.
   */
  @Prop() componentId: string;

  /**
   * String used for label text next to checkbox.
   */
  @Prop() label: string;

  /**
   * String used for helper message below checkbox.
   */
  @Prop() helperMessage: string;

  /**
   * String used for checkbox `name` attribute.
   */
  @Prop() name: string;

  /**
   * If `true`, the checkbox will visually appear as indeterminate.
   * Only JavaScript can set the objects `indeterminate` property. See [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox#indeterminate_state_checkboxes).
   */
  @Prop() indeterminate: boolean;

  /**
   * It determines whether or not the checkbox is required.
   */
  @Prop() required: boolean;

  /**
   * The value of the checkbox that is submitted with a form.
   */
  @Prop() value: string;

  /**
   * Emits a boolean indicating whether the checkbox is currently checked or unchecked.
   */
  @Event() pdsCheckboxChange: EventEmitter<boolean>;

  private handleCheckboxChange = (e: Event) => {
    if (this.disabled) {
      return;
    }

    const target = e.target as HTMLInputElement;
    const isChecked = target.checked;

    this.pdsCheckboxChange.emit(isChecked);
  }

  private classNames() {
    const classNames = [];

    if (this.invalid) { classNames.push('is-invalid'); }
    if (this.indeterminate) { classNames.push('is-indeterminate'); }
    if (this.disabled) { classNames.push('is-disabled'); }

    return classNames.join('  ');
  }

  render() {
    return (
      <Host class={this.classNames()}>
        <input
          type="checkbox"
          id={this.componentId}
          name={this.name}
          value={this.value}
          checked={this.checked}
          required={this.required}
          disabled={this.disabled}
          onChange={this.handleCheckboxChange}
        />
        <label htmlFor={this.componentId}>{this.label}</label>
        {this.helperMessage && <div class={'pds-checkbox__message'}>{this.helperMessage}</div>}
      </Host>
    );
  }
}
