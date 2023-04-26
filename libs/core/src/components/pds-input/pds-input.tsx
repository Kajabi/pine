import { Component, Event, EventEmitter, h, Host, Prop } from '@stencil/core';
import { assignDescription, messageId } from '../../utils/form';

/**
 * @slot - Content is placed between the opening closing tags
 */
@Component({
  tag: 'pds-input',
  styleUrl: 'pds-input.scss',
  shadow: true,
})
export class PdsInput {
  /**
   * A unique identifier for the input field
   */
  @Prop() componentId!: string;

  /**
   * Indicates whether or not the input field is disabled
   */
  @Prop() disabled?: boolean;

  /**
   * Specifies the error text and provides an error-themed treatment to the field
   */
  @Prop() errorText?: string;

  /**
   * Displays a hint or description of the input field
   */
  @Prop() hint?: string;

  /**
   * Indicates whether or not the input field is invalid or throws an error
   */
  @Prop() invalid?: boolean;

  /**
   * Text to be displayed as the input label
   */
  @Prop() label?: string;

  /**
   * Specifies the name. Submitted with the form name/value pair
   */
  @Prop() name?: string;

  /**
   * Specifies a short hint that describes the expected value of the input field
   */
  @Prop() placeholder?: string;

  /**
   * Indicates whether or not the input field is readonly
   */
  @Prop() readonly?: boolean;

  /**
   * Indicates whether or not the input field is required
   */
  @Prop() required?: boolean;

  /**
   * Determines the type of control that will be displayed
   `'email'`, `'number'`, `'password'`, `'tel'`, `'text'`
   * @defaultValue "text"
   */
  @Prop() type = 'text';

  /**
   * The value of the input
   */
  @Prop({mutable: true}) value?: string;

  /**
   * Emitted when a keyboard input occurred
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
          <label htmlFor={this.componentId}>{this.label}</label>
          <input class="pds-input__field"
            aria-describedby={assignDescription(this.componentId, this.invalid, this.hint)}
            aria-invalid={this.invalid ? "true" : undefined}
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
          {this.hint &&
            <p
              class="pds-input__hint"
              id={messageId(this.componentId, 'helper')}
            >
              {this.hint}
            </p>
          }
          {this.errorText &&
            <p
              class="pds-input__error-text"
              id={messageId(this.componentId, 'error')}
              aria-live="assertive"
            >
              {this.errorText}
            </p>
          }
        </div>
      </Host>
    );
  }
}