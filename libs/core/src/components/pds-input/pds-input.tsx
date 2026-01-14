import { Component, Element, Event, EventEmitter, h, Host, Method, Prop, State, Watch } from '@stencil/core';
import { assignDescription, messageId } from '../../utils/form';
import { inheritAriaAttributes } from '@utils/attributes';
import type { Attributes } from '@utils/attributes';
import { InputChangeEventDetail, InputInputEventDetail } from './input-interface';
import { debounceEvent } from '@utils/utils';
import { danger } from '@pine-ds/icons/icons';

/**
 * @slot append - Content to be displayed after the input field
 * @slot prefix - Content that is displayed visually within the input field before the input field
 * @slot prepend - Content to be displayed before the input field
 * @slot suffix - Content that is displayed visually within the input field after the input field
 * @slot action - Content to be displayed in the label area, typically for help icons or links
 */
@Component({
  tag: 'pds-input',
  styleUrls: ['pds-input.tokens.scss', '../../global/styles/utils/label.scss', 'pds-input.scss'],
  shadow: true,
  formAssociated: true,
})
export class PdsInput {

  private nativeInput?: HTMLInputElement;
  private inheritedAttributes: Attributes = {};
  private isComposing = false;
  private prefixEl?: HTMLElement;
  private suffixEl?: HTMLElement;
  private focusedValue?: string | number | null;
  private originalPdsInput?: EventEmitter<InputInputEventDetail>;
  private internals?: ElementInternals;

  @Element() el!: HTMLPdsInputElement;

  /**
   * If true, the input has prefix content (non-focusable)
   */
  @State() hasPrefix = false;

  /**
   * If true, the input has suffix content (non-focusable)
   */
  @State() hasSuffix = false;

  /**
   * If true, the input has prepend content (focusable)
   */
  @State() hasPrepend = false;

  /**
   * If true, the input has append content (focusable)
   */
  @State() hasAppend = false;

  /**
   * If true, the input has action content in the label area
   */
  @State() hasAction = false;

  /**
   * Emitted when the input loses focus.
   */
  @Event() pdsBlur!: EventEmitter<FocusEvent>;

  /**
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
   * Emitted when a key is pressed down in the input.
   */
  @Event() pdsKeyDown!: EventEmitter<KeyboardEvent>;

