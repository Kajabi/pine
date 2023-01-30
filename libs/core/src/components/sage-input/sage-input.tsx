import { Component, Event, EventEmitter, h, Host, Prop } from '@stencil/core';

/**
 * @slot - Content is placed between the opening closing tags
 */
@Component({
  tag: 'sage-input',
  styleUrl: 'sage-input.scss',
  shadow: true,
})
export class SageInput {
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
   * A unique identifier for the input field
   */
  @Prop() inputId: string;

  /**
   * Text to be displayed as the form label
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
   * "text"
   */
  @Prop({mutable: true}) value?: string;

  /**
   * Emitted when a keyboard input occurred
   */
  @Event() sageInput: EventEmitter<InputEvent>;

  private onInputEvent = (ev: Event) => {
    const input = ev.target as HTMLInputElement | null;
    if (input) {
      this.value = input.value || '';
    }
    this.sageInput.emit(ev as InputEvent);
  };

  render() {
    return (
      <Host
        aria-disabled={this.disabled ? 'true' : null}
      >
        <div class="sage-input">
          <label htmlFor={this.inputId}>{this.label}</label>
          <input class="sage-input__field"
            disabled={this.disabled}
            id={this.inputId}
            name={this.name}
            placeholder={this.placeholder}
            readOnly={this.readonly}
            required={this.required}
            type={this.type}
            value={this.value}
            onInput={this.onInputEvent}
          />
          {this.hint
            ? <p class="sage-input__hint">{this.hint}</p>
            : ''
          }
          {this.errorText
            ? <p class="sage-input__error-text">{this.errorText}</p>
            : ''
          }
        </div>
      </Host>
    );
  }
}
