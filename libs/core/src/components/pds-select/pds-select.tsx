import { Component, Event, EventEmitter, Host, h, Prop } from '@stencil/core';
import { messageId } from '../../utils/form';
import { PdsLabel } from '../_internal/pds-label/pds-label';

@Component({
  tag: 'pds-select',
  styleUrls: ['../../global/styles/base.scss', 'pds-select.scss'],
  shadow: true,
})
export class PdsSelect {
  /**
   * A unique identifier used for the underlying component `id` attribute.
   */
  @Prop() componentId!: string;

  /**
   * Indicates whether or not the select field is disabled.
   */
  @Prop() disabled?: boolean;

  /**
   * Specifies the error message and provides an error-themed treatment to the field.
   */
  @Prop() errorMessage?: string;

  /**
   * Displays a message or hint below the input field.
   */
  @Prop() hasError?: boolean;

  /**
   * Displays a message or hint below the input field.
   */
  @Prop() helperMessage?: string;

  /**
   * Text to be displayed as the select label.
   */
  @Prop() label?: string;

  /**
   * Specifies the name. Submitted with the form name/value pair.
   */
  @Prop() name!: string;

  /**
   * An array of options to be rendered as select options.
   */
  @Prop() options: string; // Expecting a JSON string of options

  /**
   * Indicates whether or not the select field is required.
   */
  @Prop() required?: boolean;

  /**
   * The value of the input.
   */
  @Prop({ mutable: true }) value?: string;

  /**
   * Emitted when a keyboard input occurred.
   */
  @Event() pdsSelect: EventEmitter<InputEvent>;

  private onSelectEvent = (ev: Event) => {
    const select = ev.target as HTMLInputElement | null;
    if (select) {
      this.value = select.value || '';
    }
    this.pdsSelect.emit(ev as InputEvent);
  };

  /**
   * Utility to parse JSON options safely
   */
  get parsedOptions() {
    try {
      return JSON.parse(this.options) || [];
    } catch (error) {
      console.error('Invalid options format:', error);
      return [];
    }
  }

  render() {
    return (
      <Host aria-disabled={this.disabled ? 'true' : null}>
        <div class="pds-select">
          <PdsLabel htmlFor={this.componentId} text={this.label} />
          <select
            class={`pds-select__field ${this.hasError ? 'has-error' : ''}`}
            disabled={this.disabled}
            id={this.componentId}
            name={this.name}
            onChange={this.onSelectEvent}
            required={this.required}
          >
            {this.parsedOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {this.helperMessage && (
            <p class="pds-select__helper-message" id={messageId(this.componentId, 'helper')}>
              {this.helperMessage}
            </p>
          )}
          {this.errorMessage && (
            <p class="pds-select__error-message" id={messageId(this.componentId, 'error')} aria-live="assertive">
              {this.errorMessage}
            </p>
          )}
        </div>
      </Host>
    );
  }
}
