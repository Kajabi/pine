import { Component, Element, Host, h, Method, Prop, Event, EventEmitter, Listen } from '@stencil/core';
import {
  positionTooltip
} from '../../utils/overlay';
import { assignDescription, messageId } from '../../utils/form';

@Component({
  tag: 'pds-select',
  styleUrl: 'pds-select.scss',
  shadow: true,
})
export class PdsSelect {
  @Element() el!: HTMLPdsSelectElement;

  /**
   * Reference to the combobox wrapper
   */
  private comboWrapperRef?: HTMLDivElement;

  /**
   * Reference to the combobox input element
   */
  private comboInputRef?: HTMLDivElement;

  /**
   * Reference to the combobox overlay
   */
  private overlayEl: HTMLElement | null;

  /**
   * Track the index of the focused option
   */
  @Prop() focusIndex = -1;

  /**
   * Determines whether or not the combobox was focused before blur
   * @defaultValue false
   */
  @Prop() wasComboboxFocused = false;

  /**
   * The id of the previously focused combobox option
   */
  @Prop() wasComboboxFocusedId: string;

  /**
   * The index of the previously focused combobox option
   */
  @Prop() wasComboboxFocusedIndex: number;

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
   * Displays a helper or description of the combobox
   */
  @Prop() helperMessage?: string;

  /**
   * Indicates  whether or not the input field is invalid or throws an error
   * @defaultValue false
   */
  @Prop() invalid = false;

  /**
   * Is enabled when the combobox is open
   * @defaultValue false
   */
  @Prop({ mutable: true }) isComboboxOpen = false;

  /**
   * Text to be displayed as the combobox label
   */
  @Prop() label?: string;

  /**
   * Determines the preferred position of the tooltip
   * @defaultValue "right"
   */
  @Prop({ reflect: true }) placement:
    'top'
    | 'top-start'
    | 'top-end'
    | 'right'
    | 'right-start'
    | 'right-end'
    | 'bottom'
    | 'bottom-start'
    | 'bottom-end'
    | 'left'
    | 'left-start'
    | 'left-end' = 'bottom-start';

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
          this.selectedOptionText = firstOption.innerHTML;
        }
      }
    }

    // Use shadowRoot to find the .pds-select__input element
    this.comboInputRef = this.el.shadowRoot?.querySelector('.pds-select__input') as HTMLDivElement;

    if (this.comboInputRef) {
      this.comboInputRef.addEventListener('click', this.handleComboboxToggle);
      // this.comboInputRef.addEventListener('blur', this.handleComboInputBlur);
    }
  }

  componentDidRender() {
    positionTooltip({elem: this.comboInputRef, elemPlacement: this.placement, overlay: this.overlayEl, offset:  4});
  }

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

  @Listen('keydown', {})
  handleComboInputKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();

        if (!this.isComboboxOpen) {
          console.log('!!NOT OPEN');
          this.handleComboboxToggle();
        }

        this.focusNextOption();
        break;
      case 'ArrowUp':
        event.preventDefault();

        if (!this.isComboboxOpen) {
          this.handleComboboxToggle();
          return
        }

        this.focusPreviousOption();
        break;
      case 'Escape':
        console.log('Escape outer');
        if(this.isComboboxOpen) {
          console.log('Escape inner');
          this.handleComboboxToggle();
        }
        break;
      case 'Home':
        event.preventDefault();
        this.focusFirstOption();
        break;
      case 'End':
        event.preventDefault();
        console.log('###setting current');
        this.focusLastOption();
        break;
      case 'Enter':
        event.preventDefault();

        if (this.isComboboxOpen) {
          this.selectFocusedOption();
        }
        break;
      case ' ':
        event.preventDefault();

        // Open combobox if closed
        if (!this.isComboboxOpen) {
          this.handleComboboxToggle();
          return
        }

        // Select focused option if combobox is open
        if (this.isComboboxOpen) {
          this.selectFocusedOption();
        }
        break;
    }
  }

  private handleComboboxToggle = () => {
    this.comboWrapperRef =  this.el.shadowRoot?.querySelector('.pds-select') as HTMLDivElement;

    // console.log('this.comboInputRef: ', this.comboInputRef);

    this.isComboboxOpen = !this.isComboboxOpen;
    this.comboInputRef.setAttribute('aria-expanded', this.isComboboxOpen.toString());

    if (this.isComboboxOpen) {
      this.comboWrapperRef.classList.add('is-open');

      // Move focus to the input when the combobox is opened
      this.comboInputRef?.focus();
      console.log('if this.isComboboxOpen');

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
      this.comboWrapperRef.classList.remove('is-open');

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

  // private handleComboInputBlur() {
  //   // Set the flag to remember the focus state when the combobox loses focus
  //   console.log('this: ', this);
  //   console.log('this.wasComboboxFocused Before', this.wasComboboxFocused);
  //   console.log('document.activeElement', document.activeElement);
  //   console.log('this.comboInputRef', this.comboInputRef);
  //   this.wasComboboxFocused = document.activeElement === this.comboInputRef;
  //   console.log('this.wasComboboxFocused After', this.wasComboboxFocused);
  // }

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

  // private selectFocusedOption() {
  //   const options = this.el.querySelectorAll('pds-select-option');
  //   if (options.length > 0 && this.focusIndex >= 0 && this.focusIndex < options.length) {
  //     const focusedOption = options[this.focusIndex].shadowRoot?.querySelector('.pds-select-option') as HTMLElement;
  //     focusedOption.click();
  //   }
  // }

  /**
   * Pending
   */
  @Method()
  async  selectFocusedOption() {
    const options = this.el.querySelectorAll('pds-select-option');
    if (options.length > 0 && this.focusIndex >= 0 && this.focusIndex < options.length) {
      const focusedOption = options[this.focusIndex].shadowRoot?.querySelector('.pds-select-option') as HTMLElement;
      focusedOption.click();
    }
  }

  // End Focus Management

  render() {
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

          `}
        >
          <div
            aria-controls={`${this.componentId}-listbox`}
            aria-describedby={assignDescription(this.componentId, this.invalid, this.helperMessage)}
            aria-expanded={this.isComboboxOpen.toString()}
            aria-haspopup="listbox"
            aria-labelledby={`${this.componentId}-label`}
            aria-activedescendant={this.selectedOptionId && this.isComboboxOpen ? `${this.componentId}-option-${this.selectedOptionId}` : undefined}
            class={this.selectInputClassNames()}
            id={this.componentId}
            ref={(el) => (this.comboInputRef = el)}
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
            ref={(el) => (this.overlayEl = el)}
            role="listbox"
            tabindex="-1"
          >
            <slot></slot>
          </div>

          {this.helperMessage &&
            <p
              class="pds-select__helper-message"
              id={messageId(this.componentId, 'helper')}
            >
              {this.helperMessage}
            </p>
          }

          {this.errorMessage &&
            <p
              class="pds-select__error-message"
              id={messageId(this.componentId, 'error')}
              aria-live="assertive"
            >
              {this.errorMessage}
            </p>
          }
        </div>
      </Host>
    );
  }
}