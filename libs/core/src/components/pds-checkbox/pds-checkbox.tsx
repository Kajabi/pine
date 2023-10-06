import { Component, h, Prop, Host, Event, EventEmitter } from '@stencil/core';
import { assignDescription, messageId } from '../../utils/form';
import { PdsLabel } from '../_internal/pds-label/pds-label';

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
   * A unique identifier used for the underlying component `id` attribute and the label `for` attribute.
   */
  @Prop() componentId!: string;

  /**
   * It determines whether or not the checkbox is disabled.
   */
  @Prop() disabled: boolean;

  /**
   * Displays message text describing an invalid state.
   */
  @Prop() errorMessage: string;

  /**
   * String used for helper message below checkbox.
   */
  @Prop() helperMessage: string;

  /**
   * If `true`, the checkbox will visually appear as indeterminate.
   * Only JavaScript can set the objects `indeterminate` property. See [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox#indeterminate_state_checkboxes).
   */
  @Prop() indeterminate: boolean;

  /**
   * It determines whether or not the checkbox is invalid.
   */
  @Prop() invalid: boolean;

  /**
   * String used for label text next to checkbox.
   */
  @Prop() label: string;

  /**
   * String used for checkbox `name` attribute.
   */
  @Prop() name: string;

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
          aria-describedby={assignDescription(this.componentId, this.invalid, this.helperMessage)}
          aria-invalid={this.invalid ? "true" : undefined}
          type="checkbox"
          id={this.componentId}
          name={this.name}
          value={this.value}
          checked={this.checked}
          required={this.required}
          disabled={this.disabled}
          onChange={this.handleCheckboxChange}
        />
        <PdsLabel htmlFor={this.componentId} text={this.label} />
        {this.helperMessage &&
          <div
            class={'pds-checkbox__message'}
            id={messageId(this.componentId, 'helper')}
          >
            {this.helperMessage}
          </div>
        }
        {this.errorMessage &&
          <div
            class={`pds-checkbox__message pds-checkbox__message--error`}
            id={messageId(this.componentId, 'error')}
            aria-live="assertive"
          >
            {this.errorMessage}
          </div>
        }
      </Host>
    );
  }
}