  /**
   * Sets focus on the native `input` in the `pds-input`. Use this method instead of the global
   * `input.focus()`.
   */
  @Method()
  async setFocus() {
    if (this.nativeInput) {
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
   * Visually hides the label text for instances where only the input should be displayed. Label remains accessible to assistive technology such as screen readers.
   * Note: When true, the action slot is also hidden to maintain a minimal UI.
   */
  @Prop() hideLabel: boolean;

  /**
   * Specifies the maximum value for the input field.
   */
  @Prop() max?: string;

  /**
   * Specifies the maximum number of characters allowed in the input field.
   */
  @Prop() maxlength?: string;

  /**
   * Specifies the minimum value for the input field.
   */
  @Prop() min?: string;

  /**
   * Specifies the minimum number of characters allowed in the input field.
   */
  @Prop() minlength?: string;

  /**
   * Specifies the name. Submitted with the form name/value pair.
   */
  @Prop() name?: string;

  /**
   * Specifies the regular expression that the input value is checked against.
   */
  @Prop() pattern?: string;

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
   * Works with the `min` and `max` attributes to define increments for the input field.
   */
  @Prop() step?: string;

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
   * Determines whether or not the input field takes full width of its container.
   */
  @Prop() fullWidth?: boolean;

  /**
   * Applies highlight styling to the input field.
   */
  @Prop({ reflect: true }) highlight?: boolean;

  /**
   * Determines if the input has focus.
   */
  @State() hasFocus = false;

  private updateAddonWidths() {
    requestAnimationFrame(() => {
      if (this.prefixEl) {
        const prefixWidth = this.prefixEl.offsetWidth;
        this.el.style.setProperty('--prefix-width', `${prefixWidth}px`);
      }

      if (this.suffixEl) {
        const suffixWidth = this.suffixEl.offsetWidth;
        this.el.style.setProperty('--suffix-width', `${suffixWidth}px`);
      }
    });
  }

  private renderPrefix() {
    const hasPrefix = this.el.querySelector('[slot="prefix"]') !== null;
    if (hasPrefix) {
      return (
        <div class="pds-input__prefix" part="prefix" ref={(el) => this.prefixEl = el as HTMLElement}>
          <slot name="prefix" onSlotchange={() => this.updateAddonWidths()}></slot>
        </div>
      );
    }
    return null;
  }

  private renderSuffix() {
    const hasSuffix = this.el.querySelector('[slot="suffix"]') !== null;
    if (hasSuffix) {
      return (
        <div class="pds-input__suffix" part="suffix" ref={(el) => this.suffixEl = el as HTMLElement}>
          <slot name="suffix" onSlotchange={() => this.updateAddonWidths()}></slot>
        </div>
      );
    }
    return null;
  }

  private renderPrepend() {
    const hasPrepend = this.el.querySelector('[slot="prepend"]') !== null;
    if (hasPrepend) {
      return (
        <div class="pds-input__prepend" part="prepend">
          <slot name="prepend"></slot>
        </div>
      );
    }
    return null;
  }

  private renderAppend() {
    const hasAppend = this.el.querySelector('[slot="append"]') !== null;
    if (hasAppend) {
      return (
        <div class="pds-input__append" part="append">
          <slot name="append"></slot>
        </div>
      );
    }
    return null;
  }

  private renderAction() {
    const hasAction = this.el.querySelector('[slot="action"]') !== null;
    if (hasAction) {
      return (
        <div class="pds-input__action" part="action">
          <slot name="action"></slot>
        </div>
      );
    }
    return null;
  }

  componentWillLoad() {
    this.inheritedAttributes = {
      ...inheritAriaAttributes(this.el)
    };
    this.hasPrefix = this.el.querySelector('[slot="prefix"]') !== null;
    this.hasSuffix = this.el.querySelector('[slot="suffix"]') !== null;
    this.hasPrepend = this.el.querySelector('[slot="prepend"]') !== null;
    this.hasAppend = this.el.querySelector('[slot="append"]') !== null;
    this.hasAction = this.el.querySelector('[slot="action"]') !== null;

    // Store the original pdsInput event emitter
    this.originalPdsInput = this.pdsInput;
  }

  connectedCallback() {
    // Initialize ElementInternals for form association
    if (this.el.attachInternals) {
      this.internals = this.el.attachInternals();
    }
  }

  componentDidLoad() {
    this.debounceChanged();
    this.updateAddonWidths();
    // Set initial form value
    this.updateFormValue();
  }

  componentDidUpdate() {
    this.updateAddonWidths();
  }

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

    // Update form value when value changes
    this.updateFormValue();
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

  private onKeyDownEvent = (ev: KeyboardEvent) => {
    this.pdsKeyDown.emit(ev);
  };

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
   * Emits a `pdsInput` event
   */
  private emitInputChange(event?: Event) {
    const { value } = this;

    // Checks for both null and undefined values
    const newValue = value == null ? value : value.toString();

    this.pdsInput.emit({ value: newValue, event });
  }

  /**
   * Updates the form value using ElementInternals API
   */
  private updateFormValue() {
    if (this.internals && this.internals.setFormValue) {
      const value = this.getValue();
      this.internals.setFormValue(value || null);

      // Set validity based on native input validation
      if (this.nativeInput && this.internals && this.internals.setValidity) {
        this.internals.setValidity(
          this.nativeInput.validity,
          this.nativeInput.validationMessage,
          this.nativeInput
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
    } else if (state instanceof FormData && this.name) {
      // Extract value from FormData using the input's name
      const value = state.get(this.name);
      if (typeof value === 'string') {
        this.value = value;
      }
    }
  }

  render() {
    const {
      componentId,
      disabled,
      errorMessage,
      helperMessage,
      invalid = false,
      label,
    } = this;

    const value = this.getValue();

    const inputWrapperClasses = {
      'pds-input__field-wrapper': true,
      'has-focus': this.hasFocus,
      'has-error': invalid || !!errorMessage,
      'is-disabled': disabled,
      'has-prefix': this.hasPrefix,
      'has-suffix': this.hasSuffix,
      'has-prepend': this.hasPrepend,
      'has-append': this.hasAppend,
    };

    return (
      <Host
        aria-disabled={this.disabled ? 'true' : null}
        aria-readonly={this.readonly ? 'true' : null}
        has-prefix={this.hasPrefix ? 'true' : null}
        has-suffix={this.hasSuffix ? 'true' : null}
        has-prepend={this.hasPrepend ? 'true' : null}
        has-append={this.hasAppend ? 'true' : null}
        has-action={this.hasAction && !this.hideLabel ? 'true' : null}
        full-width={this.fullWidth ? 'true' : null}
      >
        <div class="pds-input">
          {label && (
            <div class="pds-input__label-wrapper">
              <label htmlFor={componentId} class="pds-input__label">
                <span class={this.hideLabel ? 'visually-hidden' : ''}>
                  {label}
                  {this.required && <span class="pds-input__required-indicator"> *</span>}
                </span>
              </label>
              {!this.hideLabel && this.renderAction()}
            </div>
          )}

          <div class={inputWrapperClasses}>
            {this.renderPrepend()}
            {this.renderPrefix()}
            <input
              ref={(input) => (this.nativeInput = input)}
              class="pds-input__field"
              aria-describedby={assignDescription(componentId, invalid, helperMessage)}
              aria-invalid={invalid ? "true" : undefined}
              autocomplete={this.autocomplete}
              disabled={disabled}
              id={componentId}
              max={this.max}
              maxlength={this.maxlength}
              min={this.min}
              minlength={this.minlength}
              name={this.name}
              pattern={this.pattern}
              placeholder={this.placeholder}
              readOnly={this.readonly}
              required={this.required}
              step={this.step}
              type={this.type}
              value={value}
              onInput={this.onInputEvent}
              onChange={this.onChangeEvent}
              onBlur={this.onBlurEvent}
              onFocus={this.onFocusEvent}
              onKeyDown={this.onKeyDownEvent}
              onCompositionstart={this.onCompositionStart}
              onCompositionend={this.onCompositionEnd}
              {...this.inheritedAttributes}
            />
            {this.renderSuffix()}
            {this.renderAppend()}
          </div>

          {helperMessage && (
            <p class="pds-input__helper-message" id={messageId(componentId, 'helper')}>
              {helperMessage}
            </p>
          )}

          {errorMessage && (
            <p class="pds-input__error-message" id={messageId(componentId, 'error')}>
              <pds-icon icon={danger} size="small" />
              {errorMessage}
            </p>
          )}
        </div>
      </Host>
    );
  }
}
