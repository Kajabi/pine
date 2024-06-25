import { Component, Element, Event, EventEmitter, Listen, h, Host, Prop } from '@stencil/core';
import { assignDescription, messageId } from '../../utils/form';
import { PdsLabel } from '../_internal/pds-label/pds-label';

/**
 * @slot prefix - Element before the form control
 * @slot suffix - Element after the form control
 */
@Component({
  tag: 'pds-input',
  styleUrl: 'pds-input.scss',
  shadow: true,
})
export class PdsInput {
  @Element() el!: HTMLPdsInputElement;

  /**
   * A unique identifier used for the underlying component `id` attribute.
   */
  @Prop() componentId!: string;

  /**
   * Indicates whether or not the input field is disabled.
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
   * Indicates whether or not the input field is invalid or throws an error.
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

  @Prop() prefixType?: 'static' | 'text' | 'interactive';
  @Prop() suffixType?: 'static' | 'text' | 'interactive';

  /**
   * Indicates whether or not the input field is readonly.
   */
  @Prop() readonly?: boolean;

  /**
   * Indicates whether or not the input field is required.
   */
  @Prop() required?: boolean;

  /**
   * Determines the type of control that will be displayed
   `'email'`, `'number'`, `'password'`, `'tel'`, `'text'`
   * @defaultValue "text"
   */
  @Prop() type = 'text';

  /**
   * The value of the input.
   */
  @Prop({mutable: true}) value?: string;

  /**
   * Emitted when a keyboard input occurred.
   */
  @Event() pdsInput: EventEmitter<InputEvent>;

  private onInputEvent = (ev: Event) => {
    const input = ev.target as HTMLInputElement | null;
    if (input) {
      this.value = input.value || '';
    }
    this.pdsInput.emit(ev as InputEvent);
  };

  private formControlClassNames() {
    const classNames = ["pds-input__form-control"];

    return classNames.join('  ');
  }

  @Listen('resize', { target: 'window' })
  handleResize() {
    this.updateInputPadding();
  }

  componentDidLoad() {
    this.updateInputPadding();

    const prefixSlot = this.el.shadowRoot.querySelector('slot[name="prefix"]');
    const suffixSlot = this.el.shadowRoot.querySelector('slot[name="suffix"]');

    const observer = new MutationObserver(() => this.updateInputPadding());

    if (prefixSlot) {
      observer.observe(prefixSlot, { childList: true, subtree: true });
    }

    if (suffixSlot) {
      observer.observe(suffixSlot, { childList: true, subtree: true });
    }
  }

  private updateInputPadding() {
    const prefixSlot = this.el.shadowRoot.querySelector('.pds-input__prefix-wrapper');
    const suffixSlot = this.el.shadowRoot.querySelector('.pds-input__suffix-wrapper');

    const prefixWidth = prefixSlot ? (prefixSlot as HTMLElement).offsetWidth + 12 : 8;
    const suffixWidth = suffixSlot ? (suffixSlot as HTMLElement).offsetWidth  + 12 : 8;

    if (prefixWidth != 0) {
      this.el.style.setProperty('--input-prefix-padding', `${prefixWidth}px`);
    }

    if (suffixWidth != 0) {
      this.el.style.setProperty('--input-suffix-padding', `${suffixWidth}px`);
    }
  }

  render() {
    return (
      <Host
        aria-disabled={this.disabled ? 'true' : null}
      >
        <div class="pds-input">
          <PdsLabel htmlFor={this.componentId} text={this.label} />
          <div class={this.formControlClassNames()}>
            <div class="pds-input__prefix-wrapper" part={`prefix-${this.prefixType}`}>
              <slot name="prefix"></slot>
            </div>

            <input class="pds-input__field"
              aria-describedby={assignDescription(this.componentId, this.invalid, this.helperMessage)}
              aria-invalid={this.invalid ? "true" : undefined}
              disabled={this.disabled}
              id={this.componentId}
              name={this.name}
              placeholder={this.placeholder}
              readOnly={this.readonly}
              required={this.required}
              type={this.type}
              value={this.value}
              onInput={this.onInputEvent}
            />
            <div class="pds-input__suffix-wrapper" part={`suffix-${this.suffixType}`}>
              <slot name="suffix"></slot>
            </div>
          </div>
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
              {this.errorMessage}
            </p>
          }
        </div>
      </Host>
    );
  }
}
