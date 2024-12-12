import { Component, Event, EventEmitter, h, Host, Prop } from '@stencil/core';
import { assignDescription, messageId } from '../../utils/form';
import { PdsLabel } from '../_internal/pds-label/pds-label';
import { danger } from '@pine-ds/icons/icons';

@Component({
  tag: 'pds-input',
  styleUrls: ['../../global/styles/base.scss', 'pds-input.scss'],
  shadow: true,
})
export class PdsInput {

  /**
   * Specifies if and how the browser provides `autocomplete` assistance for the field.
   */
  @Prop() autocomplete: string;

  /**
   * A unique identifier used for the underlying component `id` attribute.
   */
  @Prop() componentId!: string;

  /**
   * Indicates whether or not the input field is disabled.
   */
  @Prop() disabled?: boolean;

  /**
   * Specifies the error message and provides an error-themed treatment to the field.
   */
  @Prop() errorMessage?: string;

  /**
   * Displays a message or hint below the input field.
   */
  @Prop() helperMessage?: string;

  /**
   * Indicates whether or not the input field is invalid or throws an error.
   */
  @Prop() invalid?: boolean;

  /**
   * Text to be displayed as the input label.
   */
  @Prop() label?: string;

  /**
   * Specifies the name. Submitted with the form name/value pair.
   */
  @Prop() name?: string;

  /**
   * Specifies a short hint that describes the expected value of the input field.
   */
  @Prop() placeholder?: string;

  /**
   * Indicates whether or not the input field is readonly.
   */
  @Prop() readonly?: boolean;

  /**
   * Indicates whether or not the input field is required.
   */
  @Prop() required?: boolean;

  /**
   * Determines the type of control that will be displayed
   `'email'`, `'number'`, `'password'`, `'tel'`, `'text'`
   * @defaultValue "text"
   */
  @Prop() type = 'text';

  /**
   * The value of the input.
   */
  @Prop({mutable: true}) value?: string;

  /**
   * Emitted when a keyboard input occurs.
   */
  @Event() pdsInput: EventEmitter<InputEvent>;

  private onInputEvent = (ev: Event) => {
    const input = ev.target as HTMLInputElement | null;
    if (input) {
      this.value = input.value || '';
    }
    this.pdsInput.emit(ev as InputEvent);
  };

  render() {
    return (
      <Host
        aria-disabled={this.disabled ? 'true' : null}
      >
        <div class="pds-input">
          <PdsLabel htmlFor={this.componentId} text={this.label} />
          <input class="pds-input__field"
            aria-describedby={assignDescription(this.componentId, this.invalid, this.helperMessage)}
            aria-invalid={this.invalid ? "true" : undefined}
            autocomplete={this.autocomplete}
            disabled={this.disabled}
            id={this.componentId}
            name={this.name}
            placeholder={this.placeholder}
            readOnly={this.readonly}
            required={this.required}
            type={this.type}
            value={this.value}
            onInput={this.onInputEvent}
          />
          {this.helperMessage &&
            <p
              class="pds-input__helper-message"
              id={messageId(this.componentId, 'helper')}
            >
              {this.helperMessage}
            </p>
          }
          {this.errorMessage &&
            <p
              class="pds-input__error-message"
              id={messageId(this.componentId, 'error')}
              aria-live="assertive"
            >
              <pds-icon icon={danger} size="small" />
              {this.errorMessage}
            </p>
          }
        </div>
      </Host>
    );
  }
}
