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
   * Text displayed with invalid state
   */
  @Prop() errorMessage?: string;

  /**
   * Text used for additional control description
   */
  @Prop() helperMessage: string;

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


  /**
   * Generate switch classes
   */
  private switchClassNames = () => {
    let switchClasses = `sage-switch`;

    if (this.invalid === true) {
      switchClasses += " sage-switch--error";
    }

    if (this.helperMessage !== undefined) {
      switchClasses += " sage-switch--message";
    }
    return switchClasses;
  };

  /**
   * Unique id to relate helper message with input
   */
  private helperMessageId = (id: string) => {
    return id + '__helper-message';
  };

  render() {
    return (
      <Host class={this.switchClassNames()} aria-disabled={this.disabled ? 'true' : null}>
        <input
          aria-describedby={this.helperMessage ? this.helperMessageId(this.componentId) : undefined}
          checked={this.checked}
          class="sage-switch__input"
          disabled={this.disabled}
          id={this.componentId}
          name={this.name ? this.name : this.componentId}
          type={this.type}
        />
        <label class="sage-switch__label" htmlFor={this.componentId}>
          {this.label}
        </label>
        {this.helperMessage &&
          <div
            class={`sage-switch__message`}
            id={this.helperMessageId(this.componentId)}
          >
            {this.helperMessage}
          </div>
        }
        {this.errorMessage &&
          <div
            class={`sage-switch__message sage-switch__error-message`}
            id={this.helperMessageId(this.componentId)}
            aria-live="assertive"
          >
            {this.errorMessage}
          </div>
        }
      </Host>
    );
  }
}
