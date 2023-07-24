import { Component, Element, Host, h, Prop, Event, EventEmitter, Listen, Watch } from '@stencil/core';

@Component({
  tag: 'pds-select',
  styleUrl: 'pds-select.scss',
  shadow: true,
})
export class PdsSelect {
  @Element() el!: HTMLPdsSelectElement;
  private comboInputRef?: HTMLDivElement;

  @Prop() componentId!: string;
  @Prop() disabled = false;
  @Prop() errorMessage?: string;
  @Prop() hintMessage?: string;
  @Prop({ mutable: true }) invalid = false;
  @Prop() label?: string;
  @Prop() name: string = this.componentId;
  @Prop() placeholder?: string;
  @Prop() readonly = false;
  @Prop() required = false;
  @Prop({ mutable: true }) value?: string;
  @Prop({ mutable: true }) selectedOptionText?: string;
  @Prop() selectedOptionValue?: string;

  private isComboboxOpen = false;
  private selectedOptionId?: string;

  @Event() pdsSelectChange!: EventEmitter<string>;

  @Listen('pdsSelectOptionSelected')
  pdsSelectedOption(event: CustomEvent<any>) {
    const { value, text } = event.detail;

    // Set the value to equal the text if the value is empty
    if(this.selectedOptionValue === undefined) {
      this.selectedOptionValue = this.selectedOptionText;
    }

    if (this.selectedOptionValue !== value) {
      // Deselect the previous selected option, if any
      const prevSelectedOption = this.el.querySelector('pds-select-option[selected]') as HTMLPdsSelectOptionElement;

      if (prevSelectedOption) {
        prevSelectedOption.selected = false;
      }

      // Select the newly clicked option
      this.selectedOptionValue = value;
      this.selectedOptionText = text;

      const selectedOption = this.el.querySelector(`pds-select-option[value="${value}"]`) as HTMLPdsSelectOptionElement;

      if (selectedOption) {
        selectedOption.selected = true;
        // Update the selectedOptionId with the componentId of the selected option
        this.selectedOptionId = selectedOption.componentId;
      }

      this.pdsSelectChange.emit(this.selectedOptionValue);
    }
  }

  private selectClassNames() {
    const classNames = ['combo-input'];

    if (this.invalid && this.invalid === true) {
      classNames.push('is-invalid');
    }

    return classNames.join(' ');
  }

  componentDidLoad() {
    // Find the first 'pds-select-option' with 'selected=true'
    const firstSelectedOption = this.el.querySelector('pds-select-option[selected]') as HTMLPdsSelectOptionElement;

    if (firstSelectedOption) {
      // Set the selected option value to the first selected option's value
      this.selectedOptionValue = firstSelectedOption.value;
    } else {
      // If no option is selected, get the first 'pds-select-option' and set the value accordingly
      const firstOption = this.el.querySelector('pds-select-option') as HTMLPdsSelectOptionElement;

      if (firstOption) {
        if(firstOption.innerHTML) {
          this.selectedOptionText = firstOption.innerHTML
        } else {
          this.selectedOptionValue = firstOption.value;
        }
      } else {
        this.selectedOptionValue = ''; // No options available, set an empty string or placeholder if available
      }
    }

    // Use shadowRoot to find the .combo-input element
    this.comboInputRef = this.el.shadowRoot?.querySelector('.combo-input') as HTMLDivElement;

    if (this.comboInputRef) {
      this.comboInputRef.addEventListener('click', this.handleComboboxToggle);
    }
  }

  private handleComboboxToggle = () => {
    this.isComboboxOpen = !this.isComboboxOpen;
    this.comboInputRef.setAttribute('aria-expanded', this.isComboboxOpen.toString());
  };

  @Listen('keydown', {})
  handleComboInputKeyDown(event: KeyboardEvent) {
    if (event.key === "Enter" || event.key === " ") {
      this.handleComboboxToggle();
    }
  }

  // eslint-disable-next-line @stencil/no-unused-watch
  @Watch('selectedOptionValue')
  updateComboboxContent(newValue: string) {
    const comboInput = this.el.querySelector('.combo-input');
    if (comboInput) {
      comboInput.textContent = newValue || '';
    }
  }

  render() {
    return (
      <Host>
        <div class="pds-select combo js-select">
          {this.label && (
            <label
              htmlFor={this.componentId}
              id={`${this.componentId}-label`}
              class="pds-select__label combo-label"
            >
              {this.label}
            </label>
          )}

          <div
            aria-controls={`${this.componentId}-listbox`}
            aria-expanded={this.isComboboxOpen.toString()}
            aria-haspopup="listbox"
            aria-labelledby={`${this.componentId}-label`}
            aria-activedescendant={this.selectedOptionId ? `${this.componentId}-option-${this.selectedOptionId}` : undefined}
            class={this.selectClassNames()}
            id={this.componentId}
            role="combobox"
            tabindex="0"
          >
            {this.selectedOptionText || this.selectedOptionValue}
          </div>

          <div
            aria-labelledby={`${this.componentId}-label`}
            class="pds-select__menu combo-menu"
            id={`${this.componentId}-listbox`}
            role="listbox"
            tabindex="-1"
          >
            <slot></slot>
          </div>
        </div>
      </Host>
    );
  }
}
