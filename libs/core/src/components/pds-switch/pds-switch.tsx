import { Component, Element, Event, EventEmitter, Host, h, Prop, State, Watch } from '@stencil/core';
import { assignDescription, isSpecTest, messageId, exposeTypeProperty } from '../../utils/form';
import { danger } from '@pine-ds/icons/icons';

import { inheritAriaAttributes, HostStylingKeeper } from '@utils/attributes';
import type { Attributes } from '@utils/attributes';
import { referencedElements } from '../../utils/aria-references';

/**
 * @slot label - Content displayed as the switch label in place of the `label` text. Clicking it toggles the switch.
 */
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
  private inputEl?: HTMLInputElement;
  private hostDescriptionObserver?: MutationObserver;
  private forwardsDescription = false;

  @Element() el: HTMLPdsSwitchElement;
  private hostKeeper = new HostStylingKeeper();

  @State() private hasLabelSlot = false;

  // Kept apart from the `disabled` prop so a fieldset never overwrites what the consumer set.
  @State() private fieldsetDisabled = false;

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
  @Prop() label: string;

  /**
   * Specifies the name. Submitted with the form name/value pair when checked, or with `unchecked-value` while unchecked.
   */
  // Reflected because a form-associated element submits under its name attribute, so a name set as a property posts too.
  @Prop({ reflect: true }) name: string;

  /**
   * Determines the 'required' state of the input.
   */
  @Prop() required? = false;

  /**
   * Provides input with a string submitted in form data.
   */
  @Prop() value: string;

  /**
   * Provides a string submitted in form data under `name` while the switch is unchecked.
   * When unset, an unchecked switch submits nothing, like a native checkbox.
   */
  @Prop() uncheckedValue?: string;

  /**
   * Emits an event on input change.
   */
  @Event() pdsSwitchChange: EventEmitter<InputEvent>;

  private isDisabled() {
    return this.disabled || this.fieldsetDisabled;
  }

  private onSwitchUpdate = (e: Event) => {
    if (this.isDisabled()) return;

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
    if (this.hasLabelSlot) {
      switchClasses += " pds-switch--label-slot";
    }
    return switchClasses;
  };

  connectedCallback() {
    this.hostKeeper.connect(this.el);
    // Initialize ElementInternals for form association (only once per element instance)
    if (this.el.attachInternals && !this.internals) {
      this.internals = this.el.attachInternals();
    }

    // Expose type property on the element instance to match native form element behavior
    exposeTypeProperty(this.el, () => this._type);

    // A reconnected switch may sit in a different tree, where its description IDs name other elements.
    this.forwardDescription();

    if (typeof MutationObserver === 'undefined') return;

    // Consumers set aria-describedby on the host, sometimes after render, but only the inner input is announced.
    this.hostDescriptionObserver = new MutationObserver(this.forwardDescription);
    this.hostDescriptionObserver.observe(this.el, { attributeFilter: ['aria-describedby'] });
  }

  disconnectedCallback() {
    this.hostKeeper.disconnect();
    this.hostDescriptionObserver?.disconnect();
    this.hostDescriptionObserver = undefined;
  }

  componentDidRender() {
    this.forwardDescription();
  }

  componentDidLoad() {
    this.updateFormValue();
  }

  @Watch('checked')
  @Watch('disabled')
  @Watch('fieldsetDisabled')
  @Watch('uncheckedValue')
  @Watch('value')
  syncFormValue() {
    this.updateFormValue();
  }

  private updateFormValue() {
    if (isSpecTest()) return;

    if (this.internals && this.internals.setFormValue) {
      // The restoration state always carries the checked value, even while disabled, so a bfcache or
      // back-forward restore can bring back a checked-then-disabled switch instead of losing it to a null state.
      this.internals.setFormValue(this.formValue(), this.checkedValue());
    }

    if (this.internals && this.internals.setValidity) {
      this.internals.setValidity({});
    }
  }

  // Unchecked sends uncheckedValue when set, even an empty string, otherwise nothing. Disabled sends nothing, like a
  // native checkbox: the platform only leaves out a host with the disabled attribute, and React sets the property.
  private formValue(): string | null {
    if (this.isDisabled()) return null;
    return this.checkedValue();
  }

  private checkedValue(): string | null {
    if (this.checked) return this.value || 'on';
    return this.uncheckedValue ?? null;
  }

  // An ID on the host can't reach into the shadow root, so the input is pointed at the elements the host's
  // aria-describedby names, followed by its own helper or error message. A browser without ARIA element
  // reflection keeps the input's own message only.
  private forwardDescription = () => {
    const input = this.inputEl;
    if (input === undefined || !('ariaDescribedByElements' in input)) return;

    const ownId = this.ownDescriptionId();
    const referenced = referencedElements(this.el, 'aria-describedby');

    if (referenced.length === 0) {
      if (!this.forwardsDescription) return;
      this.forwardsDescription = false;
      // Setting the element property cleared the attribute render wrote, so put that back.
      if (ownId !== undefined) {
        input.setAttribute('aria-describedby', ownId);
      } else {
        input.removeAttribute('aria-describedby');
      }
      return;
    }

    const own = ownId === undefined ? null : this.el.shadowRoot?.getElementById(ownId);
    input.ariaDescribedByElements = own == null ? referenced : [...referenced, own];
    this.forwardsDescription = true;
  };

  private ownDescriptionId() {
    return assignDescription(this.componentId, this.invalid, this.helperMessage, this.errorMessage);
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

  /**
   * Form Associated Custom Elements API: Called when the form is disabled
   */
  formDisabledCallback(disabled: boolean) {
    // Also fires when this element's own `disabled` attribute is merely present, even as the
    // literal string "false" (a consumer's or React's attribute serialization can write that) —
    // the platform treats any value as disabled, independent of fieldset state. A real disabled
    // fieldset ancestor confirms this is genuinely that, not this element's own attribute.
    this.fieldsetDisabled = disabled && this.el.closest('fieldset[disabled]') !== null;
  }

  componentWillLoad() {
    this.inheritedAttributes = {
      // aria-describedby stays on the host and is forwarded as element references, since its IDs can't resolve in here.
      ...inheritAriaAttributes(this.el, ['aria-describedby'])
    }
    this.updateHasLabelSlot();
  }

  private updateHasLabelSlot = () => {
    this.hasLabelSlot = Array.from(this.el.children).some((child) => child.getAttribute('slot') === 'label');
  };

  render() {
    const hostClass = this.switchClassNames();
    const ariaDisabled = this.isDisabled() ? 'true' : null;
    this.hostKeeper.record(hostClass, {}, { 'aria-disabled': ariaDisabled });

    return (
      <Host class={hostClass} aria-disabled={ariaDisabled}>
        <label htmlFor={this.componentId}>
          <input
            aria-describedby={this.ownDescriptionId()}
            aria-invalid={this.invalid ? "true" : undefined}
            checked={this.checked}
            class="pds-switch__input"
            disabled={this.isDisabled()}
            id={this.componentId}
            name={this.name ? this.name : this.componentId}
            onChange={this.onSwitchUpdate}
            // A description added after the switch, or replaced by a framework or a DOM morph, is picked up by the
            // time focus reaches the switch and it's announced.
            onFocus={this.forwardDescription}
            ref={(el) => (this.inputEl = el)}
            required={this.required}
            type="checkbox"
            value={this.value}
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
            <pds-icon aria-hidden="true" icon={danger} size="small" />
            {this.errorMessage}
          </div>
        }
      </Host>
    );
  }
}
