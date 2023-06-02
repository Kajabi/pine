import { Component, Element, Host, h, Prop, Event, EventEmitter } from '@stencil/core';
import { assignDescription, isRequired, messageId } from '../../utils/utils';
import { TextareaChangeEventDetail } from './textarea-interface';

@Component({
  tag: 'pds-textarea',
  styleUrl: 'pds-textarea.scss',
  shadow: true,
})
export class PdsTextarea {
  @Element() el: HTMLDivElement;

  /**
   * A unique identifier for the textarea
   */
  @Prop() componentId!: string;

  /**
   * Indicates whether or not the textarea is disabled
   * @defaultValue false
   */
  @Prop() disabled = false;

  /**
   * Specifies the error text and provides an error-themed treatment to the field
   */
  @Prop() errorMessage?: string;

  /**
   * Displays a hint or description of the textarea
   */
  @Prop() hintMessage?: string;

  /**
   * Indicates whether or not the textarea is invalid or throws an error
   * @defaultValue false
   */
  @Prop({mutable: true}) invalid = false;

  /**
   * Text to be displayed as the textarea label
   */
  @Prop() label?: string;

  /**
   * Specifies the name, submitted with the form name/value pair. This value will mirror the componentId
   */
  @Prop() name: string = this.componentId;

  /**
   * Specifies a short hint that describes the expected value of the textarea
   */
  @Prop() placeholder?: string;

  /**
   * Indicates whether or not the textarea is readonly
   * @defaultValue false
   */
  @Prop() readonly = false;

  /**
   * Indicates whether or not the textarea is required
   * @defaultValue false
   */
  @Prop() required = false;

  /**
   * Sets number of rows of text visible without needing to scroll in the textarea
   */
  @Prop() rows?: number;

  /**
   * The value of the textarea
   */
  @Prop({mutable: true}) value?: string;

  /**
   * Event emitted whenever the value of the textarea changes
   */
  @Event() pdsTextareaChange: EventEmitter<TextareaChangeEventDetail>;

  private onTextareaChange = (ev: Event) => {
    const textarea = ev.target as HTMLTextAreaElement;
    isRequired(textarea, this);

    if (textarea) {
      this.value = textarea.innerHTML;
    }

    this.pdsTextareaChange.emit({value: this.value, event: ev});
  };

  private textareaClassNames() {
    const classNames = ['pds-textarea__field'];

    if (this.invalid && this.invalid === true) {
      classNames.push('is-invalid');
    }

    return classNames.join('  ');
  }

  render() {
    return (
      <Host
        aria-disabled={this.disabled ? 'true' : null}
      >
        <div class="pds-textarea">
          {this.label &&
            <label htmlFor={this.componentId}>
              {this.label}
            </label>
          }
          <textarea
            aria-describedby={assignDescription(this.componentId, this.invalid, this.hintMessage)}
            aria-invalid={this.invalid ? "true" : undefined}
            class={this.textareaClassNames()}
            disabled={this.disabled}
            id={this.componentId}
            name={this.name}
            placeholder={this.placeholder}
            readOnly={this.readonly}
            required={this.required}
            rows={this.rows}
            onChange={this.onTextareaChange}
          >{this.value}</textarea>
          {this.hintMessage &&
            <p
              class="pds-textarea__hint-message"
              id={messageId(this.componentId, 'helper')}
            >
              {this.hintMessage}
            </p>
          }
          {this.invalid &&
            <p
              aria-live="assertive"
              class="pds-textarea__error-message"
              id={messageId(this.componentId, 'error')}
            >
              {this.errorMessage}
            </p>
          }
        </div>
      </Host>
    );
  }
}
