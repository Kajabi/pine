import { Component, Element, Event, EventEmitter, h, Host, Method, Prop, State, Watch } from '@stencil/core';
import { assignDescription, messageId } from '../../utils/form';
import { danger } from '@pine-ds/icons/icons';

import { debounceEvent } from '@utils/utils';
import { inheritAriaAttributes } from '@utils/attributes';

import type { Attributes } from '@utils/attributes';
import type { InputChangeEventDetail, InputInputEventDetail } from './input-interface';

@Component({
  tag: 'pds-input',
  styleUrls: ['pds-input.tokens.scss', '../../global/styles/utils/label.scss', 'pds-input.scss'],
  shadow: true,
})
export class PdsInput {
  private nativeInput?: HTMLInputElement;
  private inheritedAttributes: Attributes = {};
  private isComposing = false;
  /**
   * The value of the input when the input is focused.
   */
  private focusedValue?: string | number | null;

  private originalPdsInput?: EventEmitter<InputInputEventDetail>;

  @Element() el!: HTMLPdsInputElement;

  /**
   * Emitted when the input loses focus.
   */
  @Event() pdsBlur!: EventEmitter<FocusEvent>;

  /**
   *
   * Emitted when the value has changed.
   *
   * This event will not emit when programmatically setting the `value` property.
   */
  @Event() pdsChange!: EventEmitter<InputChangeEventDetail>;

  /**
   * Emitted when the input has focus.
   */
  @Event() pdsFocus!: EventEmitter<FocusEvent>;

  /**
   * Emitted when a keyboard input occurs.
   */
  @Event() pdsInput: EventEmitter<InputInputEventDetail>;

  /**
   * Sets focus on the native `input` in the `pds-input`. Use this method instead of the global
   * `input.focus()`.
   */
  @Method()
  async setFocus() {
    if ( this.nativeInput ) {
      this.nativeInput.focus();
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
   * Sets the number of milliseconds to wait before updating the value.
   */
  @Prop() debounce?: number;

  /**
   * Determines whether or not the input field is disabled.
   */
  @Prop() disabled?: boolean;

  /**
   * Specifies the error message and provides an error-themed treatment to the field.
   */
  @Prop() errorMessage?: string;

  /**
   * Displays a message or hint below the input field.
   */
  @Prop() helperMessage?: string;

  /**
   * Determines whether or not the input field is invalid or throws an error.
   */
  @Prop() invalid?: boolean;

  /**
   * Text to be displayed as the input label.
   */
  @Prop() label?: string;

  /**
   * Specifies the name. Submitted with the form name/value pair.
   */
  @Prop() name?: string;

  /**
   * Specifies a short hint that describes the expected value of the input field.
   */
  @Prop() placeholder?: string;

  /**
   * Determines whether or not the input field is readonly.
   */
  @Prop() readonly?: boolean;

  /**
   * Determines whether or not the input field is required.
   */
  @Prop() required?: boolean;

  /**
   * Determines the type of control that will be displayed
   * `'email'`, `'number'`, `'password'`, `'tel'`, `'text'`, `'url'`
   * @defaultValue "text"
   */
  @Prop() type = 'text';

  /**
   * The value of the input.
   */
  @Prop({mutable: true}) value?: string | number | null = '';

  /**
   * Determines if the input has focus.
   */
  @State() hasFocus = false;


  @Watch('debounce')
  protected debounceChanged() {
    const { pdsInput, debounce, originalPdsInput } = this;

    /**
     * If debounce is undefined, we have to manually revert the pdsInput emitter in case
     * debounce used to be set to a number. Otherwise, the event would stay debounced.
     */
    this.pdsInput = debounce === undefined ? originalPdsInput ?? pdsInput : debounceEvent(pdsInput, debounce);
  }

  @Watch('value')
  protected valueChanged() {
    const nativeInput = this.nativeInput;
    const value = this.getValue();

    if (nativeInput && nativeInput.value !== value && !this.isComposing) {
      nativeInput.value = value;
    }
  }

  private getValue(): string {
    return typeof this.value === 'number' ? this.value.toString() : (this.value || '').toString();
  }

  private onInputEvent = (ev: Event) => {
    const input = ev.target as HTMLInputElement | null;
    if (input) {
      this.value = input.value || '';
    }
    this.emitInputChange(ev);
  };

  private onChangeEvent = (ev: Event) => {
    this.emitValueChange(ev);
  };

  private onBlurEvent = (ev: FocusEvent) => {
    this.hasFocus = false;

    if (this.focusedValue !== this.value) {
      /**
       * Emits the `pdsChange` event when the input value
       * is different than the value when the input was focused.
       */
      this.emitValueChange(ev);
    }

    this.pdsBlur.emit(ev);
  };

  private onFocusEvent = (ev: FocusEvent) => {
    this.hasFocus = true;
    this.focusedValue = this.value;

    this.pdsFocus.emit(ev);
  };

  private onCompositionStart = () => {
    this.isComposing = true;
  }

  private onCompositionEnd = () => {
    this.isComposing = false;
  }

  /**
   * Emits a pdsChange event
   */
  private emitValueChange(event?: Event) {
    const { value } = this;
    const newValue = value == null ? value : value.toString();

    this.focusedValue = newValue;
    this.pdsChange.emit({ value: newValue, event });
  }

  /**
   *
   * Emits a `pdsInput` event
   */
  private emitInputChange(event?: Event) {
    const { value } = this;

    // Checks for both null and undefined values
    const newValue = value == null ? value : value.toString();

    this.pdsInput.emit({ value: newValue, event });
  }


  componentWillLoad() {
    this.inheritedAttributes = {
      ...inheritAriaAttributes(this.el)
    }
  }

  componentDidLoad() {
    this.debounceChanged();
  }

  private inputClassNames() {
    const classNames = ['pds-input__field'];

    if (this.invalid && this.invalid === true) {
      classNames.push('is-invalid');
    }

    return classNames.join('  ');
  }

  render() {
    return (
      <Host
        aria-disabled={this.disabled ? 'true' : null}
        aria-readonly={this.readonly ? 'true' : null}
      >
        <div class="pds-input">
          {this.label &&
            <label htmlFor={this.componentId}>{this.label}</label>
          }
          <input
            class={this.inputClassNames()}
            ref={(input) => this.nativeInput = input}
            aria-describedby={assignDescription(this.componentId, this.invalid, this.helperMessage)}
            aria-invalid={this.invalid ? "true" : undefined}
            autocomplete={this.autocomplete}
            disabled={this.disabled}
            id={this.componentId}
            name={this.name}
            placeholder={this.placeholder}
            readOnly={this.readonly}
            required={this.required}
            type={this.type}
            value={this.value}
            onInput={this.onInputEvent}
            onChange={this.onChangeEvent}
            onBlur={this.onBlurEvent}
            onFocus={this.onFocusEvent}
            onCompositionstart={this.onCompositionStart}
            onCompositionend={this.onCompositionEnd}
            {...this.inheritedAttributes}
          />
          {this.helperMessage &&
            <p
              class="pds-input__helper-message"
              id={messageId(this.componentId, 'helper')}
            >
              {this.helperMessage}
            </p>
          }
          {this.errorMessage &&
            <p
              class="pds-input__error-message"
              id={messageId(this.componentId, 'error')}
              aria-live="assertive"
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
