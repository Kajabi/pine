import { Component, Element, Host, h, Prop, Event, EventEmitter } from '@stencil/core';
import { ChangeEvent } from 'react';

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
  @Prop() errorText?: string = null;

  /**
   * Displays a hint or description of the textarea
   * @defaultValue null
   */
  @Prop() hintText?: string = null;

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
  @Prop() labelText?: string = null;

  /**
   * Specifies the name, submitted with the form name/value pair
   */
  @Prop() name: string;

  /**
   * Specifies a short hint that describes the expected value of the textarea
   * @defaultValue null
   */
  @Prop() placeholderText?: string = null;

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
   */
  @Event() sageTextareaInput: EventEmitter<ChangeEvent>;
  private onTextareaInputEvent = (ev: Event) => {
    const textarea = ev.target as HTMLTextAreaElement;
    if (this.required === true) {
      const validity = textarea.checkValidity();
      (validity === false) ? this.invalid = true : this.invalid = false;
    }
    if (textarea) {
      this.value = textarea.innerHTML;
    }
    this.sageTextareaInput.emit();
  };

  render() {
    return (
      <Host
        aria-disabled={this.disabled ? 'true' : null}
      >
        <div class="sage-textarea">
          {this.labelText && <label htmlFor={this.componentId}>{this.labelText}</label>}
          <textarea class="sage-textarea__field"
            disabled={this.disabled}
            id={this.componentId}
            name={this.name}
            placeholder={this.placeholderText}
            readOnly={this.readonly}
            required={this.required}
            rows={this.rows}
            onChange={this.onTextareaInputEvent}
          >{this.value}</textarea>
          {this.hintText && <p class="sage-textarea__hint-text">{this.hintText}</p>}
          {this.invalid && <p class="sage-textarea__error-text">{this.errorText}</p>}
        </div>
      </Host>
    );
  }
}
