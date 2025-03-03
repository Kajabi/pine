import { Component, Host, h, Prop, Event, EventEmitter } from '@stencil/core';
import { assignDescription, messageId } from '../../utils/form';
import { danger } from '@pine-ds/icons/icons';

@Component({
  tag: 'pds-radio',
  styleUrls: ['../../global/styles/utils/label.scss', 'pds-radio.scss'],
  scoped: true,
})
export class PdsRadio {
  /**
   * Determines whether or not the radio is checked.
   * @defaultValue false
   */
  @Prop() checked = false;

  /**
   * A unique identifier used for the underlying component `id` attribute and the label `for` attribute.
   */
  @Prop() componentId!: string;

  /**
   * Determines whether or not the radio is disabled.
   * @defaultValue false
   */
  @Prop() disabled = false;

  /**
   * Displays error message text describing an invalid state.
   */
  @Prop() errorMessage: string;

  /**
   * Displays helper message text below radio.
   */
  @Prop() helperMessage: string;

    /**
   * Determines whether or not the radio is invalid.
   * @defaultValue false
   */
    @Prop() invalid = false;

  /**
   * String used for label text next to radio.
   */
  @Prop() label: string;

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
        <label htmlFor={this.componentId}>
          {this.label}
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
        </label>
        {this.helperMessage &&
          <div
            class={'pds-radio__message'}
            id={messageId(this.componentId, 'helper')}
          >
            {this.helperMessage}
          </div>
        }
        {this.errorMessage &&
          <div
            class={`pds-radio__message pds-radio__message--error`}
            id={messageId(this.componentId, 'error')}
            aria-live="assertive"
          >
            <pds-icon icon={danger} size="small" />
            {this.errorMessage}
          </div>
        }
      </Host>
    );
  }
}
