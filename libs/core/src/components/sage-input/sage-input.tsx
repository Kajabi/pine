import { Component, h, Host, Prop, State } from '@stencil/core';

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
   * A unique identifier for the input field
   */
   @Prop() inputId = '';

  /**
   * Text to be displayed as the form label
   */
   @Prop() label = 'label';

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
  @Prop() value = '';

  private handleChange(event) {
    console.log(event.value)
    this.value = event.target.value;
  }

  render() {
    return (
      <Host>
        <div class="sage-input">
          <label htmlFor={this.inputId}>{this.label}</label>
          <input class="sage-input__field" id={this.inputId} type={this.type} value={this.value} onInput={(event) => this.handleChange(event)} />
        </div>
      </Host>
    );
  }
}
