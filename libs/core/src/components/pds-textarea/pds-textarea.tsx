import { AttachInternals, Build, Component, Element, Host, h, Prop, Event, EventEmitter } from '@stencil/core';
import { assignDescription, isRequired, messageId } from '../../utils/form';
import { TextareaChangeEventDetail } from './textarea-interface';
import { PdsLabel } from '../_internal/pds-label/pds-label';
import { danger } from '@pine-ds/icons/icons';

@Component({
  tag: 'pds-textarea',
  styleUrls: ['../../global/styles/base.scss', 'pds-textarea.scss'],
  shadow: true,
  formAssociated: true
})
export class PdsTextarea {
  @Element() el: HTMLPdsTextareaElement;

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
  @Prop({mutable: true}) value?: string;

  /**
   * Event emitted whenever the value of the textarea changes.
   */
  @Event() pdsTextareaChange: EventEmitter<TextareaChangeEventDetail>;

  @AttachInternals() internals: ElementInternals;

  private onTextareaChange = (ev: Event) => {
    const textarea = ev.target as HTMLTextAreaElement;
    isRequired(textarea, this);

    if (textarea) {
      this.value = textarea.value;
    }

    this.pdsTextareaChange.emit({value: this.value, event: ev});

    if (Build.isDev == false) {
      if (this.internals && typeof this.internals.setFormValue === 'function') {
        this.internals.setFormValue(this.value);
      }
    }
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
            <PdsLabel htmlFor={this.componentId} text={this.label} />
          }
          <textarea
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
            onChange={this.onTextareaChange}
          >{this.value}</textarea>
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
