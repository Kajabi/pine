import { Component, Element, Event, EventEmitter, Host, h, Prop } from '@stencil/core';
import { assignDescription, messageId } from '../../utils/form';
import { PdsLabel } from '../_internal/pds-label/pds-label';
import { danger } from '@pine-ds/icons/icons';

@Component({
  tag: 'pds-switch',
  styleUrls: ['../../global/styles/base.scss', 'pds-switch.scss'],
  shadow: true,
})
export class PdsSwitch {
  @Element() el: HTMLPdsSwitchElement;

  /**
   * A unique identifier used for the underlying component `id` attribute and the label `for` attribute.
   */
  @Prop() componentId!: string;

  /**
   * Determines the input 'checked' state
   */
  @Prop({ mutable: true }) checked = false;

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
   * Provides input with a string submitted in form data, and can be used to distinguish radio inputs
   */
  @Prop() value: string;

  /**
   * Emits an event on input change
   */
  @Event() pdsSwitchChange: EventEmitter<InputEvent>;

  private onSwitchUpdate = (e: Event) => {
    if (this.disabled) return;

    const input = e.target as HTMLInputElement;
    this.checked = input.checked;
    this.pdsSwitchChange.emit(e as InputEvent);
  };

  /**
   * Generate switch classes
   */
  private switchClassNames = () => {
    let switchClasses = `pds-switch`;

    if (this.invalid === true) {
      switchClasses += " pds-switch--error";
    }
    if (this.helperMessage !== undefined) {
      switchClasses += " pds-switch--message";
    }
    return switchClasses;
  };

  render() {
    return (
      <Host class={this.switchClassNames()} aria-disabled={this.disabled ? 'true' : null}>
        <input
          aria-describedby={assignDescription(this.componentId, this.invalid, this.helperMessage)}
          aria-invalid={this.invalid ? "true" : undefined}
          checked={this.checked}
          class="pds-switch__input"
          disabled={this.disabled}
          id={this.componentId}
          name={this.name ? this.name : this.componentId}
          onChange={this.onSwitchUpdate}
          required={this.required}
          type="checkbox"
          value={this.value}
        />
        <PdsLabel classNames="pds-switch__label" htmlFor={this.componentId} text={this.label} />
        {this.helperMessage &&
          <div
            class={`pds-switch__message`}
            id={messageId(this.componentId, 'helper')}
          >
            {this.helperMessage}
          </div>
        }
        {this.errorMessage &&
          <div
            class={`pds-switch__message pds-switch__message--error`}
            id={messageId(this.componentId, 'error')}
            aria-live="assertive"
          >
            <pds-icon icon={danger} size="small" />
            {this.errorMessage}
          </div>
        }
      </Host>
    );
  }
}
