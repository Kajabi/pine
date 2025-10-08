import { Component, Element, Event, EventEmitter, h, Host, Prop, State, Watch, Method } from '@stencil/core';
import type { BasePdsProps } from '@utils/interfaces';
import type { ChipSentimentType } from '@utils/types';
import { computePosition, flip, offset, shift } from '@floating-ui/dom';
import DOMPurify from 'dompurify';

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
   * Determines the combobox trigger: 'input' (editable input), 'button' (button-like, non-editable), or 'chip' (chip-like, non-editable).
   * @default 'input'
   */
  @Prop() trigger: 'input' | 'button' | 'chip' = 'input';

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
   * The sentiment for the chip trigger. Matches Pine chip sentiments.
   * @default 'neutral'
   */
  @Prop() chipSentiment: ChipSentimentType = 'neutral';


  /**
   * Whether the chip trigger should be displayed in a larger size.
   * @default false
   */
  @Prop() chipLarge: boolean = false;

  /**
   * The name of the icon to display in the chip trigger.
   */
  @Prop() chipIcon?: string;

  /**
   * Whether a dot should be displayed on the chip trigger.
   * @default false
   */
  @Prop() chipDot: boolean = false;

  /**
   * The value of the combobox input.
   */
  @Prop({ mutable: true }) value: string = '';

  /**
   * Emitted when the value changes.
   */
  @Event() pdsComboboxChange!: EventEmitter<{ value: string }>;

  /**
   * Internal state for filtered options and group labels
   */
  @State() filteredItems: (HTMLOptionElement | HTMLOptGroupElement | HTMLPdsTextElement)[] = [];

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

  /**
   * Internal state to track chip properties for automatic rendering
   */
  @State() selectedOptionChipProps: any = null;

  private inputEl?: HTMLInputElement;
  private optionEls: HTMLOptionElement[] = [];
  private allItems: (HTMLOptionElement | HTMLOptGroupElement | HTMLPdsTextElement)[] = [];
  private triggerEl?: HTMLElement;
  private listboxEl?: HTMLElement;

  componentWillLoad() {
    this.updateOptions();
  }

  componentDidLoad() {
    // Double-check selection after DOM is fully loaded
    if (!this.selectedOption && this.trigger === 'chip') {
      const initialSelected = this.optionEls.find(opt => opt.hasAttribute('selected'));
      if (initialSelected) {
        this.setSelectedOption(initialSelected);
      }
    }
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

    // Update chip properties for automatic rendering when selected option changes
    this.selectedOptionChipProps = this.selectedOption && this.isOptionChip(this.selectedOption)
      ? this.getOptionChipProps(this.selectedOption)
      : null;
  }

  private updateOptions() {
    // Get all elements from the slot
    const slot = this.el.shadowRoot?.querySelector('slot[name="option"], slot:not([name])');
    if (slot) {
      const allElements = (slot as HTMLSlotElement).assignedElements({ flatten: true });

      // Separate options from group labels and flatten optgroups
      this.allItems = [];
      this.optionEls = [];

      allElements.forEach(el => {
        if (el.tagName === 'OPTION') {
          this.optionEls.push(el as HTMLOptionElement);
          this.allItems.push(el as HTMLOptionElement);
        } else if (el.tagName === 'OPTGROUP') {
          const optgroup = el as HTMLOptGroupElement;
          this.allItems.push(optgroup);
          // Add optgroup children (options)
          Array.from(optgroup.children).forEach(child => {
            if (child.tagName === 'OPTION') {
              this.optionEls.push(child as HTMLOptionElement);
              this.allItems.push(child as HTMLOptionElement);
            }
          });
        } else if (el.tagName === 'PDS-TEXT') {
          this.allItems.push(el as HTMLPdsTextElement);
        }
      });

      // Set initial selected option if one exists
      // Always check for selected options when updateOptions is called (including slot changes)
      let initialSelected = this.optionEls.find(opt => opt.hasAttribute('selected')) || null;

      // For chip triggers, ensure we always have a selected option
      if (!initialSelected && this.trigger === 'chip' && this.optionEls.length > 0) {
        initialSelected = this.optionEls[0]; // Select first option as default
        console.warn('PDS Combobox: Chip triggers should always have a selected option. Automatically selected the first option.');
      }

      // Update selection if we found a different selected option or if we don't have one
      if (initialSelected && initialSelected !== this.selectedOption) {
        this.setSelectedOption(initialSelected);
      } else if (!this.selectedOption && initialSelected) {
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

  // Helper method to check if option has chip attributes (new automatic approach)
  private isOptionChip(option: HTMLOptionElement): boolean {
    return option.hasAttribute('chip-sentiment') ||
           option.hasAttribute('chip-large') ||
           option.hasAttribute('chip-icon') ||
           option.hasAttribute('chip-dot');
  }

  // Helper method to get chip properties from option attributes
  private getOptionChipProps(option: HTMLOptionElement) {
    return {
      sentiment: option.getAttribute('chip-sentiment') || 'neutral',
      large: option.hasAttribute('chip-large'),
      icon: option.getAttribute('chip-icon') || undefined,
      dot: option.hasAttribute('chip-dot')
    };
  }

  // Helper method to check if option is selected (single source of truth)
  private isOptionSelected(option: HTMLOptionElement): boolean {
    return this.selectedOption === option;
  }

  // Helper method to set selected option (centralized state management)
  private setSelectedOption(option: HTMLOptionElement | null): void {
    this.selectedOption = option;

    // Immediately update chip properties for automatic rendering to ensure reactivity
    if (option && this.isOptionChip(option)) {
      this.selectedOptionChipProps = this.getOptionChipProps(option);
    } else {
      this.selectedOptionChipProps = null;
    }
  }

  private filterOptions() {
    // Ensure allItems includes optionEls if not already populated (for edge cases)
    if (this.allItems.length === 0 && this.optionEls.length > 0) {
      this.allItems = [...this.optionEls];
    }

    if (this.mode === 'select-only') {
      this.filteredItems = [...this.allItems];
    } else {
      const val = this.value.toLowerCase();
      const filteredOptions = this.optionEls.filter(option => {
        // For layout options, search both text content and data-search-text attribute
        if (this.isOptionLayout(option)) {
          const searchText = option.getAttribute('data-search-text') || option.textContent || '';
          return searchText.toLowerCase().includes(val);
        }
        return this.getOptionLabel(option).toLowerCase().includes(val);
      });

      // Rebuild filtered items maintaining group structure - simplified approach
      this.filteredItems = [];
      let currentGroupLabel: HTMLOptGroupElement | HTMLPdsTextElement | null = null;

      this.allItems.forEach(item => {
        if (item.tagName === 'OPTGROUP' || item.tagName === 'PDS-TEXT') {
          currentGroupLabel = item as HTMLOptGroupElement | HTMLPdsTextElement;
        } else if (item.tagName === 'OPTION' && filteredOptions.includes(item as HTMLOptionElement)) {
          const optionEl = item as HTMLOptionElement;
          const parent = optionEl.parentElement;
          let labelToUse: HTMLOptGroupElement | HTMLPdsTextElement | null = null;
          if (parent && parent.tagName === 'OPTGROUP') {
            // Only use the actual parent optgroup as label
            labelToUse = parent as HTMLOptGroupElement;
          } else if (currentGroupLabel && currentGroupLabel.tagName === 'PDS-TEXT') {
            // Allow pds-text to label subsequent top-level options until another label appears
            labelToUse = currentGroupLabel as HTMLPdsTextElement;
          }
          if (labelToUse && !this.filteredItems.includes(labelToUse)) {
            this.filteredItems.push(labelToUse);
          }
          this.filteredItems.push(optionEl);
        }
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

  private handleInputClick = () => {
    // Open dropdown when input is clicked (but not when tabbed into)
    if (!this.isOpen) {
      this.isOpen = true;
      this.filterOptions();
      setTimeout(() => this.openDropdownPositioning(), 0);
    }
  };

  private handleKeyDown = (e: KeyboardEvent) => {
    if (!this.isOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp' || (e.altKey && e.key === 'ArrowDown'))) {
      e.preventDefault();
      this.isOpen = true;
      this.filterOptions();
      // Set highlighted index immediately for testing
      const selectableOptions = this.filteredItems.filter(item => item.tagName === 'OPTION');
      if (selectableOptions.length > 0) {
        this.highlightedIndex = 0;
      }
      setTimeout(() => {
        this.openDropdownPositioning();
        // For input trigger, keep focus on input and use aria-activedescendant
        // For button trigger, move focus to first option for keyboard navigation
        if (this.trigger === 'input') {
          this.focusFirstOption();
        } else {
          this.focusFirstOptionForArrowKeys();
        }
      }, 0);
      return;
    }

    if (!this.isOpen) {
      return;
    }

    // Get only the option elements (skip group labels) for navigation
    const selectableOptions = this.filteredItems.filter(item => item.tagName === 'OPTION') as HTMLOptionElement[];

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        // If no option is highlighted and we have options, start at 0
        if (this.highlightedIndex < 0 && selectableOptions.length > 0) {
          this.highlightedIndex = 0;
        } else {
          this.highlightedIndex = Math.min(this.highlightedIndex + 1, selectableOptions.length - 1);
        }
        this.updateOptionFocus();
        break;
      case 'ArrowUp':
        e.preventDefault();
        // If no option is highlighted and we have options, start at last option
        if (this.highlightedIndex < 0 && selectableOptions.length > 0) {
          this.highlightedIndex = selectableOptions.length - 1;
        } else {
          this.highlightedIndex = Math.max(this.highlightedIndex - 1, 0);
        }
        this.updateOptionFocus();
        break;
      case 'Home':
        e.preventDefault();
        if (selectableOptions.length > 0) {
          this.highlightedIndex = 0;
          this.updateOptionFocus();
        }
        break;
      case 'End':
        e.preventDefault();
        if (selectableOptions.length > 0) {
          this.highlightedIndex = selectableOptions.length - 1;
          this.updateOptionFocus();
        }
        break;
      case 'PageDown':
        e.preventDefault();
        if (selectableOptions.length > 0) {
          const nextIndex = Math.min(this.highlightedIndex + 10, selectableOptions.length - 1);
          this.highlightedIndex = nextIndex;
          this.updateOptionFocus();
        }
        break;
      case 'PageUp':
        e.preventDefault();
        if (selectableOptions.length > 0) {
          const prevIndex = Math.max(this.highlightedIndex - 10, 0);
          this.highlightedIndex = prevIndex;
          this.updateOptionFocus();
        }
        break;
      case 'Enter':
        e.preventDefault();
        if (this.highlightedIndex >= 0 && this.highlightedIndex < selectableOptions.length) {
          this.handleOptionClick(selectableOptions[this.highlightedIndex]);
          this.restoreFocusToTrigger();
        }
        break;
      case 'Escape':
        e.preventDefault();
        this.isOpen = false;
        this.highlightedIndex = -1;
        this.isArrowKeyNavigationMode = false; // Reset arrow-key navigation mode
        this.restoreFocusToTrigger();
        break;
      case 'Tab':
        // Allow normal tab behavior to close dropdown and move focus
        this.isOpen = false;
        this.highlightedIndex = -1;
        this.isArrowKeyNavigationMode = false; // Reset arrow-key navigation mode
        break;
    }
  };

  /**
   * Sets focus on the native input element.
   */
  @Method()
  async setFocus() {
    if (this.inputEl) {
      this.inputEl.focus();
    } else {
      this.triggerEl?.focus();
    }
  }

  /**
   * Focus management helper - moves focus to the first option when dropdown opens
   */
  private focusFirstOption() {
    if (this.isOpen) {
      const selectableOptions = this.filteredItems.filter(item => item.tagName === 'OPTION');
      if (selectableOptions.length > 0) {
        this.highlightedIndex = 0;
        // DON'T focus the option elements - keep focus on trigger and use aria-activedescendant
        // This prevents the focusout event that was closing the dropdown
        // But still call updateOptionFocus for scrolling
        if (this.listboxEl) {
          this.updateOptionFocus();
        }
      }
    }
  }

  /**
   * Focus management helper - actually focuses the first option when opened via arrow keys
   */
  private focusFirstOptionForArrowKeys() {
    if (this.isOpen) {
      // Set arrow-key navigation mode
      this.isArrowKeyNavigationMode = true;

      const selectableOptions = this.filteredItems.filter(item => item.tagName === 'OPTION');
      if (selectableOptions.length > 0) {
        this.highlightedIndex = 0;
        // For arrow key navigation, actually focus the first option
        if (this.listboxEl) {
          const optionElements = this.listboxEl.querySelectorAll('[role="option"]');
          const firstOption = optionElements[0] as HTMLElement;
          if (firstOption) {
            // Remove tabindex from all options first
            optionElements.forEach(option => {
              (option as HTMLElement).setAttribute('tabindex', '-1');
            });
            // Set tabindex and focus on first option
            firstOption.setAttribute('tabindex', '0');
            firstOption.focus();
            firstOption.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
          }
        }
        // Update aria-activedescendant on trigger
        this.updateAriaActiveDescendant();
      }
    }
  }

  // Track if we're in arrow-key navigation mode (focus should move between options)
  private isArrowKeyNavigationMode: boolean = false;

  /**
   * Focus management helper - updates visual state and scrolling for the currently highlighted option
   * Note: We don't actually focus the option to prevent focusout events that close the dropdown
   */
  private updateOptionFocus() {
    if (!this.listboxEl || this.highlightedIndex < 0) return;

    const optionElements = this.listboxEl.querySelectorAll('[role="option"]');
    const currentOption = optionElements[this.highlightedIndex] as HTMLElement;

    if (currentOption) {
      // Check if any option currently has focus OR if we're in arrow-key navigation mode
      const hasOptionFocus = Array.from(optionElements).some(el => el === document.activeElement);

      if (hasOptionFocus || this.isArrowKeyNavigationMode) {
        // We're in arrow-key navigation mode, so actually move focus between options
        optionElements.forEach(option => {
          (option as HTMLElement).setAttribute('tabindex', '-1');
        });
        currentOption.setAttribute('tabindex', '0');
        currentOption.focus();
      }

      // Always scroll the option into view
      currentOption.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }

    // Always update aria-activedescendant on the trigger element
    this.updateAriaActiveDescendant();
  }

  /**
   * Updates aria-activedescendant on the trigger element
   */
  private updateAriaActiveDescendant() {
    if (this.triggerEl && this.highlightedIndex >= 0) {
      this.triggerEl.setAttribute('aria-activedescendant', `pds-combobox-option-${this.highlightedIndex}`);
    } else if (this.triggerEl) {
      this.triggerEl.removeAttribute('aria-activedescendant');
    }
  }

  /**
   * Focus management helper - restores focus to the trigger element
   */
  private restoreFocusToTrigger() {
    setTimeout(() => {
      if (this.inputEl) {
        this.inputEl.focus();
      } else if (this.triggerEl) {
        this.triggerEl.focus();
      }
    }, 0);
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
    const selectableOptions = this.filteredItems.filter(item => item.tagName === 'OPTION') as HTMLOptionElement[];
    const option = selectableOptions[idx];
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

  // Event handler for option keyboard events
  private onOptionKeyDown = (event: KeyboardEvent) => {
    // Delegate to main keyboard handler
    this.handleKeyDown(event);
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

  // Extract chip sentiment from selected option's attributes, layout content, or slotted trigger content
  private get selectedChipSentiment(): ChipSentimentType {
    // First priority: Check selected option's chip attributes (new automatic approach)
    if (this.selectedOption && this.isOptionChip(this.selectedOption)) {
      const sentiment = this.selectedOption.getAttribute('chip-sentiment') as ChipSentimentType;
      if (sentiment) return sentiment;
    }

    // Second priority: Check selected option's layout content (existing custom layout approach)
    if (this.selectedOption && this.isOptionLayout(this.selectedOption)) {
      const chipElement = this.selectedOption.querySelector('pds-chip');
      const sentiment = chipElement?.getAttribute('sentiment') as ChipSentimentType;
      if (sentiment) return sentiment;
    }

    // Third priority: Check if we have custom trigger content with a chip (initial state)
    if (this.customTriggerContent) {
      const slottedChip = this.el.querySelector('pds-chip[slot="trigger-content"]');
      if (slottedChip) {
        const sentiment = slottedChip.getAttribute('sentiment') as ChipSentimentType;
        if (sentiment) return sentiment;
      }
    }

    // Fallback: Use component props
    return this.chipSentiment;
  }


  // Extract chip large from selected option's attributes, layout content, or slotted trigger content
  private get selectedChipLarge(): boolean {
    // First priority: Check selected option's chip attributes (new automatic approach)
    if (this.selectedOption && this.isOptionChip(this.selectedOption)) {
      if (this.selectedOption.hasAttribute('chip-large')) return true;
    }

    // Second priority: Check selected option's layout content (existing custom layout approach)
    if (this.selectedOption && this.isOptionLayout(this.selectedOption)) {
      const chipElement = this.selectedOption.querySelector('pds-chip');
      if (chipElement?.hasAttribute('large')) return true;
    }

    // Third priority: Check if we have custom trigger content with a chip (initial state)
    if (this.customTriggerContent) {
      const slottedChip = this.el.querySelector('pds-chip[slot="trigger-content"]');
      if (slottedChip && slottedChip.hasAttribute('large')) {
        return true;
      }
    }

    // Fallback: Use component props
    return this.chipLarge;
  }

  // Extract chip icon from selected option's attributes, layout content, or slotted trigger content
  private get selectedChipIcon(): string | undefined {
    // First priority: Check selected option's chip attributes (new automatic approach)
    if (this.selectedOption && this.isOptionChip(this.selectedOption)) {
      const icon = this.selectedOption.getAttribute('chip-icon');
      if (icon) return icon;
    }

    // Second priority: Check selected option's layout content (existing custom layout approach)
    if (this.selectedOption && this.isOptionLayout(this.selectedOption)) {
      const chipElement = this.selectedOption.querySelector('pds-chip');
      const icon = chipElement?.getAttribute('icon');
      if (icon) return icon;
    }

    // Third priority: Check if we have custom trigger content with a chip (initial state)
    if (this.customTriggerContent) {
      const slottedChip = this.el.querySelector('pds-chip[slot="trigger-content"]');
      if (slottedChip) {
        const icon = slottedChip.getAttribute('icon');
        if (icon) return icon;
      }
    }

    // Fallback: Use component props
    return this.chipIcon;
  }

  // Extract chip dot from selected option's attributes, layout content, or slotted trigger content
  private get selectedChipDot(): boolean {
    // First priority: Check selected option's chip attributes (new automatic approach)
    if (this.selectedOption && this.isOptionChip(this.selectedOption)) {
      if (this.selectedOption.hasAttribute('chip-dot')) return true;
    }

    // Second priority: Check selected option's layout content (existing custom layout approach)
    if (this.selectedOption && this.isOptionLayout(this.selectedOption)) {
      const chipElement = this.selectedOption.querySelector('pds-chip');
      if (chipElement?.hasAttribute('dot')) return true;
    }

    // Third priority: Check if we have custom trigger content with a chip (initial state)
    if (this.customTriggerContent) {
      const slottedChip = this.el.querySelector('pds-chip[slot="trigger-content"]');
      if (slottedChip && slottedChip.hasAttribute('dot')) {
        return true;
      }
    }

    // Fallback: Use component props
    return this.chipDot;
  }

  // Handler for button trigger click
  private onButtonTriggerClick = () => {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.filterOptions();
      // Set highlighted index and prepare for keyboard navigation
      const selectableOptions = this.filteredItems.filter(item => item.tagName === 'OPTION');
      if (selectableOptions.length > 0) {
        this.highlightedIndex = 0;
        // For button trigger, prepare for arrow-key navigation mode
        this.isArrowKeyNavigationMode = true;
      }
      setTimeout(() => this.openDropdownPositioning(), 0);
    } else {
      // Reset navigation mode when closing
      this.isArrowKeyNavigationMode = false;
    }
  };

  // Handler for button trigger keyboard events
  private onButtonTriggerKeyDown = (e: KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown' || e.key === 'ArrowUp') && !this.isOpen) {
      e.preventDefault();
      e.stopPropagation(); // Prevent the event from bubbling and triggering click

      this.isOpen = true;
      this.filterOptions();
      // Set highlighted index immediately
      const selectableOptions = this.filteredItems.filter(item => item.tagName === 'OPTION');
      if (selectableOptions.length > 0) {
        this.highlightedIndex = 0;
      }
      setTimeout(() => {
        this.openDropdownPositioning();
        // For all button trigger keyboard opening, focus the first option so subsequent navigation works
        this.focusFirstOptionForArrowKeys();
      }, 0);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      if (this.isOpen) {
        this.isOpen = false;
        this.highlightedIndex = -1;
        this.updateAriaActiveDescendant(); // Clear aria-activedescendant
        this.restoreFocusToTrigger();
      }
    } else if (this.isOpen) {
      // Delegate other keys to main keyboard handler when dropdown is open
      this.handleKeyDown(e);
    }
  };

  // Handler for button trigger keyup events - prevents space key from triggering synthetic click
  private onButtonTriggerKeyUp = (e: KeyboardEvent) => {
    if (e.key === ' ') {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  // Close dropdown when focus leaves the combobox
  private onComboboxFocusOut = (event: FocusEvent) => {
    const relatedTarget = event.relatedTarget as Node | null;

    // Check if the related target is within our shadow DOM (listbox options)
    const isRelatedTargetInListbox = relatedTarget && this.listboxEl?.contains(relatedTarget);
    const isRelatedTargetInCombobox = this.el.contains(relatedTarget);

    // Don't close if focus is moving to an option in the listbox or staying within the combobox
    if (!isRelatedTargetInCombobox && !isRelatedTargetInListbox) {
      this.isOpen = false;
      this.highlightedIndex = -1;
      this.isArrowKeyNavigationMode = false; // Reset arrow-key navigation mode
      this.updateAriaActiveDescendant(); // Clear aria-activedescendant

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
    if (!this.isOpen || this.filteredItems.length === 0) {
      return null;
    }

    let optionIndex = 0;
    const selectableOptions = this.filteredItems.filter(item => item.tagName === 'OPTION') as HTMLOptionElement[];

    return (
      <ul
        class="pds-combobox__listbox"
        role="listbox"
        id="pds-combobox-listbox"
        aria-label={this.label || 'Options'}
        aria-multiselectable="false"
        ref={el => (this.listboxEl = el as HTMLElement)}
      >
        {this.filteredItems.map((item, itemIdx) => {
          if (item.tagName === 'OPTGROUP') {
            const optgroup = item as HTMLOptGroupElement;
            return (
              <li
                key={`optgroup-${itemIdx}`}
                class="pds-combobox__group-label"
                role="presentation"
                aria-label={optgroup.label}
              >
                {optgroup.label}
              </li>
            );
          } else if (item.tagName === 'PDS-TEXT') {
            const pdsText = item as HTMLPdsTextElement;
            return (
              <li
                key={`pds-text-${itemIdx}`}
                class="pds-combobox__group-label"
                role="presentation"
              >
                {pdsText.textContent}
              </li>
            );
          } else if (item.tagName === 'OPTION') {
            const option = item as HTMLOptionElement;
            const isSelected = this.isOptionSelected(option);
            const isHighlighted = this.highlightedIndex === optionIndex;
            const isLayout = this.isOptionLayout(option);
            const isChip = this.isOptionChip(option);
            const currentOptionIndex = optionIndex++;

            return (
              <li
                key={option.value}
                id={`pds-combobox-option-${currentOptionIndex}`}
                role="option"
                aria-selected={isSelected ? 'true' : 'false'}
                aria-setsize={selectableOptions.length}
                aria-posinset={currentOptionIndex + 1}
                aria-label={isLayout || isChip ? option.getAttribute('aria-label') || this.getOptionLabel(option) : undefined}
                tabindex={isHighlighted ? '0' : '-1'}
                class={{
                  'pds-combobox__option': true,
                  'pds-combobox__option--highlighted': isHighlighted,
                  'pds-combobox__option--layout': isLayout,
                  'pds-combobox__option--chip': isChip,
                }}
                data-option-index={currentOptionIndex}
                onMouseDown={this.onOptionMouseDown}
                onClick={this.onOptionClick}
                onMouseEnter={this.onOptionMouseEnter}
                onKeyDown={this.onOptionKeyDown}
              >
                {isLayout ? (
                  <pds-box class="pds-combobox__option-layout-wrapper" innerHTML={this.getOptionLayoutContent(option)} />
                ) : isChip ? (
                  this.renderOptionChip(option)
                ) : (
                  this.getOptionLabel(option)
                )}
                {isSelected && <pds-icon icon="check" size="regular" class="pds-combobox__option-check" />}
              </li>
            );
          }
          return null;
        })}
      </ul>
    );
  }

  // Helper method to render the caret icon
  private renderCaretIcon() {
    return <pds-icon icon="caret-down" aria-hidden="true" class="pds-combobox__button-trigger-chevron" />;
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

  // Helper method to build chip trigger CSS classes
  private getChipTriggerClass(): string {
    const classes = ['pds-combobox__chip-trigger'];

    // Add sentiment class
    classes.push(`pds-combobox__chip-trigger--${this.selectedChipSentiment}`);

    // Always use dropdown variant for chip triggers
    classes.push('pds-combobox__chip-trigger--dropdown');

    // Add large class if needed
    if (this.selectedChipLarge) {
      classes.push('pds-combobox__chip-trigger--large');
    }

    // Add dot class if needed
    if (this.selectedChipDot) {
      classes.push('pds-combobox__chip-trigger--dot');
    }

    return classes.join(' ');
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

  private renderChipTriggerContent() {
    // Case 1: Custom trigger content with layout priority
    if (this.customTriggerContent) {
      if (this.shouldShowLayoutContent()) {
        // When using custom layouts, the chip handles its own dropdown arrow
        return this.renderChipTriggerLayoutContent();
      }
      // Fall back to slot content when no layout is available - chip handles its own dropdown arrow
      return <slot name="trigger-content" />;
    }

    // Case 2: Standard mode with layout content
    if (this.shouldShowLayoutContent()) {
      // When using custom layouts, the chip handles its own dropdown arrow
      return this.renderChipTriggerLayoutContent();
    }

    // Case 3: Automatic chip mode - selected option has chip attributes
    if (this.selectedOption && this.selectedOptionChipProps) {
      // Render as chip automatically - chip handles its own dropdown arrow
      return this.renderSelectedOptionAsChip();
    }

    // Case 4: Standard mode with default text content
    return [
      this.renderChipTriggerDefaultContent(),
      this.renderCaretIcon()
    ];
  }

  // Helper method to render selected option as chip for trigger (automatic approach)
  private renderSelectedOptionAsChip() {
    if (!this.selectedOption || !this.selectedOptionChipProps) return null;

    return (
      <pds-chip
        sentiment={this.selectedOptionChipProps.sentiment as any}
        variant="dropdown" // Always use dropdown variant for triggers
        large={this.selectedOptionChipProps.large}
        icon={this.selectedOptionChipProps.icon}
        dot={this.selectedOptionChipProps.dot}
        class="pds-combobox__chip-trigger-auto"
      >
        {this.getOptionLabel(this.selectedOption)}
      </pds-chip>
    );
  }

  // Helper method to render chip trigger layout content
  private renderChipTriggerLayoutContent() {
    return (
      <div class="pds-combobox__chip-trigger-layout-wrapper" innerHTML={this.getModifiedLayoutContentForTrigger()} />
    );
  }

  // Helper method to modify layout content for trigger use (ensure dropdown variant)
  private getModifiedLayoutContentForTrigger(): string {
    let content = this.selectedLayoutContent;

    // If the content contains a pds-chip, ensure it has variant="dropdown"
    if (content.includes('<pds-chip')) {
      // Use a temporary div to parse and modify the HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = content;

      const chipElement = tempDiv.querySelector('pds-chip');
      if (chipElement) {
        chipElement.setAttribute('variant', 'dropdown');
        content = tempDiv.innerHTML;
      }
    }

    return content;
  }

  // Helper method to render chip trigger default content
  private renderChipTriggerDefaultContent() {
    return (
      <span class="pds-combobox__chip-trigger-label">
        {this.selectedChipIcon && <pds-icon icon={this.selectedChipIcon} class="pds-combobox__chip-trigger-icon" />}
        {this.selectedLabel || this.placeholder}
      </span>
    );
  }

  // Helper method to render option as chip (new automatic approach)
  private renderOptionChip(option: HTMLOptionElement) {
    const chipProps = this.getOptionChipProps(option);
    return (
      <pds-chip
        sentiment={chipProps.sentiment as any}
        variant="text" // Dropdown options use text variant, not dropdown
        large={chipProps.large}
        icon={chipProps.icon}
        dot={chipProps.dot}
        class="pds-combobox__option-chip"
      >
        {this.getOptionLabel(option)}
      </pds-chip>
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
            <div class="pds-combobox__input-wrapper" style={{ width: this.triggerWidth }}>
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
                aria-activedescendant={this.isOpen && this.highlightedIndex >= 0 ? `pds-combobox-option-${this.highlightedIndex}` : undefined}
                aria-expanded={this.isOpen ? 'true' : 'false'}
                aria-disabled={this.disabled ? 'true' : 'false'}
                aria-label={this.hideLabel ? this.label : undefined}
                id={this.componentId}
                value={this.value}
                placeholder={this.placeholder}
                disabled={this.disabled}
                onInput={this.handleInput}
                onClick={this.handleInputClick}
                onKeyDown={this.handleKeyDown}
                autocomplete="off"
                part="input"
              />
              <pds-icon icon="enlarge" aria-hidden="true" class="pds-combobox__input-icon" />
            </div>
          ) : this.trigger === 'chip' ? (
            <div
              class={this.getChipTriggerClass()}
              style={{ width: this.triggerWidth }}
              role="combobox"
              aria-haspopup="listbox"
              aria-controls="pds-combobox-listbox"
              aria-activedescendant={this.isOpen && this.highlightedIndex >= 0 ? `pds-combobox-option-${this.highlightedIndex}` : undefined}
              aria-expanded={this.isOpen ? 'true' : 'false'}
              aria-disabled={this.disabled ? 'true' : 'false'}
              aria-label={this.hideLabel ? this.label : undefined}
              id={this.componentId}
              tabIndex={this.disabled ? -1 : 0}
              onClick={this.onButtonTriggerClick}
              data-layout={this.customTriggerContent}
              onKeyDown={this.onButtonTriggerKeyDown}
              onKeyUp={this.onButtonTriggerKeyUp}
              ref={el => (this.triggerEl = el as HTMLElement)}
              part="chip-trigger"
            >
              {this.renderChipTriggerContent()}
            </div>
          ) : (
            <div
              class={triggerClass}
              style={{ width: this.triggerWidth }}
              role="combobox"
              aria-haspopup="listbox"
              aria-controls="pds-combobox-listbox"
              aria-activedescendant={this.isOpen && this.highlightedIndex >= 0 ? `pds-combobox-option-${this.highlightedIndex}` : undefined}
              aria-expanded={this.isOpen ? 'true' : 'false'}
              aria-disabled={this.disabled ? 'true' : 'false'}
              aria-label={this.hideLabel ? this.label : undefined}
              id={this.componentId}
              tabIndex={this.disabled ? -1 : 0}
              onClick={this.onButtonTriggerClick}
              data-layout={this.customTriggerContent}
              onKeyDown={this.onButtonTriggerKeyDown}
              onKeyUp={this.onButtonTriggerKeyUp}
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
