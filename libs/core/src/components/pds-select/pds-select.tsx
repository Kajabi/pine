import { Component, Event, EventEmitter, Host, h, Prop, Watch } from '@stencil/core';
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
   * Indicates whether multiple options can be selected.
   */
  @Prop() multiple: boolean;

  /**
   * Specifies the name. Submitted with the form name/value pair.
   */
  @Prop() name!: string;

  /**
   * Indicates whether or not the select field is required.
   */
  @Prop() required: boolean;

  /**
   * The value(s) of the selected option(s).
   *
   */
  @Prop({ mutable: true }) value?: string | string[];

  /**
   * Emitted when a keyboard input occurred.
   */
  @Event() pdsSelectChange: EventEmitter<InputEvent>;

  @Watch('value')
  /**
   * Handles the change in the value of the select component.
   * This method is called whenever the value of the select component changes.
   * It updates the selected option accordingly.
   */
  valueChanged() {
    this.updateSelectedOption();
  }

  /**
   * Lifecycle method that is called just before the component is loaded.
   * This method is used to perform any necessary updates to the selected option
   * before the component is rendered.
   *
   * @returns {void}
   */
  componentWillLoad() {
    this.updateSelectedOption();
  }

  /**
   * Updates the selected option in the select element based on the current value.
   *
   * This method iterates through all the options of the select element and sets the
   * 'selected' attribute on the option that matches the current value. If an option
   * does not match the current value, the 'selected' attribute is removed.
   *
   * @private
   * @returns {void}
   */
  private updateSelectedOption() {
    if (this.selectEl) {
      const options = this.selectEl.options;

      // Update the selected attribute for all options
      Array.from(options).map((option: HTMLOptionElement) => {
        if (Array.isArray(this.value)) {
          option.selected = this.value.includes(option.value);
        } else {
          option.selected = this.value === option.value;
        }
      });
    };
  }

  /**
   * Emits an event on input change
  */
  private onSelectUpdate = (e: Event) => {
    const target = e.target as HTMLSelectElement

    const values = Array.from(target.options)
        .filter((option) => ( option.selected))
        .map((option) => ( option.value));

    if (values.length === 1 && !this.multiple) {
        this.value = values[0];
    } else {
        this.value = values;
    }

    this.pdsSelectChange.emit(e as InputEvent);
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
    const assignedElements = slot.assignedElements({ flatten: true }) as (HTMLOptionElement | HTMLOptGroupElement)[];

    assignedElements.forEach((item) => {
      if (item.tagName === 'OPTION' || item.tagName === 'OPTGROUP') {
        const clonedItem = item.cloneNode(true) as HTMLOptionElement | HTMLOptGroupElement;
        if (clonedItem.tagName === 'OPTION' && (clonedItem as HTMLOptionElement).value === this.value) {
          (clonedItem as HTMLOptionElement).selected = true;
        }
        this.selectEl.appendChild(clonedItem);
      }
    });

    this.updateSelectedOption();
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
            multiple={this.multiple}
            name={this.name}
            onChange={this.onSelectUpdate}
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
          {!this.multiple && <pds-icon class="pds-select__select-icon" name="enlarge" />}
        </div>
      </Host>
    );
  }
}
