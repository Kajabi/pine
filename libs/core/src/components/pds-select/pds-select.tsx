import { Component, Element, Host, h, Prop, Event, EventEmitter, Listen, Watch } from '@stencil/core';

@Component({
  tag: 'pds-select',
  styleUrl: 'pds-select.scss',
  shadow: true,
})
export class PdsSelect {
  @Element() el!: HTMLPdsSelectElement;
  private comboWrapperRef?: HTMLDivElement;
  private comboInputRef?: HTMLDivElement;
  private isComboboxOpen = false;
  private selectedOptionId?: string;

  /**
   * Track the index of the focused option
   */
  private focusIndex = -1;

  /**
   * Flag to remember if the combobox was focused before blur
   */
  private wasComboboxFocused = false;

  /**
   * Flag to remember if the combobox was focused before blur
   */
  private wasComboboxFocusedId: string;

  /**
   * Flag to remember focused combobox index
   */
  private wasComboboxFocusedIndex: number;


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



  @Event() pdsSelectChange!: EventEmitter<string>;

  @Listen('pdsSelectOptionSelected')
  pdsSelectedOption(event: CustomEvent<any>) {
    const { id, text, value } = event.detail;

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

      const selectedOption = this.el.querySelector(`pds-select-option[component-id="${id}"]`) as HTMLPdsSelectOptionElement;

      if (selectedOption) {
        selectedOption.selected = true;
        // Update the selectedOptionId with the componentId of the selected option
        this.selectedOptionId = selectedOption.componentId;
      }

      this.pdsSelectChange.emit(this.selectedOptionValue);
    }

    this.handleComboboxToggle();
  }

  private selectInputClassNames() {
    const classNames = ['pds-select__input combo-input'];

    if (this.invalid && this.invalid === true) {
      classNames.push('is-invalid');
    }

    // Add 'is--current' class to the combo box if the combobox was focused before blur
    if (this.wasComboboxFocused) {
      classNames.push('is--current');
    }

    return classNames.join(' ');
  }

  private handleComboInputBlur() {
    // Set the flag to remember the focus state when the combobox loses focus
    console.log('handleComboInputBlur-  document.activeElement: ', document.activeElement, ' this.comboInputRef: ', this.comboInputRef);
    this.wasComboboxFocused = document.activeElement === this.comboInputRef;
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
      this.comboInputRef.addEventListener('blur', this.handleComboInputBlur);
    }
  }

  private handleComboboxToggle = () => {
    this.comboWrapperRef =  this.el.shadowRoot?.querySelector('.pds-select') as HTMLDivElement;

    this.isComboboxOpen = !this.isComboboxOpen;
    this.comboInputRef.setAttribute('aria-expanded', this.isComboboxOpen.toString());

    if (this.isComboboxOpen) {
      this.comboWrapperRef.classList.add('is-open')
      // Move focus to the input when the combobox is opened
      this.comboInputRef?.focus();

      // Set the focus index to the first option
      if (!this.focusIndex && !this.wasComboboxFocused)  {
        this.focusIndex = 0;
      }
      this.wasComboboxFocused = true;

      if (this.wasComboboxFocused) {
        // If the combobox was previously focused, reapply focus to the previously focused option
        this.focusOptionAtIndex(this.wasComboboxFocusedIndex);
      }
    } else {
      this.comboWrapperRef.classList.remove('is-open')
      // Reset focus index when the combobox is closed
      this.focusIndex = -1;

      if (this.wasComboboxFocused) {
        // If the combobox was focused before the click, set the focus index to 0
        this.focusIndex = 0;
      }
    }
  };

  @Listen('keydown', {})
  handleComboInputKeyDown(event: KeyboardEvent) {
    const options = this.el.querySelectorAll('pds-select-option');
    console.log('options: ', options);
    console.log('this.selectedOptionId: ', this.selectedOptionId);

    if (!this.isComboboxOpen) {
      this.handleComboboxToggle();
      return false;
    }

    if (this.isComboboxOpen && options.length > 0) {
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          if (!this.isComboboxOpen) {
            this.handleComboboxToggle();
            this.focusOptionAtIndex(this.focusIndex);
          }
          this.focusNextOption();
          break;
        case 'ArrowUp':
          event.preventDefault();
          this.focusPreviousOption();
          break;
        case 'Esc':
          if(this.isComboboxOpen) {
            !this.isComboboxOpen;
          }
        case 'Home':
          event.preventDefault();
          this.focusFirstOption();
          break;
        case 'End':
          event.preventDefault();
          this.focusLastOption();
          break;
        case 'Enter':
        case ' ':
          event.preventDefault();
          if (this.isComboboxOpen) {
            this.selectFocusedOption();
          }
          break;
      }
    }
  }

  // Focus Management
  private focusNextOption() {
    console.log('hey this: ', this);
    const options = this.el.querySelectorAll('pds-select-option');
    if (options.length > 0 && this.focusIndex < options.length - 1) {
      this.focusIndex++;
      this.focusOptionAtIndex(this.focusIndex);
    }
  }

  private focusPreviousOption() {
    const options = this.el.querySelectorAll('pds-select-option');
    if (options.length > 0 && this.focusIndex > 0) {
      this.focusIndex--;
      this.focusOptionAtIndex(this.focusIndex);
    }
  }

  private focusFirstOption() {
    this.focusIndex = 0;
    this.focusOptionAtIndex(this.focusIndex);
  }

  private focusLastOption() {
    const options = this.el.querySelectorAll('pds-select-option');
    if (options.length > 0) {
      this.focusIndex = options.length - 1;
      this.focusOptionAtIndex(this.focusIndex);
    }
  }

  private focusOptionAtIndex(index: number) {
    console.log('focusOptionAtIndex: ', index );
    const options = this.el.querySelectorAll('pds-select-option');
    options.forEach((option, i) => {
      const shadowOption = option.shadowRoot?.querySelector('.pds-select-option') as HTMLElement;

      shadowOption.tabIndex = i === index ? 0 : -1;
      shadowOption.classList.toggle('is--current', i === index);
    });

    if (options[index].componentId ){
      this.wasComboboxFocusedId = options[index].componentId;
      this.wasComboboxFocusedIndex = index;
      console.log('this.wasComboboxFocusedId: ', this.wasComboboxFocusedId);
    }

    options[index].focus();
  }

  private selectFocusedOption() {
    const options = this.el.querySelectorAll('pds-select-option');
    if (options.length > 0 && this.focusIndex >= 0 && this.focusIndex < options.length) {
      const focusedOption = options[this.focusIndex].shadowRoot?.querySelector('.pds-select-option') as HTMLElement;
      focusedOption.click();
    }
  }
  // End Focus Management

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
          class={`
            pds-select
            ${this.isComboboxOpen ? 'is-open' : ''}
          `}
        >
          <div
            aria-controls={`${this.componentId}-listbox`}
            aria-expanded={this.isComboboxOpen.toString()}
            aria-haspopup="listbox"
            aria-labelledby={`${this.componentId}-label`}
            aria-activedescendant={this.selectedOptionId ? `${this.componentId}-option-${this.selectedOptionId}` : undefined}
            class={this.selectInputClassNames()}
            id={this.componentId}
            role="combobox"
            tabindex="0"
          >
            {this.selectedOptionText || this.selectedOptionValue}
            <pds-icon name="caret-down" size="small"></pds-icon>
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
