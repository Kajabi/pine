import { Component, Element, Event, EventEmitter, h, Host, Prop, State, Watch, Method } from '@stencil/core';
import type { BasePdsProps } from '@utils/interfaces';
import { computePosition, flip, offset, shift } from '@floating-ui/dom';
import DOMPurify from 'dompurify';

/**
 * PdsCombobox - An advanced searchable dropdown component with filtering and accessibility
 *
 * **⚠️ CRITICAL BEHAVIOR:**
 * - **Search & Filter**: Real-time filtering of options as user types
 * - **Multiple Modes**: Filter mode (search) or select-only mode (dropdown)
 * - **Two Triggers**: Input trigger (editable) or button trigger (non-editable)
 * - **Accessibility**: Full ARIA support with proper labeling and keyboard navigation
 * - **Custom Layouts**: Support for rich option content with HTML layouts
 *
 * **⚠️ VISUAL PATTERN CLARIFICATION:**
 *
 * When analyzing screenshots or visual layouts:
 * - **Text above combobox**: This is the combobox's LABEL, not a separate `pds-text` component
 * - **Label Integration**: The `label` prop creates text that appears above the combobox field
 * - **No Separate Text Needed**: Do not add `pds-text` components for combobox labels
 * - **Visual Hierarchy**: Label text is styled and positioned automatically by the combobox component
 *
 * **Common Mistake**: Seeing text above a combobox and assuming it's a separate `pds-text` component
 * **Correct Understanding**: The text is the combobox's integrated label created by the `label` prop
 *
 * **Usage Examples:**
 * ```tsx
 * // Basic combobox with input trigger
 * <pds-combobox label="Search Users" component-id="users" placeholder="Type to search...">
 *   <option value="user1">John Doe</option>
 *   <option value="user2">Jane Smith</option>
 *   <option value="user3">Bob Johnson</option>
 * </pds-combobox>
 *
 * // Combobox with button trigger
 * <pds-combobox
 *   label="Select Category"
 *   component-id="category"
 *   trigger="button"
 *   placeholder="Choose a category"
 * >
 *   <option value="tech">Technology</option>
 *   <option value="design">Design</option>
 *   <option value="marketing">Marketing</option>
 * </pds-combobox>
 *
 * // Select-only mode (no filtering)
 * <pds-combobox
 *   label="Country"
 *   component-id="country"
 *   mode="select-only"
 *   trigger="button"
 * >
 *   <option value="us">United States</option>
 *   <option value="ca">Canada</option>
 * </pds-combobox>
 *
 * // ❌ INCORRECT - Don't add separate text for labels
 * <pds-text>Search Users</pds-text>
 * <pds-combobox component-id="users">
 *   <option value="user1">John Doe</option>
 * </pds-combobox>
 *
 * // ✅ CORRECT - Use the label prop
 * <pds-combobox label="Search Users" component-id="users">
 *   <option value="user1">John Doe</option>
 * </pds-combobox>
 * ```
 *
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
   * Enable custom layout content for options. Options with data-layout attribute will render their HTML content.
   * ⚠️ Security Warning: Only use with trusted content. Basic XSS protection is applied, but avoid user-generated content.
   * @default false
   */
  @Prop() customOptionLayouts: boolean = false;

  /**
   * Enable custom layout content for the button trigger via the trigger-content slot.
   * When true, uses slot content for initial state but updates dynamically with selected option layout.
   * ⚠️ Security Warning: Only use with trusted content. Basic XSS protection is applied, but avoid user-generated content.
   * @default false
   */
  @Prop() customTriggerContent: boolean = false;

  /**
   * If true, the combobox is disabled.
   */
  @Prop() disabled: boolean = false;

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
   * Visually hides the label text for instances where only the combobox should be displayed.
   * Label remains accessible to assistive technology such as screen readers.
   */
  @Prop() hideLabel: boolean = false;

  /**
   * Text to be displayed as the combobox label.
   *
   * **⚠️ CRITICAL VISUAL BEHAVIOR:**
   * - **Integrated Label**: Creates text that appears ABOVE the combobox field
   * - **Not Separate Component**: This is NOT a separate `pds-text` component
   * - **Automatic Styling**: Label is styled and positioned by the combobox component
   * - **Visual Hierarchy**: Creates proper visual relationship between label and combobox
   *
   * **Accessibility Impact:**
   * - Creates proper label-combobox association
   * - Required for screen reader accessibility
   * - Sets `for` attribute to link with combobox
   * - Can be visually hidden with `hideLabel` prop while remaining accessible
   *
   * **⚠️ COMMON MISTAKE**: When analyzing screenshots, text above a combobox is the LABEL, not a separate text component
   *
   * **Best Practice**: Always provide descriptive labels for combobox fields
   *
   * **Example**: `label="Search Users"` for user search combobox
   */
  @Prop() label?: string;

  /**
   * Maximum height of the dropdown. Can be any valid CSS height value (e.g., '200px', '10rem').
   * When content exceeds this height, the dropdown will scroll.
   */
  @Prop() maxHeight?: string;

  /**
   * Determines the combobox mode: 'filter' (filter options as you type) or 'select-only' (show all options).
   * @default 'filter'
   */
  @Prop() mode: 'filter' | 'select-only' = 'filter';

  /**
   * Placeholder text for the input field.
   */
  @Prop() placeholder?: string;

  /**
   * Determines the combobox trigger: 'input' (editable input) or 'button' (button-like, non-editable).
   * @default 'input'
   */
  @Prop() trigger: 'input' | 'button' = 'input';

  /**
   * Width of the trigger (button or input). Any valid CSS width value.
   * @default 'fit-content'
   */
  @Prop() triggerWidth: string = 'fit-content';

  /**
   * The visual variant for the button trigger. Matches Pine button variants.
   * @default 'secondary'
   */
  @Prop() triggerVariant: 'secondary' | 'primary' | 'accent' | 'destructive' = 'secondary';

  /**
   * The value of the combobox input.
   */
  @Prop({ mutable: true }) value: string = '';

  /**
   * Emitted when the value changes.
   */
  @Event() pdsComboboxChange!: EventEmitter<{ value: string }>;

  /**
   * Internal state for filtered options
   */
  @State() filteredOptions: HTMLOptionElement[] = [];

  /**
   * Internal state for the currently highlighted option index
   */
  @State() highlightedIndex: number = -1;

  /**
   * Internal state for dropdown open/close
   */
  @State() isOpen: boolean = false;

  /**
   * Internal state for the currently selected option
   */
  @State() selectedOption: HTMLOptionElement | null = null;

  /**
   * Internal state for the sanitized layout content of the selected option
   */
  @State() selectedOptionLayoutContent: string = '';

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

  @Watch('selectedOption')
  handleSelectedOptionChange() {
    // Update the layout content when selected option changes
    this.selectedOptionLayoutContent = this.selectedOption && this.isOptionLayout(this.selectedOption)
      ? this.getOptionLayoutContent(this.selectedOption)
      : '';
  }

  private updateOptions() {
    // Get all <option> elements from the slot
    const slot = this.el.shadowRoot?.querySelector('slot[name="option"], slot:not([name])');
    if (slot) {
      this.optionEls = (slot as HTMLSlotElement).assignedElements({ flatten: true })
        .filter(el => el.tagName === 'OPTION') as HTMLOptionElement[];

      // Set initial selected option if one exists (only check DOM on initialization)
      if (!this.selectedOption) {
        const initialSelected = this.optionEls.find(opt => opt.hasAttribute('selected')) || null;
        this.setSelectedOption(initialSelected);
      }

      this.filterOptions();
    }
  }

  // Helper method to get option label, falling back to text content if no label attribute
  private getOptionLabel(option: HTMLOptionElement): string {
    return option.label || option.textContent || '';
  }

  // Helper method to get option layout content
  private getOptionLayoutContent(option: HTMLOptionElement): string {
    return this.sanitizeHtml(option.innerHTML || '');
  }

      // HTML sanitization using DOMPurify library to prevent XSS attacks
  private sanitizeHtml(html: string): string {
    // Configure DOMPurify to allow Pine Design System components while removing dangerous content
    const config = {
      // Allow all custom elements (including pds-* components)
      CUSTOM_ELEMENT_HANDLING: {
        tagNameCheck: (tagName: string) => {
          // Allow all pds-* tags and standard safe HTML tags
          return tagName.startsWith('pds-') || /^[a-z]+$/i.test(tagName);
        },
        attributeNameCheck: (attr: string) => {
          // Allow standard HTML attributes, data-* attributes, and Pine component attributes
          return /^[a-zA-Z][a-zA-Z0-9-]*$/.test(attr) || attr.startsWith('data-') || attr.startsWith('aria-');
        },
        allowCustomizedBuiltInElements: false,
      },
      // Allow standard safe attributes
      ALLOW_DATA_ATTR: true,
      ALLOW_ARIA_ATTR: true,
      // Specifically forbid dangerous tags
      FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input', 'textarea', 'select', 'button', 'style'],
      // Forbid all event handler attributes
      FORBID_ATTR: [
        'onerror', 'onload', 'onclick', 'onmouseover', 'onmouseout', 'onmousemove',
        'onfocus', 'onblur', 'onchange', 'onsubmit', 'onkeydown', 'onkeyup', 'onkeypress',
        'onmousedown', 'onmouseup', 'ondblclick', 'oncontextmenu', 'onscroll'
      ],
      // Safe protocol whitelist
      ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp|data):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
    };

    return DOMPurify.sanitize(html, config);
  }



  // Helper method to check if option should render as layout
  private isOptionLayout(option: HTMLOptionElement): boolean {
    return this.customOptionLayouts && option.hasAttribute('data-layout');
  }

  // Helper method to check if option is selected (single source of truth)
  private isOptionSelected(option: HTMLOptionElement): boolean {
    return this.selectedOption === option;
  }

  // Helper method to set selected option (centralized state management)
  private setSelectedOption(option: HTMLOptionElement | null): void {
    this.selectedOption = option;
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
    return this.selectedOptionLayoutContent;
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
    // Update reactive state - single source of truth
    this.setSelectedOption(option);

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
          const isSelected = this.isOptionSelected(option);
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

  // Helper method to render the caret icon
  private renderCaretIcon() {
    return <pds-icon icon="caret-down" aria-hidden="true" aria-label="dropdown indicator" class="pds-combobox__button-trigger-chevron" />;
  }

  // Helper method to render layout content
  private renderLayoutContent() {
    return (
      <div class="pds-combobox__button-trigger-layout-wrapper" innerHTML={this.selectedLayoutContent} />
    );
  }

  // Helper method to render default text content
  private renderDefaultContent() {
    return (
      <span class="pds-combobox__button-trigger-label">
        {this.selectedLabel || this.placeholder}
      </span>
    );
  }

  // Helper method to check if we should show layout content
  private shouldShowLayoutContent(): boolean {
    return this.selectedHasLayout && !!this.selectedLayoutContent;
  }

  private renderButtonTriggerContent() {
    // Case 1: Custom trigger content with layout priority
    if (this.customTriggerContent) {
      if (this.shouldShowLayoutContent()) {
        return [this.renderLayoutContent(), this.renderCaretIcon()];
      }
      // Fall back to slot content when no layout is available
      return <slot name="trigger-content" />;
    }

    // Case 2: Standard mode with layout content
    if (this.shouldShowLayoutContent()) {
      return [this.renderLayoutContent(), this.renderCaretIcon()];
    }

    // Case 3: Standard mode with default text content
    return [this.renderDefaultContent(), this.renderCaretIcon()];
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
