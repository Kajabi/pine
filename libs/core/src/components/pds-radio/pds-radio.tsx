import { Component, Host, h, Prop, Event, EventEmitter } from '@stencil/core';
import { assignDescription, messageId } from '../../utils/form';
import { PdsLabel } from '../_internal/pds-label/pds-label';

@Component({
  tag: 'pds-radio',
  styleUrl: 'pds-radio.scss',
  scoped: true,
})
export class PdsRadio {
  /**
   * Determines whether or not the radio is checked.
   * @defaultValue false
   */
  @Prop() checked = false;

  /**
   * Determines whether or not the radio is disabled.
   * @defaultValue false
   */
  @Prop() disabled = false;

  /**
   * Determines whether or not the radio is invalid.
   * @defaultValue false
   */
  @Prop() invalid = false;

  /**
   * A unique identifier used for the underlying component `id` attribute and the label `for` attribute.
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
   * Determines whether or not the radio is required.
   * @defaultValue false
   */
  @Prop() required = false;

  /**
   * The value of the radio that is submitted with a form.
   */
  @Prop() value: string;

  /**
   * Emits a boolean indicating whether the checkbox is currently checked or unchecked.
   */
  @Event() pdsRadioChange: EventEmitter<boolean>;

  private handleRadioChange = (e: Event) => {
    if (this.disabled) {
      return;
    }

    const target = e.target as HTMLInputElement;
    const isChecked = target.checked;

    this.pdsRadioChange.emit(isChecked);
  }

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
          aria-describedby={assignDescription(this.componentId, this.invalid, this.helperMessage)}
          aria-invalid={this.invalid ? "true" : undefined}
          type="radio"
          id={this.componentId}
          name={this.name}
          value={this.value}
          checked={this.checked}
          required={this.required}
          disabled={this.disabled}
          onChange={this.handleRadioChange}
        />
        <PdsLabel htmlFor={this.componentId} text={this.label} />
        {this.helperMessage &&
          <div
            class={'pds-radio__message'}
            id={messageId(this.componentId, 'helper')}
          >
            {this.helperMessage}
          </div>}
      </Host>
    );
  }
}
