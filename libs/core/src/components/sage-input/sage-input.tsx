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
  @Prop() disabled? = false;

  /**
   * Displays a hint or description of the input field
   */
  @Prop() hint?;

  /**
   * Indicates whether or not the input field is invalid or throws an error
   */
  @Prop() invalid?;

  /**
   * A unique identifier for the input field
   */
  @Prop() id = '';

  /**
   * Text to be displayed as the form label
   */
  @Prop() label?;

  /**
   * Specifies a short hint that describes the expected value of the input field
   */
  @Prop() placeholder?;

  /**
   * Indicates whether or not the input field is readonly
   */
  @Prop() readonly?;

  /**
   * Indicates whether or not the input field is required
   */
  @Prop() required?;

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
  @Prop() value?;

  private handleChange(event) {
    console.log(event.value)
    this.value = event.target.value;
  }

  render() {
    return (
      <Host>
        <div class="sage-input">
          <label htmlFor={this.id}>{this.label}</label>
          <input class="sage-input__field"
            disabled={this.disabled ? true : false}
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
