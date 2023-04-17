import { Component, Element, Host, h, Prop, Event, EventEmitter } from '@stencil/core';
import { ChangeEvent } from 'react';
import { isRequired } from '../../utils/utils';


@Component({
  tag: 'sage-textarea',
  styleUrl: 'sage-textarea.scss',
  shadow: true,
})
export class SageTextarea {
  @Element() el: HTMLDivElement;

  /**
   * Indicates whether or not the textarea is disabled
   * @defaultValue false
   */
  @Prop() disabled? = false;

  /**
   * Specifies the error text and provides an error-themed treatment to the field
   * @defaultValue null
   */
  @Prop() errorMessage?: string = null;

  /**
   * Displays a hint or description of the textarea
   * @defaultValue null
   */
  @Prop() hintMessage?: string = null;

  /**
   * Indicates whether or not the textarea is invalid or throws an error
   * @defaultValue null
   */
  @Prop({mutable: true}) invalid?: boolean = null;

  /**
   * A unique identifier for the textarea
   * @defaultValue null
   */
  @Prop() componentId?: string = null;

  /**
   * Text to be displayed as the textarea label
   * @defaultValue null
   */
  @Prop() label?: string = null;

  /**
   * Specifies the name, submitted with the form name/value pair
   */
  @Prop() name: string;

  /**
   * Specifies a short hint that describes the expected value of the textarea
   * @defaultValue null
   */
  @Prop() placeholderMessage?: string = null;

  /**
   * Indicates whether or not the textarea is readonly
   * @defaultValue false
   */
  @Prop() readonly?: boolean = false;

  /**
   * Indicates whether or not the textarea is required
   * @defaultValue false
   */
  @Prop() required?: boolean = false;

  /**
   * Sets number of rows of text visible without needing to scroll in the textarea
   * @defaultValue null
   */
  @Prop() rows?: number = null;

  /**
   * The value of the textarea
   * @defaultValue null
   */
  @Prop({mutable: true}) value?: string = null;

  /**
   * Event emitted whenever the value of the textarea changes
   */
  @Event() sageTextareaInput: EventEmitter<ChangeEvent>;
  private onTextareaInputEvent = (ev: Event) => {
    const textarea = ev.target as HTMLTextAreaElement;
    isRequired(textarea, this);
    if (textarea) {
      this.value = textarea.innerHTML;
    }
    this.sageTextareaInput.emit();
  };

  private textareaClassNames = () => {
    let className = `sage-textarea__field`;
    if (this.invalid && this.invalid === true) {
      const invalidClassName = `is-invalid`;
      className += ' ' + invalidClassName;
    }
    return className;
  };

  render() {
    return (
      <Host
        aria-disabled={this.disabled ? 'true' : null}
      >
        <div class="sage-textarea">
          {this.label && <label htmlFor={this.componentId}>{this.label}</label>}
          <textarea
            class={this.textareaClassNames()}
            disabled={this.disabled}
            id={this.componentId}
            name={this.name}
            placeholder={this.placeholderMessage}
            readOnly={this.readonly}
            required={this.required}
            rows={this.rows}
            onChange={this.onTextareaInputEvent}
          >{this.value}</textarea>
          {this.hintMessage && <p class="sage-textarea__hint-message">{this.hintMessage}</p>}
          {this.invalid && <p class="sage-textarea__error-message">{this.errorMessage}</p>}
        </div>
      </Host>
    );
  }
}
