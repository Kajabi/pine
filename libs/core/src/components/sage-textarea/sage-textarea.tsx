import { Component, Element, Host, h, Prop, Event, EventEmitter } from '@stencil/core';
import { isRequired } from '../../utils/utils';
import { TextareaChangeEventDetail } from './textarea-interface';

@Component({
  tag: 'sage-textarea',
  styleUrl: 'sage-textarea.scss',
  shadow: true,
})
export class SageTextarea {
  @Element() el: HTMLDivElement;

  /**
   * A unique identifier for the textarea
   */
  @Prop() componentId?: string;

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
  @Event() sageTextareaChange: EventEmitter<TextareaChangeEventDetail>;

  private onTextareaChange = (ev: Event) => {
    const textarea = ev.target as HTMLTextAreaElement;
    isRequired(textarea, this);

    if (textarea) {
      this.value = textarea.innerHTML;
    }

    this.sageTextareaChange.emit({value: this.value, event: ev});
  };

  private textareaClassNames() {
    const classNames = ['sage-textarea__field'];

    if (this.invalid && this.invalid === true) {
      classNames.push('is-invalid');
    }

    return classNames.join('  ');
  }

  /**
   * Create id for messaging
   */
  private messageId = (id: string, messageType: string) => {
    return `${id}__${messageType}-message`;
  };

  /**
   * Assign aria-description id to relate messages with input
   */
  private assignDescription = () => {
    let relatedId = this.messageId(this.componentId, 'helper')

    if (!this.invalid || !this.hintMessage) return;
    if (this.invalid) relatedId = this.messageId(this.componentId, 'error');

    return relatedId;
  };

  render() {
    return (
      <Host
        aria-disabled={this.disabled ? 'true' : null}
      >
        <div class="sage-textarea">
          {this.label &&
            <label htmlFor={this.componentId}>
              {this.label}
            </label>
          }
          <textarea
            aria-describedby={this.assignDescription()}
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
              class="sage-textarea__hint-message"
              id={this.messageId(this.componentId, 'helper')}
            >
              {this.hintMessage}
            </p>
          }
          {this.invalid &&
            <p
              aria-live="assertive"
              class="sage-textarea__error-message"
              id={this.messageId(this.componentId, 'error')}
            >
              {this.errorMessage}
            </p>
          }
        </div>
      </Host>
    );
  }
}
