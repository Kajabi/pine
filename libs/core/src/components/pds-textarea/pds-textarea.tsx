import { Component, Element, Event, EventEmitter, Host, h, Method, Prop, State, Watch } from '@stencil/core';
import { assignDescription, isRequired, messageId } from '../../utils/form';
import { TextareaChangeEventDetail, TextareaInputEventDetail } from './textarea-interface';
import { debounceEvent } from '@utils/utils';
import type { Attributes } from '@utils/attributes';
import { inheritAttributes, inheritAriaAttributes } from '@utils/attributes';
import { danger } from '@pine-ds/icons/icons';

/**
 * @slot action - Content to be displayed in the label area, typically for help icons or links
 */
@Component({
  tag: 'pds-textarea',
  styleUrls: [
    '../../global/styles/utils/label.scss',
    '../pds-input/pds-input.tokens.scss',
    'pds-textarea.scss'
  ],
  shadow: true,
  formAssociated: true,
})
export class PdsTextarea {

  private nativeTextarea?: HTMLTextAreaElement
  private focusedValue?: string | null;
  private inheritedAttributes: Attributes = {};
  private originalPdsInput?: EventEmitter<TextareaInputEventDetail>;
  private internals?: ElementInternals;

  @Element() el: HTMLPdsTextareaElement;

  /**
   * Emitted when the input loses focus.
   */
  @Event() pdsBlur!: EventEmitter<FocusEvent>;

  /**
   * Emitted when the input has focus.
   */
  @Event() pdsFocus!: EventEmitter<FocusEvent>;

  /**
   * Emitted when a keyboard input occurs.
   *
   * For elements that accept text input (`type=text`, `type=tel`, etc.), the interface
   * is [`InputEvent`](https://developer.mozilla.org/en-US/docs/Web/API/InputEvent); for others,
   * the interface is [`Event`](https://developer.mozilla.org/en-US/docs/Web/API/Event). If
   * the input is cleared on edit, the type is `null`.
   */
  @Event() pdsInput: EventEmitter<TextareaInputEventDetail>;

  /**
   * Event emitted whenever the value of the textarea changes.
   *
   * This event will not emit when programmatically setting the `value` property.
   */
  @Event() pdsTextareaChange: EventEmitter<TextareaChangeEventDetail>;

  /**
   * Sets focus on the native `textarea` in the `pds-texarea`. Use this method instead of the global
   * `textarea.focus()`.
   */
  @Method()
  async setFocus() {
    if (this.nativeTextarea) {
      this.nativeTextarea.focus();
    }
  }

  /**
   * Specifies if and how the browser provides `autocomplete` assistance for the field.
   */
  @Prop() autocomplete: string;

  /**
   * A unique identifier used for the underlying component `id` attribute.
   */
  @Prop() componentId!: string;

  /**
   * Determines whether or not the textarea is disabled.
   * @defaultValue false
   */
  @Prop() disabled = false;

  /**
   * The amount of time, in milliseconds, to wait to trigger the event after each keystroke.
   */
  @Prop() debounce?: number;

  /**
   * Displays an error message below the textarea field.
   */
  @Prop() errorMessage?: string;

  /**
   * Displays a message or hint below the textarea field.
   */
  @Prop() helperMessage?: string;

  /**
   * Determines whether or not the textarea is invalid or throws an error.
   * @defaultValue false
   */
  @Prop({mutable: true}) invalid = false;       // eslint-disable-line @stencil-community/strict-mutable

  /**
   * Text to be displayed as the textarea label.
   */
  @Prop() label?: string;

  /**
   * Specifies the name. Submitted with the form name/value pair. This value will mirror the componentId.
   */
  @Prop() name: string = this.componentId;

  /**
   * Specifies a short hint that describes the expected value of the textarea.
   */
  @Prop() placeholder?: string;

  /**
   * Determines whether or not the textarea is readonly.
   * @defaultValue false
   */
  @Prop() readonly = false;

  /**
   * Determines whether or not the textarea is required.
   * @defaultValue false
   */
  @Prop() required = false;

  /**
   * Sets number of rows of text visible without needing to scroll in the textarea.
   */
  @Prop() rows?: number;

  /**
   * The value of the textarea.
   */
  @Prop({mutable: true}) value?: string | null = '';

  @State() hasFocus = false;

  /**
   * If true, the textarea has action content in the label area
   */
  @State() hasAction = false;

  @Watch('debounce')
  protected debounceChanged() {
    const { pdsInput, debounce, originalPdsInput } = this;

    this.pdsInput = debounce === undefined ? originalPdsInput ?? pdsInput : debounceEvent(pdsInput, debounce);
  }

  /**
   * Update the native input element when the value changes
   */
  @Watch('value')
  protected valueChanged() {
    const nativeTextarea = this.nativeTextarea;
    const value = this.getValue();

    if (nativeTextarea && nativeTextarea.value !== value) {
      nativeTextarea.value = value;
    }

    // Update form value for Form Associated Custom Elements API
    this.updateFormValue();
  }

