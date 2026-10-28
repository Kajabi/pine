import { Component, Element, h, Prop, Host, Event, EventEmitter, State, Watch } from '@stencil/core';
import { assignDescription, isSpecTest, messageId, exposeTypeProperty } from '../../utils/form';
import { CheckboxChangeEventDetail } from './checkbox-interface';
import { danger } from '@pine-ds/icons/icons';

import { inheritAriaAttributes, HostStylingKeeper } from '@utils/attributes';
import type { Attributes } from '@utils/attributes';

/**
 * @slot label - Content displayed as the checkbox label in place of the `label` text. Clicking it toggles the checkbox.
 */
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
  private hostKeeper = new HostStylingKeeper();

  @State() private hasLabelSlot = false;

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
   * Determines the visual style of the checkbox. `pill` hides the checkbox square and renders the label as a pill-shaped choice. The input stays a native checkbox, so keyboard, form, and screen reader behavior are unchanged.
   * @defaultValue default
   */
  @Prop() variant: 'default' | 'pill' = 'default';

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
    if (this.hasLabelSlot) { classNames.push('has-label-slot'); }
    if (this.variant === 'pill') { classNames.push('pds-checkbox--pill'); }

    return classNames.join('  ');
  }

  connectedCallback() {
    this.hostKeeper.connect(this.el);
    // Initialize ElementInternals for form association (only once per element instance)
    if (this.el.attachInternals && !this.internals) {
      this.internals = this.el.attachInternals();
    }

    // Expose type property on the element instance to match native form element behavior
    exposeTypeProperty(this.el, () => this._type);
  }

  disconnectedCallback() {
    this.hostKeeper.disconnect();
  }

  componentDidLoad() {
    this.updateFormValue();
  }

  @Watch('checked')
  checkedChanged() {
    this.updateFormValue();
  }

  private updateFormValue() {
    if (isSpecTest()) return;

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

  /**
   * Form Associated Custom Elements API: Called when the form is disabled
   */
  formDisabledCallback(disabled: boolean) {
    // Also fires when this element's own `disabled` attribute is merely present, even as the
    // literal string "false" (a consumer's or React's attribute serialization can write that) —
    // the platform treats any value as disabled, independent of fieldset state. A real disabled
    // fieldset ancestor confirms this is genuinely that, not this element's own attribute.
    if (disabled && !this.el.closest('fieldset[disabled]')) return;
    this.disabled = disabled;
  }

  componentWillLoad() {
    this.inheritedAttributes = {
      ...inheritAriaAttributes(this.el)
    }
    this.updateHasLabelSlot();
  }

  private updateHasLabelSlot = () => {
    this.hasLabelSlot = Array.from(this.el.children).some((child) => child.getAttribute('slot') === 'label');
  };

  render() {
    const hostClass = this.classNames();
    this.hostKeeper.record(hostClass);

    return (
      <Host class={hostClass}>
        <label htmlFor={this.componentId}>
          <input
            type="checkbox"
            aria-describedby={assignDescription(this.componentId, this.invalid, this.helperMessage, this.errorMessage)}
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
            class={this.variant === 'pill' ? 'visually-hidden' : undefined}
            {...this.inheritedAttributes}
          />
          <span class={this.hideLabel ? 'visually-hidden' : ''}>
            <slot name="label" onSlotchange={this.updateHasLabelSlot} />
            {/* A text node, not slot fallback: older ChromeDriver text extraction skips fallback content. */}
            {!this.hasLabelSlot && this.label}
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
            <pds-icon aria-hidden="true" icon={danger} size="small" />
            {this.errorMessage}
          </div>
        }
      </Host>
    );
  }
}
