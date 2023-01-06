import { Component, h, Host, Prop } from '@stencil/core';

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
  @Prop() id: string;

  /**
   * Text to be displayed as the form label
   */
  @Prop() label?: string;

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
  @Prop() value?: string;

  private handleChange(event) {
    console.log(event.value)
    this.value = event.target.value;
  }

  render() {
    const {disabled} = this;
    return (
      <Host>
        <div class="sage-input">
          <label htmlFor={this.id}>{this.label}</label>
          <input class="sage-input__field"
            disabled={disabled}
            id={this.id}
            placeholder={this.placeholder}
            readOnly={this.readonly}
            required={this.required}
            type={this.type}
            value={this.value}
            onInput={(event) => this.handleChange(event)}
          />
          {this.hint
            ? <p>{this.hint}</p>
            : ''
          }
        </div>
      </Host>
    );
  }
}
