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

  /**
   * Track the index of the focused option
   */
  @Prop() focusIndex = -1;

  /**
   * Flag to remember if the combobox was focused before blur
   */
  @Prop() wasComboboxFocused = false;

  /**
   * Flag to remember if the combobox was focused before blur
   */
  @Prop() wasComboboxFocusedId: string;

  /**
   * Flag to remember focused combobox index
   */
  private wasComboboxFocusedIndex: number;

  /**
   * A unique identifier for the combobox
   */
  @Prop() componentId!: string;

  /**
   * Indicates that the combobox is disabled
   * @defaultValue false
   */
  @Prop() disabled = false;

  /**
   * Specifies the error text and provides an error-themed treatment to the field
   */
  @Prop() errorMessage?: string;

  /**
   * Displays a hint or description of the combobox
   */
  @Prop() hintMessage?: string;

  /**
   * Indicates  whether or not the input field is invalid or throws an error
   */
  @Prop({ mutable: true }) invalid = false;

  /**
   * Is enabled when the combobox is open
   * @defaultValue false
   */
  @Prop() isComboboxOpen = false;

  /**
   * Text to be displayed as the combobox label
   */
  @Prop() label?: string;

  @Prop() readonly = false;

  @Prop() required = false;

  /**
   * The display id for the selected option
   */
  @Prop() selectedOptionId?: string;

  /**
   * The display text for the selected option
   */
  @Prop() selectedOptionText?: string;

  /**
   * The value for the selected option
   */
  @Prop() selectedOptionValue?: string;

  /**
   * Emitted when the select value changes from selected option
   */
  @Event() pdsSelectChange!: EventEmitter<string>;

  componentDidLoad() {
    const options = Array.from(this.el.querySelectorAll('pds-select-option'));
    const firstSelectedOption = options.find((option) => option.hasAttribute('selected'));

    const select = this.el.shadowRoot.querySelector('.pds-select');

    // console.log('here el: ', this.el);
    // console.log('here select: ', select);

    if (firstSelectedOption) {
      // Check if the 'selected' attribute exists and is not null

      if (firstSelectedOption.getAttribute('selected') !== null) {
        // Set the selected option value to the first selected option's value
        this.selectedOptionValue = firstSelectedOption.getAttribute('value');

        // Use innerHTML if the value is null
        if (this.selectedOptionValue === null) {
          this.selectedOptionText = firstSelectedOption.innerHTML;
        }
      }
    } else {
      // If no option is selected, get the first 'pds-select-option' and set the value accordingly
      const firstOption = this.el.querySelector('pds-select-option') as HTMLPdsSelectOptionElement;

      if (firstOption) {
        if(firstOption.innerHTML) {
          // console.log('PROBLEM AREA');
          this.selectedOptionText = firstOption.innerHTML
        }
      }
    }

    // Use shadowRoot to find the .pds-select__input element
    this.comboInputRef = this.el.shadowRoot?.querySelector('.pds-select__input') as HTMLDivElement;

    if (this.comboInputRef) {
      this.comboInputRef.addEventListener('click', this.handleComboboxToggle);
      this.comboInputRef.addEventListener('blur', this.handleComboInputBlur);
    }

    // console.log('after here select: ', select);
  }

  @Listen('pdsSelectChange')
  pdsSelectChangeListener(event: CustomEvent<any>) {
    console.log('pdsSelectChange event.detail: ', event.detail);
  }

  @Listen('pdsSelectOptionSelected')
  pdsSelectedOption(event: CustomEvent<any>) {
    const { id, text, value } = event.detail;

    console.log('id: ', id, ' text: ', text, ' value: ', value);

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
      // console.log('after pdsSelectChange emit this', this);
    }

    this.handleComboboxToggle();
  }

  @Listen('keydown', {})
  handleComboInputKeyDown(event: KeyboardEvent) {
    const options = this.el.querySelectorAll('pds-select-option');

    if (!this.isComboboxOpen) {
      this.handleComboboxToggle();
      // return false;
      event.preventDefault();
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
        case 'Escape':
          if(this.isComboboxOpen) {
            this.handleComboboxToggle();
          }
          break;
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
        console.log('IN HERE');
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

  private selectInputClassNames() {
    const classNames = ['pds-select__input'];

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
    this.wasComboboxFocused = document.activeElement === this.comboInputRef;
  }

  // Focus Management
  private focusNextOption() {
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
    if (index === undefined) return false;

    const options = this.el.querySelectorAll('pds-select-option');
    options.forEach((option, i) => {
      const shadowOption = option.shadowRoot?.querySelector('.pds-select-option') as HTMLElement;

      shadowOption.tabIndex = i === index ? 0 : -1;
      shadowOption.classList.toggle('is--current', i === index);

    });

    if (this.wasComboboxFocused && index !== undefined) {
      if (options[index].componentId && options[index].componentId != undefined){
        this.wasComboboxFocusedId = options[index].componentId;
        this.selectedOptionId = options[index].componentId;
        this.wasComboboxFocusedIndex = index;
      }
    }

    if (index !== undefined) {
      options[index].focus();
    }
  }

  private selectFocusedOption() {
    const options = this.el.querySelectorAll('pds-select-option');
    if (options.length > 0 && this.focusIndex >= 0 && this.focusIndex < options.length) {
      const focusedOption = options[this.focusIndex].shadowRoot?.querySelector('.pds-select-option') as HTMLElement;
      focusedOption.click();
    }
  }
  // End Focus Management

  render() {

    // console.log('return this.selectedOptionId: ', this.selectedOptionId);
    // console.log('comboboxisopen: ', this.isComboboxOpen);
    // console.log('this.focusIndex: ', this.focusIndex);
    return (
      <Host>
        {this.label && (
          <label
            htmlFor={this.componentId}
            id={`${this.componentId}-label`}
            class="pds-select__label"
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
            aria-activedescendant={this.selectedOptionId && this.isComboboxOpen ? `${this.componentId}-option-${this.selectedOptionId}` : undefined}
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
            class="pds-select__menu"
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
