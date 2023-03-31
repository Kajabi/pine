import { Component, Host, h, Prop, Event, EventEmitter } from '@stencil/core';

@Component({
  tag: 'sage-textarea',
  styleUrl: 'sage-textarea.scss',
  shadow: true,
})
export class SageTextarea {
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
  @Prop() hint?: string = null;

  /**
   * Indicates whether or not the textarea is invalid or throws an error
   * @defaultValue null
   */
  @Prop({mutable: true}) invalid?: boolean = null;

  /**
   * A unique identifier for the textarea
   * @defaultValue null
   */
  @Prop() textareaId?: string = null;

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
  @Prop() placeholder?: string = null;

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
   * The value of the texarea
   * @defaultValue null
   */
  @Prop({mutable: true}) value?: string = null;

  /**
   * Emitted when a keyboard input occurred
   */
  @Event() sageTextarea: EventEmitter<InputEvent>;

  private onTextareaInputEvent = (ev: Event) => {
    const input = ev.target as HTMLInputElement | null;
    if (input) this.value = input.value || '';
    (input.checkValidity() === false) ? this.invalid = true : this.invalid = false;
    this.sageTextarea.emit(ev as InputEvent);
  };

  render() {
    return (
      <Host
        aria-disabled={this.disabled ? 'true' : null}
      >
        <div class="sage-textarea">
          <label htmlFor={this.textareaId}>{this.label}</label>
          <textarea class="sage-textarea__field"
            disabled={this.disabled}
            id={this.textareaId}
            name={this.name}
            placeholder={this.placeholder}
            readOnly={this.readonly}
            required={this.required}
            rows={this.rows}
            value={this.value}
            onInput={this.onTextareaInputEvent}
          />
          {this.hint && <p class="sage-textarea__hint">{this.hint}</p>}
          {this.invalid && <p class="sage-textarea__error-text">{this.errorText}</p>}
        </div>
      </Host>
    );
  }
}
