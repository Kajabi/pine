import { Component, Element, Event, EventEmitter, h, Host, Prop, State, Watch, Method } from '@stencil/core';
import type { BasePdsProps } from '@utils/interfaces';

/**
 * @slot option - Option elements for the combobox dropdown
 */
@Component({
  tag: 'pds-combobox',
  styleUrl: 'pds-combobox.scss',
  shadow: true,
})
export class PdsCombobox implements BasePdsProps {
  /** Reference to the host element */
  @Element() el!: HTMLPdsComboboxElement;

  /**
   * A unique identifier used for the underlying component `id` attribute.
   */
  @Prop() componentId!: string;

  /**
   * Text to be displayed as the combobox label.
   */
  @Prop() label?: string;

  /**
   * Placeholder text for the input field.
   */
  @Prop() placeholder?: string;

  /**
   * The value of the combobox input.
   */
  @Prop({ mutable: true }) value: string = '';

  /**
   * If true, the combobox is disabled.
   */
  @Prop() disabled: boolean = false;

  /**
   * Determines the combobox mode: 'filter' (filter options as you type) or 'select-only' (show all options).
   * @default 'filter'
   */
  @Prop() mode: 'filter' | 'select-only' = 'filter';

  /**
   * Determines the combobox trigger: 'input' (editable input) or 'button' (button-like, non-editable).
   * @default 'input'
   */
  @Prop() trigger: 'input' | 'button' = 'input';

  /**
   * The visual variant for the button trigger. Matches Pine button variants.
   * @default 'secondary'
   */
  @Prop() triggerVariant: 'secondary' | 'primary' | 'accent' = 'secondary';

  /**
   * Emitted when the value changes.
   */
  @Event() pdsComboboxChange!: EventEmitter<{ value: string }>;

  /**
   * Internal state for dropdown open/close
   */
  @State() isOpen: boolean = false;

  /**
   * Internal state for the currently highlighted option index
   */
  @State() highlightedIndex: number = -1;

  /**
   * Internal state for filtered options
   */
  @State() filteredOptions: HTMLOptionElement[] = [];

  private inputEl?: HTMLInputElement;
  private optionEls: HTMLOptionElement[] = [];

  componentWillLoad() {
    this.updateOptions();
  }

  @Watch('value')
  handleValueChange() {
    this.filterOptions();
  }

  private updateOptions() {
    // Get all <option> elements from the slot
    const slot = this.el.shadowRoot?.querySelector('slot');
    if (slot) {
      this.optionEls = (slot as HTMLSlotElement).assignedElements({ flatten: true })
        .filter(el => el.tagName === 'OPTION') as HTMLOptionElement[];
      this.filterOptions();
    }
  }

  private filterOptions() {
    if (this.mode === 'select-only') {
      this.filteredOptions = this.optionEls;
    } else {
      const val = this.value.toLowerCase();
      this.filteredOptions = this.optionEls.filter(option =>
        option.label.toLowerCase().includes(val)
      );
    }
    this.highlightedIndex = -1;
  }

  private handleInput = (e: Event) => {
    const target = e.target as HTMLInputElement;
    this.value = target.value;
    this.isOpen = true;
    this.filterOptions();
  };

  private handleFocus = () => {
    this.isOpen = true;
    this.filterOptions();
  };

  private handleBlur = () => {
    setTimeout(() => {
      this.isOpen = true;
    }, 100);
  };

  private handleOptionClick(option: HTMLOptionElement) {
    // Remove 'selected' from all options
    this.optionEls.forEach(opt => opt.removeAttribute('selected'));
    // Set 'selected' on the chosen option
    option.setAttribute('selected', '');
    this.value = option.label;
    this.isOpen = false;
    this.pdsComboboxChange.emit({ value: option.value });
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    if (!this.isOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      this.isOpen = true;
      return;
    }
    switch (e.key) {
      case 'ArrowDown':
        this.highlightedIndex = Math.min(this.highlightedIndex + 1, this.filteredOptions.length - 1);
        break;
      case 'ArrowUp':
        this.highlightedIndex = Math.max(this.highlightedIndex - 1, 0);
        break;
      case 'Enter':
        if (this.isOpen && this.highlightedIndex >= 0 && this.highlightedIndex < this.filteredOptions.length) {
          this.handleOptionClick(this.filteredOptions[this.highlightedIndex]);
        }
        break;
      case 'Escape':
        this.isOpen = false;
        break;
    }
  };

