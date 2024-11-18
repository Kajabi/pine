import { Component, Event, EventEmitter, Host, h, Prop } from '@stencil/core';
import { messageId } from '../../utils/form';
import { PdsLabel } from '../_internal/pds-label/pds-label';
import { danger } from '@pine-ds/icons/icons';

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
  @Prop() disabled: boolean;

  /**
   * Specifies the error message and provides an error-themed treatment to the field.
   */
  @Prop() errorMessage: string;

  /**
   * Displays a message or hint below the input field.
   */
  @Prop() helperMessage: string;

  /**
   * Text to be displayed as the select label.
   */
  @Prop() label: string;

  /**
   * Specifies the name. Submitted with the form name/value pair.
   */
  @Prop() name!: string;

  /**
   * Indicates whether or not the select field is required.
   */
  @Prop() required: boolean;

  /**
   * The value of the input.
   */
  @Prop({ mutable: true }) value?: string;

  /**
   * Emitted when a keyboard input occurred.
   */
  @Event() pdsSelect: EventEmitter<InputEvent>;

  private selectEl!: HTMLSelectElement;

  private onSelectEvent = (ev: Event) => {
    const select = ev.target as HTMLSelectElement;
    this.value = select.value;
    console.log('this.value', this.value);
    this.pdsSelect.emit(ev as InputEvent);
  };

  private handleSlotChange = () => {
    const slot = this.selectEl.querySelector('slot');
    const slottedOptions = slot.assignedNodes({ flatten: true });
    slottedOptions.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE && node instanceof HTMLOptionElement) {
        this.selectEl.appendChild(node.cloneNode(true));
      }
    });
  };

  render() {
    return (
      <Host aria-disabled={this.disabled ? 'true' : null}>
        <div class="pds-select">
          <PdsLabel htmlFor={this.componentId} text={this.label} />
          <select
            class="pds-select__field"
            disabled={this.disabled}
            id={this.componentId}
            name={this.name}
            onChange={this.onSelectEvent}
            required={this.required}
            ref={(el) => (this.selectEl = el as HTMLSelectElement)}
          >
            <slot onSlotchange={this.handleSlotChange}></slot>
          </select>
          {this.helperMessage && (
            <p class="pds-select__helper-message" id={messageId(this.componentId, 'helper')}>
              {this.helperMessage}
            </p>
          )}
          {this.errorMessage && (
            <p class="pds-select__error-message" id={messageId(this.componentId, 'error')} aria-live="assertive">
              <pds-icon icon={danger} size="small" />
              {this.errorMessage}
            </p>
          )}
        </div>
      </Host>
    );
  }
}
