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
  @Prop() componentId: string;

  /**
   * Disables input control
   * @defaultValue false
   */
  @Prop() disabled? = false;

  /**
   * Text to be displayed as the switch label
   */
  @Prop() label?: string;

  /**
   * Used for identifying form data. Unifies a group of radio inputs for toggling a single property/value
   */
  @Prop() name: string;

  /**
   * Forces the input to be required
   * @defaultValue false
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
        <label class="sage-switch__label" htmlFor={this.componentId}>{this.label}</label>
        <input class="sage-switch__input" id={this.componentId} name={this.name} disabled={this.disabled} type={this.type} ></input>
      </Host>
    );
  }
}