  /**
   * Sets focus on the native input element.
   */
  @Method()
  async setFocus() {
    this.inputEl?.focus();
  }

  // Event handler for option click
  private onOptionClick = (event: Event) => {
    const idx = Number((event.currentTarget as HTMLElement).getAttribute('data-option-index'));
    const option = this.filteredOptions[idx];
    this.handleOptionClick(option);
  };

  // Event handler for mouse enter on option
  private onOptionMouseEnter = (event: Event) => {
    const idx = Number((event.currentTarget as HTMLElement).getAttribute('data-option-index'));
    this.highlightedIndex = idx;
  };

  // Prevent blur on mousedown
  private onOptionMouseDown = (event: Event) => {
    event.preventDefault();
  };

  // Get the label of the selected option
  private get selectedLabel(): string {
    const selected = this.optionEls.find(opt => opt.hasAttribute('selected'));
    return selected ? selected.label : '';
  }

  // Handler for button trigger click
  private onButtonTriggerClick = () => {
    this.isOpen = !this.isOpen;
  };

  // Handler for button trigger keyboard events
  private onButtonTriggerKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
      e.preventDefault();
      this.isOpen = true;
      this.highlightedIndex = 0;
    } else if (e.key === 'Escape') {
      this.isOpen = false;
    }
  };

  private renderDropdown() {
    if (!this.isOpen || this.filteredOptions.length === 0) return null;
    return (
      <ul
        class="pds-combobox__listbox"
        role="listbox"
        id="pds-combobox-listbox"
      >
        {this.filteredOptions.map((option, idx) => {
          const isSelected = option.hasAttribute('selected');
          const isHighlighted = this.highlightedIndex === idx;
          return (
            <li
              key={option.value}
              id={`pds-combobox-option-${idx}`}
              role="option"
              aria-selected={isSelected ? 'true' : 'false'}
              class={{
                'pds-combobox__option': true,
                'pds-combobox__option--highlighted': isHighlighted,
              }}
              data-option-index={idx}
              onMouseDown={this.onOptionMouseDown}
              onClick={this.onOptionClick}
              onMouseEnter={this.onOptionMouseEnter}
            >
              {option.label}
              {isSelected && <pds-icon icon="check" size="regular" class="pds-combobox__option-check" />}
            </li>
          );
        })}
      </ul>
    );
  }

  render() {
    const triggerClass = `pds-combobox__button-trigger pds-combobox__button-trigger--${this.triggerVariant}`;
    return (
      <Host>
        <div class="pds-combobox">
          {this.label && (
            <label htmlFor={this.componentId} class="pds-combobox__label">
              {this.label}
            </label>
          )}
          {this.trigger === 'input' ? (
            <input
              ref={el => (this.inputEl = el as HTMLInputElement)}
              class="pds-combobox__input"
              type="text"
              role="combobox"
              aria-autocomplete="list"
              aria-controls="pds-combobox-listbox"
              aria-activedescendant={this.highlightedIndex >= 0 ? `pds-combobox-option-${this.highlightedIndex}` : undefined}
              aria-expanded={this.isOpen ? 'true' : 'false'}
              aria-disabled={this.disabled ? 'true' : 'false'}
              id={this.componentId}
              value={this.value}
              placeholder={this.placeholder}
              disabled={this.disabled}
              onInput={this.handleInput}
              onFocus={this.handleFocus}
              onBlur={this.handleBlur}
              onKeyDown={this.handleKeyDown}
              autocomplete="off"
            />
          ) : (
            <div
              class={triggerClass}
              role="combobox"
              aria-haspopup="listbox"
              aria-controls="pds-combobox-listbox"
              aria-expanded={this.isOpen ? 'true' : 'false'}
              aria-disabled={this.disabled ? 'true' : 'false'}
              id={this.componentId}
              tabIndex={0}
              onClick={this.onButtonTriggerClick}
              onKeyDown={this.onButtonTriggerKeyDown}
            >
              <span class="pds-combobox__button-trigger-label">
                {this.selectedLabel || this.placeholder}
              </span>
              <pds-icon name="chevron-down" class="pds-combobox__button-trigger-chevron" />
            </div>
          )}
          {/* Hide the slot so options are not visible */}
          <div style={{ display: 'none' }}>
            <slot onSlotchange={() => this.updateOptions()}></slot>
          </div>
          {this.renderDropdown()}
        </div>
      </Host>
    );
  }
}