  /**
   * Emits an `pdsInput` event.
   */
  private emitInputChange(event?: Event) {
    const { value } = this;
    this.pdsInput.emit({ value, event });
  }

  /**
   * Emits an `pdsTextareaChange` event.
   */
  private emitValueChange(event?: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    isRequired(textarea, this);

    const { value } = textarea;

    // Checks for both null and undefined values
    const newValue = value == null ? value : value.toString();
    this.focusedValue = newValue;
    this.pdsTextareaChange.emit({ value: newValue, event });
  }

  private getValue(): string {
    return this.value || '';
  }

  private onBlur = (ev: FocusEvent) => {
    this.hasFocus = false;

    if (this.focusedValue !== this.value) {
      this.emitValueChange(ev);
    }

    this.pdsBlur.emit(ev);
  };

  private onFocus = (ev: FocusEvent) => {
    this.hasFocus = true;
    this.focusedValue = this.value;

    this.pdsFocus.emit(ev);
  };

  private onInput = (ev: Event) => {
    const input = ev.target as HTMLTextAreaElement | null;
    if (input) {
      this.value = input.value || '';
    }
    this.emitInputChange(ev);
  };

  private onTextareaChange = (ev: Event) => {
    this.emitValueChange(ev);
  };

  private textareaClassNames() {
    const classNames = ['pds-textarea__field'];

    if (this.invalid && this.invalid === true) {
      classNames.push('is-invalid');
    }

    return classNames.join('  ');
  }

  connectedCallback() {
    this.debounceChanged();
    // Initialize ElementInternals for form association
    if (this.el.attachInternals) {
      this.internals = this.el.attachInternals();
    }
  }

  componentWillLoad() {
    this.inheritedAttributes = {
      ...inheritAriaAttributes(this.el),
      ...inheritAttributes(this.el),
    };
    this.hasAction = this.el.querySelector('[slot="action"]') !== null;
  }

  componentDidLoad() {
    this.originalPdsInput = this.pdsInput;
    // Set initial form value
    this.updateFormValue();
  }

  private renderAction() {
    const hasAction = this.el.querySelector('[slot="action"]') !== null;
    if (hasAction) {
      return (
        <div class="pds-textarea__action" part="action">
          <slot name="action"></slot>
        </div>
      );
    }
    return null;
  }

  /**
   * Updates the form value using ElementInternals API
   */
  private updateFormValue() {
    if (this.internals && this.internals.setFormValue) {
      const value = this.getValue();
      this.internals.setFormValue(value || null);

      // Set validity based on native textarea validation
      if (this.nativeTextarea && this.internals && this.internals.setValidity) {
        this.internals.setValidity(
          this.nativeTextarea.validity,
          this.nativeTextarea.validationMessage,
          this.nativeTextarea
        );
      }
    }
  }

  /**
   * Form Associated Custom Elements API: Called when the form is reset
   */
  formResetCallback() {
    this.value = '';
    this.updateFormValue();
  }

  /**
   * Form Associated Custom Elements API: Called when the form is disabled
   */
  formDisabledCallback(disabled: boolean) {
    this.disabled = disabled;
  }

  /**
   * Form Associated Custom Elements API: Called to restore form state
   */
  formStateRestoreCallback(state: string | FormData | null) {
    if (typeof state === 'string') {
      this.value = state;
    }
  }

  render() {
    const value = this.getValue();

    return (
      <Host
        aria-disabled={this.disabled ? 'true' : null}
        aria-readonly={this.readonly ? 'true' : null}
        has-action={this.hasAction ? 'true' : null}
      >
        <div class="pds-textarea">
          {this.label &&
            <div class="pds-textarea__label-wrapper">
              <label htmlFor={this.componentId}>{this.label}</label>
              {this.renderAction()}
            </div>
          }
          <textarea
            ref={(el) => this.nativeTextarea = el }
            aria-describedby={assignDescription(this.componentId, this.invalid, this.helperMessage)}
            aria-invalid={this.invalid ? "true" : undefined}
            autocomplete={this.autocomplete}
            class={this.textareaClassNames()}
            disabled={this.disabled}
            id={this.componentId}
            name={this.name}
            placeholder={this.placeholder}
            readOnly={this.readonly}
            required={this.required}
            rows={this.rows}
            onBlur={this.onBlur}
            onChange={this.onTextareaChange}
            onFocus={this.onFocus}
            onInput={this.onInput}
            {...this.inheritedAttributes}
          >
            {value}
          </textarea>
          {this.helperMessage &&
            <p
              class="pds-textarea__helper-message"
              id={messageId(this.componentId, 'helper')}
            >
              {this.helperMessage}
            </p>
          }
          {this.invalid &&
            <p
              aria-live="assertive"
              class="pds-textarea__error-message"
              id={messageId(this.componentId, 'error')}
            >
              <pds-icon icon={danger} size="small" />
              {this.errorMessage}
            </p>
          }
        </div>
      </Host>
    );
  }
}
