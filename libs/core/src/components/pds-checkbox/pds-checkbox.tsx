import { Component, Element, h, Prop, Host, Event, EventEmitter, Watch } from '@stencil/core';
import { assignDescription, messageId, exposeTypeProperty } from '../../utils/form';
import { CheckboxChangeEventDetail } from './checkbox-interface';
import { danger } from '@pine-ds/icons/icons';

import { inheritAriaAttributes } from '@utils/attributes';
import type { Attributes } from '@utils/attributes';

@Component({
  tag: 'pds-checkbox',
  styleUrls: ['../../global/styles/utils/label.scss', 'pds-checkbox.scss'],
  shadow: true,
  formAssociated: true,
})
export class PdsCheckbox {
  private inheritedAttributes: Attributes = {};
  private internals?: ElementInternals;
  private readonly _type = 'checkbox' as const;

  @Element() el: HTMLPdsCheckboxElement;

  /**
   * It determines whether or not the checkbox is checked.
   */
  @Prop({ mutable: true }) checked?: boolean = false;

  /**
   * A unique identifier used for the underlying component `id` attribute and the label `for` attribute.
   */
  @Prop() componentId!: string;

  /**
   * It determines whether or not the checkbox is disabled.
   */
  @Prop() disabled: boolean;

  /**
   * Displays message text describing an invalid state.
   */
  @Prop() errorMessage: string;

  /**
   * String used for helper message below checkbox.
   */
  @Prop() helperMessage: string;

  /**
   * If `true`, the checkbox will visually appear as indeterminate.
   * Only JavaScript can set the objects `indeterminate` property. See [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox#indeterminate_state_checkboxes).
   */
  @Prop({ mutable: true }) indeterminate: boolean;

  /**
   * It determines whether or not the checkbox is invalid.
   */
  @Prop() invalid: boolean;

  /**
   * String used for label text next to checkbox.
   */
  @Prop() label: string;

    /**
   * Visually hides the label text for instances where only the checkbox should be displayed. Label remains accessible to assistive technology such as screen readers.
   */
    @Prop() hideLabel: boolean;

  /**
   * String used for checkbox `name` attribute.
   */
  @Prop() name: string;

  /**
   * It determines whether or not the checkbox is required.
   */
  @Prop() required: boolean;

  /**
   * The value of the checkbox that is submitted with a form.
   */
  @Prop() value: string;


  /**
   * Event emitted that contains the `value` and `checked`.
   */
  @Event() pdsCheckboxChange: EventEmitter<CheckboxChangeEventDetail>;

  @Event() pdsCheckboxInput: EventEmitter<CheckboxChangeEventDetail>;

  @Watch('checked')
  updateIndeterminate() {
    this.indeterminate = undefined
  }

  private handleCheckboxChange = (e: Event) => {
    if (this.disabled) {
      return;
    }

    const target = e.target as HTMLInputElement;
    this.checked = target.checked;

    this.updateFormValue();

    this.pdsCheckboxChange.emit({
      checked: target.checked,
      value: this.value
    });
  }

  private handleInput = () => {
    this.pdsCheckboxInput.emit({
      checked: this.checked,
      value: this.value
    });
  }

  private classNames() {
    const classNames = [];

    if (this.invalid) { classNames.push('is-invalid'); }
    if (this.indeterminate) { classNames.push('is-indeterminate'); }
    if (this.disabled) { classNames.push('is-disabled'); }

    return classNames.join('  ');
  }

  connectedCallback() {
    if (this.el.attachInternals) {
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
      // For checkboxes, only send the value when checked, otherwise send null
      const formValue = this.checked ? (this.value || 'on') : null;
      this.internals.setFormValue(formValue);
    }

    if (this.internals && this.internals.setValidity) {
      this.internals.setValidity({});
    }
  }

  formStateRestoreCallback(state: string | FormData | null) {
    if (state instanceof FormData) {
      // For checkboxes, restore if the value exists in FormData
      const value = this.value || 'on';
      this.checked = state.get(this.name as string) === value;
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
      <Host class={this.classNames()}>
        <label htmlFor={this.componentId}>
          <input
            type="checkbox"
            aria-describedby={assignDescription(this.componentId, this.invalid, this.errorMessage || this.helperMessage)}
            aria-invalid={this.invalid ? "true" : undefined}
            id={this.componentId}
            indeterminate={this.indeterminate}
            name={this.name}
            value={this.value}
            checked={this.checked}
            required={this.required}
            disabled={this.disabled}
            onChange={this.handleCheckboxChange}
            onInput={this.handleInput}
            {...this.inheritedAttributes}
          />
          <span class={this.hideLabel ? 'visually-hidden' : ''}>
            {this.label}
          </span>
        </label>
        {this.helperMessage &&
          <div
            class={'pds-checkbox__message'}
            id={messageId(this.componentId, 'helper')}
          >
            {this.helperMessage}
          </div>
        }
        {this.errorMessage &&
          <div
            class={`pds-checkbox__message pds-checkbox__message--error`}
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
