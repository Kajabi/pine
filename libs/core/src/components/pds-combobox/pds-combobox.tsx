import { Component, Element, Event, EventEmitter, h, Host, Prop, State, Watch, Method } from '@stencil/core';
import type { BasePdsProps } from '@utils/interfaces';
import { computePosition, flip, offset, shift } from '@floating-ui/dom';

/**
 * @slot option - Option elements for the combobox dropdown
 * @slot trigger-content - Custom content for the button trigger when customTriggerContent is true
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
   * Enable custom layout content for the button trigger via the trigger-content slot.
   * When true, uses slot content for initial state but updates dynamically with selected option layout.
   * @default false
   */
  @Prop() customTriggerContent: boolean = false;

  /**
   * Enable custom layout content for options. Options with data-layout attribute will render their HTML content.
   * @default false
   */
  @Prop() customOptionLayouts: boolean = false;

  /**
   * Placement of the dropdown relative to the trigger.
   * @default 'bottom-start'
   */
  @Prop() dropdownPlacement: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end' = 'bottom-start';

  /**
   * Width of the dropdown. Any valid CSS width value.
   * @default '236px'
   */
  @Prop() dropdownWidth: string = '236px';

  /**
   * Width of the trigger (button or input). Any valid CSS width value.
   * @default 'fit-content'
   */
  @Prop() triggerWidth: string = 'fit-content';

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

  /**
   * Internal state for the currently selected option
   */
  @State() selectedOption: HTMLOptionElement | null = null;

  /**
   * Internal state to force re-renders when trigger content should update
   */
  @State() triggerUpdateKey: number = 0;

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
    const slot = this.el.shadowRoot?.querySelector('slot[name="option"], slot:not([name])');
    if (slot) {
      this.optionEls = (slot as HTMLSlotElement).assignedElements({ flatten: true })
        .filter(el => el.tagName === 'OPTION') as HTMLOptionElement[];

      // Set initial selected option if one exists
      this.selectedOption = this.optionEls.find(opt => opt.hasAttribute('selected')) || null;

      this.filterOptions();
    }
  }

  // Helper method to get option label, falling back to text content if no label attribute
  private getOptionLabel(option: HTMLOptionElement): string {
    return option.label || option.textContent || '';
  }

  // Helper method to get option layout content
  private getOptionLayoutContent(option: HTMLOptionElement): string {
    return option.innerHTML || '';
  }

  // Helper method to check if option should render as layout
  private isOptionLayout(option: HTMLOptionElement): boolean {
    return this.customOptionLayouts && option.hasAttribute('data-layout');
  }

  private filterOptions() {
    if (this.mode === 'select-only') {
      this.filteredOptions = this.optionEls;
    } else {
      const val = this.value.toLowerCase();
      this.filteredOptions = this.optionEls.filter(option => {
        // For layout options, search both text content and data-search-text attribute
        if (this.isOptionLayout(option)) {
          const searchText = option.getAttribute('data-search-text') || option.textContent || '';
          return searchText.toLowerCase().includes(val);
        }
        return this.getOptionLabel(option).toLowerCase().includes(val);
      });
    }
    this.highlightedIndex = -1;
  }

          private openDropdownPositioning() {
    if (this.triggerEl && this.listboxEl) {
      // Apply width and max-height BEFORE positioning calculations
      this.listboxEl.style.width = this.dropdownWidth;

      if (this.maxHeight) {
        this.listboxEl.style.maxHeight = this.maxHeight;
        this.listboxEl.style.overflowY = 'auto';
      }

      // Force a reflow to ensure dimensions are calculated
      this.listboxEl.offsetHeight;

      computePosition(this.triggerEl, this.listboxEl, {
        placement: this.dropdownPlacement,
        strategy: 'absolute',
        middleware: [offset(12), flip(), shift({ padding: 5 })],
      }).then(({ x, y }) => {
        Object.assign(this.listboxEl.style, {
          left: `${x}px`,
          top: `${y}px`,
          position: 'absolute',
          zIndex: 1000,
        });
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

  /**
   * Gets the value of the currently selected option.
   */
  @Method()
  async getSelectedValue(): Promise<string | null> {
    return this.selectedOption ? this.selectedOption.value : null;
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
    return this.selectedOption ? this.getOptionLabel(this.selectedOption) : '';
  }

  // Get the layout content of the selected option for button trigger
  private get selectedLayoutContent(): string {
    return this.selectedOption && this.isOptionLayout(this.selectedOption) ? this.getOptionLayoutContent(this.selectedOption) : '';
  }

  // Check if selected option has layout
  private get selectedHasLayout(): boolean {
    return this.selectedOption ? this.isOptionLayout(this.selectedOption) : false;
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

      // If there's a selected option but the input value doesn't match, restore the selected option's value
      if (this.selectedOption && this.value !== this.getOptionLabel(this.selectedOption)) {
        this.value = this.getOptionLabel(this.selectedOption);
      }
    }
  };

    private handleOptionClick(option: HTMLOptionElement) {
    // Remove 'selected' from all options
    this.optionEls.forEach(opt => opt.removeAttribute('selected'));
    // Set 'selected' on the chosen option
    option.setAttribute('selected', '');
    // Update reactive state
    this.selectedOption = option;
    this.triggerUpdateKey = this.triggerUpdateKey + 1; // Force re-render

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
          const isLayout = this.isOptionLayout(option);

          return (
            <li
              key={option.value}
              id={`pds-combobox-option-${idx}`}
              role="option"
              aria-selected={isSelected ? 'true' : 'false'}
              class={{
                'pds-combobox__option': true,
                'pds-combobox__option--highlighted': isHighlighted,
                'pds-combobox__option--layout': isLayout,
              }}
              data-option-index={idx}
              onMouseDown={this.onOptionMouseDown}
              onClick={this.onOptionClick}
              onMouseEnter={this.onOptionMouseEnter}
            >
              {isLayout ? (
                <pds-box class="pds-combobox__option-layout-wrapper" innerHTML={this.getOptionLayoutContent(option)} />
              ) : (
                this.getOptionLabel(option)
              )}
              {isSelected && <pds-icon icon="check" size="regular" class="pds-combobox__option-check" />}
            </li>
          );
        })}
      </ul>
    );
  }

        private renderButtonTriggerContent() {
    // For custom trigger content, prioritize selected option layout if available
    if (this.customTriggerContent) {
      if (this.selectedHasLayout && this.selectedLayoutContent) {
        // Use innerHTML to render the selected option's layout content
        return [
          <div class="pds-combobox__button-trigger-layout-wrapper" key={`trigger-${this.triggerUpdateKey}`} innerHTML={this.selectedLayoutContent} />,
          <pds-icon icon="caret-down" class="pds-combobox__button-trigger-chevron" />
        ];
      }
      // Fall back to slot content when no option is selected or option has no layout
      return <slot name="trigger-content" />;
    }

    if (this.selectedHasLayout && this.selectedLayoutContent) {
      return [
        <div class="pds-combobox__button-trigger-layout-wrapper" innerHTML={this.selectedLayoutContent} />,
        <pds-icon icon="caret-down" class="pds-combobox__button-trigger-chevron" />
      ];
    }

    return [
      <span class="pds-combobox__button-trigger-label">
        {this.selectedLabel || this.placeholder}
      </span>,
      <pds-icon icon="caret-down" class="pds-combobox__button-trigger-chevron" />
    ];
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
              style={{ width: this.triggerWidth }}
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
              onKeyDown={this.handleKeyDown}
              autocomplete="off"
              part="input"
            />
          ) : (
            <div
              class={triggerClass}
              style={{ width: this.triggerWidth }}
              role="combobox"
              aria-haspopup="listbox"
              aria-controls="pds-combobox-listbox"
              aria-expanded={this.isOpen ? 'true' : 'false'}
              aria-disabled={this.disabled ? 'true' : 'false'}
              aria-label={this.hideLabel ? this.label : undefined}
              id={this.componentId}
              tabIndex={0}
              onClick={this.onButtonTriggerClick}
              data-layout={this.customTriggerContent}
              onKeyDown={this.onButtonTriggerKeyDown}
              ref={el => (this.triggerEl = el as HTMLElement)}
              part="button-trigger"
            >
              {this.renderButtonTriggerContent()}
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
