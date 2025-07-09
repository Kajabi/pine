import { Component, Element, Event, EventEmitter, h, Host, Prop, State, Watch, Method } from '@stencil/core';
import type { BasePdsProps } from '@utils/interfaces';
import { computePosition, flip, offset, shift } from '@floating-ui/dom';

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
   * Visually hides the label text for instances where only the combobox should be displayed.
   * Label remains accessible to assistive technology such as screen readers.
   */
  @Prop() hideLabel: boolean = false;

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
  @Prop() triggerVariant: 'secondary' | 'primary' | 'accent' | 'destructive' = 'secondary';

  /**
   * Placement of the dropdown relative to the trigger.
   * @default 'bottom-start'
   */
  @Prop() dropdownPlacement: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end' = 'bottom-start';

  /**
   * Width of the dropdown. Can be 'trigger' (match trigger width), 'auto', or a custom CSS value.
   * @default 'trigger'
   */
  @Prop() dropdownWidth: 'trigger' | 'auto' | string = 'trigger';

  /**
   * Maximum height of the dropdown. Can be any valid CSS height value (e.g., '200px', '10rem').
   * When content exceeds this height, the dropdown will scroll.
   */
  @Prop() maxHeight?: string;

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
  private triggerEl?: HTMLElement;
  private listboxEl?: HTMLElement;

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

  // Helper method to get option label, falling back to text content if no label attribute
  private getOptionLabel(option: HTMLOptionElement): string {
    return option.label || option.textContent || '';
  }

  private filterOptions() {
    if (this.mode === 'select-only') {
      this.filteredOptions = this.optionEls;
    } else {
      const val = this.value.toLowerCase();
      this.filteredOptions = this.optionEls.filter(option =>
        this.getOptionLabel(option).toLowerCase().includes(val)
      );
    }
    this.highlightedIndex = -1;
  }

  private openDropdownPositioning() {
    if (this.triggerEl && this.listboxEl) {
      computePosition(this.triggerEl, this.listboxEl, {
        placement: this.dropdownPlacement,
        middleware: [offset(12), flip(), shift({ padding: 5 })],
      }).then(({ x, y }) => {
        Object.assign(this.listboxEl.style, {
          left: `${x}px`,
          top: `${y}px`,
          position: 'absolute',
          zIndex: 1000,
        });
        // Set width
        if (this.dropdownWidth === 'trigger') {
          this.listboxEl.style.width = `${this.triggerEl.offsetWidth}px`;
        } else if (this.dropdownWidth === 'auto') {
          this.listboxEl.style.width = 'auto';
        } else if (typeof this.dropdownWidth === 'string') {
          this.listboxEl.style.width = this.dropdownWidth;
        }

        // Set max height
        if (this.maxHeight) {
          this.listboxEl.style.maxHeight = this.maxHeight;
        }
      });
    }
  }

  private handleInput = (e: Event) => {
    const target = e.target as HTMLInputElement;
    this.value = target.value;
    this.isOpen = true;
    this.filterOptions();
    setTimeout(() => this.openDropdownPositioning(), 0);
  };

  private handleFocus = () => {
    this.isOpen = true;
    this.filterOptions();
    setTimeout(() => this.openDropdownPositioning(), 0);
  };

  private handleBlur = () => {
    // No longer needed, handled by focusout on wrapper
  };

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
    return selected ? this.getOptionLabel(selected) : '';
  }

  // Handler for button trigger click
  private onButtonTriggerClick = () => {
    this.isOpen = !this.isOpen;
    if (this.isOpen) setTimeout(() => this.openDropdownPositioning(), 0);
  };

  // Handler for button trigger keyboard events
  private onButtonTriggerKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
      e.preventDefault();
      this.isOpen = true;
      this.highlightedIndex = 0;
      setTimeout(() => this.openDropdownPositioning(), 0);
    } else if (e.key === 'Escape') {
      this.isOpen = false;
    }
  };

  // Close dropdown when focus leaves the combobox
  private onComboboxFocusOut = (event: FocusEvent) => {
    const relatedTarget = event.relatedTarget as Node | null;
    if (!this.el.contains(relatedTarget)) {
      this.isOpen = false;
    }
  };

  private handleOptionClick(option: HTMLOptionElement) {
    // Remove 'selected' from all options
    this.optionEls.forEach(opt => opt.removeAttribute('selected'));
    // Set 'selected' on the chosen option
    option.setAttribute('selected', '');
    this.value = this.getOptionLabel(option);
    this.isOpen = false;
    this.pdsComboboxChange.emit({ value: option.value });
  }

  private renderDropdown() {
    if (!this.isOpen || this.filteredOptions.length === 0) return null;
    return (
      <ul
        class="pds-combobox__listbox"
        role="listbox"
        id="pds-combobox-listbox"
        ref={el => (this.listboxEl = el as HTMLElement)}
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
              {this.getOptionLabel(option)}
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
        <div class="pds-combobox" tabIndex={-1} onFocusout={this.onComboboxFocusOut}>
          {this.label && (
            <label htmlFor={this.componentId} class="pds-combobox__label">
              <span class={this.hideLabel ? 'visually-hidden' : ''}>{this.label}</span>
            </label>
          )}
          {this.trigger === 'input' ? (
            <input
              ref={el => {
                this.inputEl = el as HTMLInputElement;
                this.triggerEl = el as HTMLElement;
              }}
              class="pds-combobox__input"
              type="text"
              role="combobox"
              aria-autocomplete="list"
              aria-controls="pds-combobox-listbox"
              aria-activedescendant={this.highlightedIndex >= 0 ? `pds-combobox-option-${this.highlightedIndex}` : undefined}
              aria-expanded={this.isOpen ? 'true' : 'false'}
              aria-disabled={this.disabled ? 'true' : 'false'}
              aria-label={this.hideLabel ? this.label : undefined}
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
              aria-label={this.hideLabel ? this.label : undefined}
              id={this.componentId}
              tabIndex={0}
              onClick={this.onButtonTriggerClick}
              onKeyDown={this.onButtonTriggerKeyDown}
              ref={el => (this.triggerEl = el as HTMLElement)}
            >
              <span class="pds-combobox__button-trigger-label">
                {this.selectedLabel || this.placeholder}
              </span>
              <pds-icon icon="caret-down" class="pds-combobox__button-trigger-chevron" />
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
