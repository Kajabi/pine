import { Component, Event, EventEmitter, Host, h, Prop } from '@stencil/core';
import { messageId } from '../../utils/form';
import { PdsLabel } from '../_internal/pds-label/pds-label';

@Component({
  tag: 'pds-select',
  styleUrl: 'pds-select.scss',
  shadow: true,
})
export class PdsSelect {
  /**
   * A reference to the HTMLSelectElement used in the component.
   */
  private selectEl!: HTMLSelectElement;

  /**
   * A reference to the HTMLDivElement that serves as the container for slot elements.
   * This property is used to manipulate or access the slot container directly within the component.
   */
  private slotContainer!: HTMLDivElement;

  /**
   * Specifies if and how the browser provides `autocomplete` assistance for the field.
   */
  @Prop() autocomplete: string;

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
   * The value of the select field.
   */
  @Prop({ mutable: true }) value?: string;

  /**
   * Emitted when a keyboard input occurred.
   */
  @Event() pdsSelect: EventEmitter<InputEvent>;

  /**
   * Handles the select event for the component.
   *
   * @param ev - The event object triggered by the select action.
   * @remarks
   * This method casts the event target to an HTMLSelectElement and updates the component's value
   * with the selected option's value. It then emits a custom event (`pdsSelect`) with the original event.
   */
  private onSelectEvent = (ev: Event) => {
    const select = ev.target as HTMLSelectElement;
    this.value = select.value;
    this.pdsSelect.emit(ev as InputEvent);
  };

  /**
   * Handles the change event for the slot element.
   * This method is triggered when the slot content changes.
   * It updates the inner HTML of the select element by cloning and appending
   * the assigned <option> elements from the slot.
   */
  private handleSlotChange = () => {
    const slot = this.slotContainer.querySelector('slot') as HTMLSlotElement;

    this.selectEl.innerHTML = '';
    const assignedElements = slot.assignedElements({ flatten: true }) as HTMLOptionElement[];

    assignedElements.map((item: HTMLOptionElement) => {
      const option = item;

      if (option.tagName === 'OPTION') {
        this.selectEl.appendChild(option.cloneNode(true));
      }
    });
  };

  render() {
    return (
      <Host aria-disabled={this.disabled ? 'true' : null}>
        <div class="pds-select">
          <PdsLabel htmlFor={this.componentId} text={this.label} />
          <select
            autocomplete={this.autocomplete}
            class="pds-select__field"
            disabled={this.disabled}
            id={this.componentId}
            name={this.name}
            onChange={this.onSelectEvent}
            required={this.required}
            ref={(el) => (this.selectEl = el as HTMLSelectElement)}
          ></select>
          <div aria-hidden="true" class="hidden" ref={(el) => (this.slotContainer = el)}>
            <slot onSlotchange={this.handleSlotChange}></slot>
          </div>
          {(this.helperMessage || this.errorMessage) && (
            <div class="pds-select__message">
              {this.helperMessage && (
                <p class="pds-select__helper-message" id={messageId(this.componentId, 'helper')}>
                  {this.helperMessage}
                </p>
              )}
              {this.errorMessage && (
                <p class="pds-select__error-message" id={messageId(this.componentId, 'error')} aria-live="assertive">
                  <pds-icon name="danger" size="small" />
                  {this.errorMessage}
                </p>
              )}
            </div>
          )}
          <pds-icon class="pds-select__select-icon" name="enlarge" />
        </div>
      </Host>
    );
  }
}
