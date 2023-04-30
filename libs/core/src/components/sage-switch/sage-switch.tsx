import { Component, Element, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'sage-switch',
  styleUrl: 'sage-switch.scss',
  shadow: true,
})
export class SageSwitch {
  @Element() el: HTMLSageSwitchElement;

  /**
   * A unique identifier for this input. Associates the input with its label
   */
  @Prop() componentId!: string;

  /**
   * Sets state of input control
   */
  @Prop() checked = false;

  /**
   * Disables input control
   */
  @Prop() disabled? = false;

  /**
   * Indicates when user input is not valid
   */
  @Prop() invalid? = false;

  /**
   * Text to be displayed as the switch label
   */
  @Prop() label!: string;

  /**
   * Used for identifying form data. Unifies a group of radio inputs for toggling a single property/value
   */
  @Prop() name: string;

  /**
   * Forces the input to be required
   */
  @Prop() required? = false;

  /**
   * Specifies the underlying input element type
   * @defaultValue 'checkbox'
   */
  @Prop() type: 'checkbox' | 'radio' = 'checkbox';


  render() {
    return (
      <Host class="sage-switch" aria-disabled={this.disabled ? 'true' : null}>
        <input
          checked={this.checked}
          class="sage-switch__input"
          disabled={this.disabled}
          id={this.componentId}
          name={this.name}
          type={this.type}
        />
        <label class="sage-switch__label" htmlFor={this.componentId}>
          {this.label}
        </label>
      </Host>
    );
  }
}
