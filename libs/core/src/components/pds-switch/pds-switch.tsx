import { Component, Element, Event, EventEmitter, Host, h, Prop, Watch } from '@stencil/core';
import { assignDescription, messageId, exposeTypeProperty } from '../../utils/form';
import { danger } from '@pine-ds/icons/icons';

import { inheritAriaAttributes } from '@utils/attributes';
import type { Attributes } from '@utils/attributes';

@Component({
  tag: 'pds-switch',
  styleUrls: ['../../global/styles/utils/label.scss', 'pds-switch.scss'],
  shadow: true,
  formAssociated: true,
})
export class PdsSwitch {
  private inheritedAttributes: Attributes = {};
  private internals?: ElementInternals;
  private readonly _type = 'checkbox' as const;

  @Element() el: HTMLPdsSwitchElement;

  /**
   * A unique identifier used for the underlying component `id` attribute and the label `for` attribute.
   */
  @Prop() componentId!: string;

  /**
   * Determines the input 'checked' state.
   */
  @Prop({ mutable: true }) checked = false;

  /**
   * Determines the input 'disabled' state, preventing user interaction.
   */
  @Prop() disabled? = false;

  /**
   * Displays message text describing an invalid state.
   */
  @Prop() errorMessage?: string;

  /**
   * Visually hides the label text for instances where only the switch should be displayed. Label remains accessible to assistive technology such as screen readers.
   */
  @Prop() hideLabel: boolean;

  /**
   * Displays help text for additional description of an input.
   */
  @Prop() helperMessage: string;

  /**
   * Determines the input 'invalid' state, signifying an error is present.
   */
  @Prop() invalid? = false;

  /**
   * Displays text to describe the input.
   */
  @Prop() label!: string;

  /**
   * Identifies form data and unifies a group of radio inputs for toggling a single property/value.
   */
  @Prop() name: string;

  /**
   * Determines the 'required' state of the input.
   */
  @Prop() required? = false;

  /**
   * Provides input with a string submitted in form data.
   */
  @Prop() value: string;


  /**
   * Emits an event on input change.
   */
  @Event() pdsSwitchChange: EventEmitter<InputEvent>;

  private onSwitchUpdate = (e: Event) => {
    if (this.disabled) return;

    const input = e.target as HTMLInputElement;
    this.checked = input.checked;

    this.updateFormValue();

    this.pdsSwitchChange.emit(e as InputEvent);
  };

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

  connectedCallback() {
    // Initialize ElementInternals for form association (only once per element instance)
    if (this.el.attachInternals && !this.internals) {
      this.internals = this.el.attachInternals();
    }

    // Expose type property on the element instance to match native form element behavior
    exposeTypeProperty(this.el, () => this._type);
  }

  componentDidLoad() {
    this.updateFormValue();
  }

  @Watch('checked')
  checkedChanged() {
    this.updateFormValue();
  }

  private updateFormValue() {
    if (typeof jest !== 'undefined' || typeof process !== 'undefined' && process.env?.NODE_ENV === 'test') {
      return;
    }

    if (this.internals && this.internals.setFormValue) {
      // For switches, only send the value when checked, otherwise send null
      const formValue = this.checked ? (this.value || 'on') : null;
      this.internals.setFormValue(formValue);
    }

    if (this.internals && this.internals.setValidity) {
      this.internals.setValidity({});
    }
  }

  formStateRestoreCallback(state: string | FormData | null) {
    if (state instanceof FormData) {
      // For switches, restore if the value exists in FormData
      const value = this.value || 'on';
      this.checked = state.get(this.name || this.componentId) === value;
    } else if (typeof state === 'string') {
      // Restore from string state
      this.checked = state === (this.value || 'on');
    }
  }

  componentWillLoad() {
    this.inheritedAttributes = {
      ...inheritAriaAttributes(this.el)
    }
  }

  render() {
    return (
      <Host class={this.switchClassNames()} aria-disabled={this.disabled ? 'true' : null}>
        <label htmlFor={this.componentId}>
          <input
            aria-describedby={assignDescription(this.componentId, this.invalid, this.errorMessage || this.helperMessage)}
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
            {...this.inheritedAttributes}
          />
          <span class={this.hideLabel ? 'visually-hidden' : ''}>
            {this.label}
          </span>
        </label>
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
