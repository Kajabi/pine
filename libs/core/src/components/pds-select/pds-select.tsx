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
  @Prop({mutable: true}) focusIndex = -1;

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
  @Prop({mutable: true}) selectedOptionId?: string;

  /**
   * The display text for the selected option
   */
  @Prop({mutable: true}) selectedOptionText?: string;

  /**
   * The value for the selected option
   */
  @Prop({mutable: true}) selectedOptionValue?: string;

  /**
   * Emitted when the select value changes from selected option
   */
  @Event() pdsSelectChange!: EventEmitter<string>;

  componentWillLoad() {
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
    switch (event.key || event.code) {
      // When the down arrow is pressed, open the combobox and focus the first option. The DOM focus remains on the this.isComboboxOpen
      // TODO: needs to be updated for down arrow. Should read... When the down arrow is pressed, open the combobox if it not already displayed without moving focus or chaning selection
      case 'ArrowDown':
        event.preventDefault();

        if (!this.isComboboxOpen) {
          this.handleComboboxToggle();
        }

        this.focusNextOption();
        break;
      
      // When the up arrow is pressed, open the combobox and focus the first option. The DOM focus remains on the this.isComboboxOpen
      case 'ArrowUp':
        event.preventDefault();

        if (!this.isComboboxOpen) {
          this.handleComboboxToggle();
          return
        }

        this.focusPreviousOption();
        break;
        
      case 'Escape':
        if(this.isComboboxOpen) {
          this.handleComboboxToggle();
        }
        break;

      // When the home key is pressed, open the combobox and moves visual focus to first selection
      case 'Home':
        event.preventDefault();
        if(!this.isComboboxOpen) {
          this.handleComboboxToggle();
        }
        this.focusFirstOption();
        break;

      // When the end key is pressed, open the combobox and moves visual focus to last selection
      case 'End':
        event.preventDefault();
        if(!this.isComboboxOpen) {
          this.handleComboboxToggle()
        }
        this.focusLastOption();
        break;

      // When the Enter key is pressed, open the combobox without moving focus or changing selection
      // When the Enter key is pressed, close the combobox, select the focused option, and move focus to the input
      case 'Enter':
        event.preventDefault();

        if (!this.isComboboxOpen) {
          this.handleComboboxToggle();
        }

        if (this.isComboboxOpen) {
          this.selectFocusedOption();
        }
        break;

      // When the SPACE key is pressed, open the combobox without moving focus or changing selection
      // When the SPACE key is pressed, close the combobox, select the focused option, and move focus to the input
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

    // update props
    this.isComboboxOpen = !this.isComboboxOpen;
    this.comboInputRef.setAttribute('aria-expanded', this.isComboboxOpen.toString());

    // open combobox
    if (this.isComboboxOpen) {
      this.comboWrapperRef.classList.add('is-open');

      // Move focus to the input when the combobox is opened
      this.comboInputRef?.focus();
      console.log('if this.isComboboxOpen');

      // Set the focus index to the first option
      // if (!this.focusIndex)  {
      //   console.log('IN HERE');
      //   this.focusIndex = 0;
      // }
    } else {
      // close combobox
      this.comboWrapperRef.classList.remove('is-open');

      // Reset focus index when the combobox is closed
      // this.focusIndex = -1;
    }
  };

  private selectInputClassNames() {
    const classNames = ['pds-select__input'];

    if (this.invalid && this.invalid === true) {
      classNames.push('is-invalid');
    }

    return classNames.join(' ');
  }

  // Focus Management
  private focusNextOption() {
    const options = this.el.querySelectorAll('pds-select-option');
    if (options.length > 0 && this.focusIndex < options.length - 1) {
      const previousIndex = this.focusIndex;
      this.focusIndex++;
      this.focusOptionAtIndex(previousIndex, this.focusIndex);
    }
  }

  private focusPreviousOption() {
    const options = this.el.querySelectorAll('pds-select-option');
    if (options.length > 0 && this.focusIndex > 0) {
      const previousIndex = this.focusIndex;
      this.focusIndex--;
      this.focusOptionAtIndex(previousIndex, this.focusIndex);
    }
  }

  private focusFirstOption() {
    const previousIndex = this.focusIndex;
    this.focusIndex = 0;
    this.focusOptionAtIndex(previousIndex, this.focusIndex);
  }

  private focusLastOption() {
    const options = this.el.querySelectorAll('pds-select-option');
    if (options.length > 0) {
      const previousIndex = this.focusIndex;
      this.focusIndex = options.length - 1;
      this.focusOptionAtIndex(previousIndex, this.focusIndex);
    }
  }

  // add previous index as well
  private focusOptionAtIndex(previousIndex: number, index: number) {
    console.log('focusOptionAtIndex: ', index);
    if (index === undefined) return false;

    const options = this.el.querySelectorAll('pds-select-option');

    // Update previousIndex
    if (previousIndex !== undefined && previousIndex < options.length) {
      // set to first option if combobox was initial opening
      if (previousIndex === -1){
        previousIndex = 0;
      }

      const prevOption = options[previousIndex].shadowRoot?.querySelector('.pds-select-option') as HTMLElement;
      prevOption.tabIndex = -1;
      prevOption.classList.remove('is--current');
    }

    // Update index
    if (index !== undefined && index < options.length) {
      const currentOption = options[index].shadowRoot?.querySelector('.pds-select-option') as HTMLElement;
      currentOption.tabIndex = 0;
      currentOption.classList.add('is--current');
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
  async selectFocusedOption() {
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