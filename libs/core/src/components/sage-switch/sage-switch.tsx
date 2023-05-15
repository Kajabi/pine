import { Component, Element, Event, EventEmitter, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'sage-switch',
  styleUrl: 'sage-switch.scss',
  shadow: true,
})
export class SageSwitch {
  @Element() el: HTMLSageSwitchElement;

  /**
   * Identifies this input with a unique string, and associates the input with its label
   */
  @Prop() componentId!: string;

  /**
   * Determines the input 'checked' state
   */
  @Prop() checked = false;

  /**
   * Determines the input 'disabled' state, preventing user interaction
   */
  @Prop() disabled? = false;

  /**
   * Displays message text describing an invalid state
   */
  @Prop() errorMessage?: string;

  /**
   * Displays help text for additional description of an input
   */
  @Prop() helperMessage: string;

  /**
   * Determines the input 'invalid' state, signifying an error is present
   */
  @Prop() invalid? = false;

  /**
   * Displays text to describe the input
   */
  @Prop() label!: string;

  /**
   * Identifies form data and unifies a group of radio inputs for toggling a single property/value
   */
  @Prop() name: string;

  /**
   * Determines the 'required' state of the input
   */
  @Prop() required? = false;

  /**
   * Specifies the underlying input element type
   * @defaultValue 'checkbox'
   */
  @Prop() type: 'checkbox' | 'radio' = 'checkbox';

  /**
   * Provides input with a string submitted in form data, and can be used to distinguish radio inputs
   */
  @Prop() value: string;

  /**
   * Emits an event on input change
  */
  @Event() sageSwitchChange: EventEmitter<InputEvent>;

  private onSwitchUpdate = (e: Event) => {
    if (this.disabled) return;
    this.sageSwitchChange.emit(e as InputEvent);
  };

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
   * Create id for messaging
   */
  private messageId = (id: string, messageType: string) => {
    return `${id}__${messageType}-message`;
  };

  /**
   * Assign aria-description id to relate messages with input
   */
  private assignDescription = () => {
    let relatedId = this.messageId(this.componentId, 'helper')

    if (!this.invalid || !this.helperMessage) return;
    if (this.invalid) relatedId = this.messageId(this.componentId, 'error');

    return relatedId;
  };

  render() {
    return (
      <Host class={this.switchClassNames()} aria-disabled={this.disabled ? 'true' : null}>
        <input
          aria-describedby={this.assignDescription()}
          aria-invalid={this.invalid ? "true" : undefined}
          checked={this.checked}
          class="sage-switch__input"
          disabled={this.disabled}
          id={this.componentId}
          name={this.name ? this.name : this.componentId}
          onChange={this.onSwitchUpdate}
          required={this.required}
          type={this.type}
          value={this.value}
        />
        <label class="sage-switch__label" htmlFor={this.componentId}>
          {this.label}
        </label>
        {this.helperMessage &&
          <div
            class={`sage-switch__message`}
            id={this.messageId(this.componentId, 'helper')}
          >
            {this.helperMessage}
          </div>
        }
        {this.errorMessage &&
          <div
            class={`sage-switch__message sage-switch__message--error`}
            id={this.messageId(this.componentId, 'error')}
            aria-live="assertive"
          >
            {this.errorMessage}
          </div>
        }
      </Host>
    );
  }
}
