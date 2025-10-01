import { Component, Element, Event, EventEmitter, h, Host, Prop, State, Watch, Method } from '@stencil/core';
import type { BasePdsProps } from '@utils/interfaces';
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

  private inputEl?: HTMLInputElement;
  private optionEls: HTMLOptionElement[] = [];
  private allItems: (HTMLOptionElement | HTMLOptGroupElement | HTMLPdsTextElement)[] = [];
  private triggerEl?: HTMLElement;
  private listboxEl?: HTMLElement;

  componentWillLoad() {
    this.updateOptions();
  }

  @Watch('value')
  handleValueChange() {
    this.filterOptions();
  }

  @Watch('isOpen')
  handleIsOpenChange(newValue: boolean, oldValue: boolean) {
    console.log('[PDS-COMBOBOX] isOpen changed:', {
      from: oldValue,
      to: newValue,
      stack: new Error().stack?.split('\n').slice(1, 4).join('\n')
    });
  }

  @Watch('selectedOption')
  handleSelectedOptionChange() {
    // Update the layout content when selected option changes
    this.selectedOptionLayoutContent = this.selectedOption && this.isOptionLayout(this.selectedOption)
      ? this.getOptionLayoutContent(this.selectedOption)
      : '';
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
    // Ensure allItems includes optionEls if not already populated (for testing scenarios)
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
    console.log('[PDS-COMBOBOX] openDropdownPositioning called:', {
      triggerEl: !!this.triggerEl,
      listboxEl: !!this.listboxEl,
      isOpen: this.isOpen
    });

    if (this.triggerEl && this.listboxEl) {
      console.log('[PDS-COMBOBOX] Applying dropdown styles and positioning');
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
        console.log('[PDS-COMBOBOX] Positioning dropdown at:', { x, y });
        Object.assign(this.listboxEl.style, {
          left: `${x}px`,
          top: `${y}px`,
          position: 'absolute',
          zIndex: 1000,
        });
        console.log('[PDS-COMBOBOX] Dropdown positioning complete');
      });
    } else {
      console.warn('[PDS-COMBOBOX] Cannot position dropdown - missing elements:', {
        triggerEl: !!this.triggerEl,
        listboxEl: !!this.listboxEl
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
    console.log('[PDS-COMBOBOX] handleKeyDown called:', {
      key: e.key,
      isOpen: this.isOpen,
      target: e.target,
      currentTarget: e.currentTarget,
      highlightedIndex: this.highlightedIndex
    });

    if (!this.isOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Alt+ArrowDown')) {
      console.log('[PDS-COMBOBOX] Opening dropdown via keyboard:', e.key);
      e.preventDefault();
      this.isOpen = true;
      console.log('[PDS-COMBOBOX] isOpen set to:', this.isOpen);
      this.filterOptions();
      // Set highlighted index immediately for testing
      const selectableOptions = this.filteredItems.filter(item => item.tagName === 'OPTION');
      console.log('[PDS-COMBOBOX] Selectable options found:', selectableOptions.length);
      if (selectableOptions.length > 0) {
        this.highlightedIndex = 0;
        console.log('[PDS-COMBOBOX] highlightedIndex set to:', this.highlightedIndex);
      }
      setTimeout(() => {
        console.log('[PDS-COMBOBOX] Executing delayed dropdown positioning and focus');
        this.openDropdownPositioning();
        this.focusFirstOption();
      }, 0);
      return;
    }

    if (!this.isOpen) {
      console.log('[PDS-COMBOBOX] Dropdown not open, ignoring key:', e.key);
      return;
    }

    // Get only the option elements (skip group labels) for navigation
    const selectableOptions = this.filteredItems.filter(item => item.tagName === 'OPTION') as HTMLOptionElement[];
    console.log('[PDS-COMBOBOX] Navigation - selectableOptions:', selectableOptions.length, 'current highlightedIndex:', this.highlightedIndex);

    switch (e.key) {
      case 'ArrowDown':
        console.log('[PDS-COMBOBOX] ArrowDown pressed');
        e.preventDefault();

        // If we're not in arrow-key navigation mode yet, enable it now
        if (!this.isArrowKeyNavigationMode) {
          console.log('[PDS-COMBOBOX] Enabling arrow-key navigation mode from dropdown');
          this.isArrowKeyNavigationMode = true;
        }

        // If no option is highlighted and we have options, start at 0
        if (this.highlightedIndex < 0 && selectableOptions.length > 0) {
          this.highlightedIndex = 0;
          console.log('[PDS-COMBOBOX] Starting navigation at index 0');
        } else {
          this.highlightedIndex = Math.min(this.highlightedIndex + 1, selectableOptions.length - 1);
          console.log('[PDS-COMBOBOX] Moving down to index:', this.highlightedIndex);
        }
        this.updateOptionFocus();
        break;
      case 'ArrowUp':
        e.preventDefault();

        // If we're not in arrow-key navigation mode yet, enable it now
        if (!this.isArrowKeyNavigationMode) {
          console.log('[PDS-COMBOBOX] Enabling arrow-key navigation mode from dropdown');
          this.isArrowKeyNavigationMode = true;
        }

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
    console.log('[PDS-COMBOBOX] focusFirstOption called:', {
      isOpen: this.isOpen,
      filteredItemsLength: this.filteredItems.length
    });

    if (this.isOpen) {
      const selectableOptions = this.filteredItems.filter(item => item.tagName === 'OPTION');
      console.log('[PDS-COMBOBOX] focusFirstOption - selectableOptions:', selectableOptions.length);
      if (selectableOptions.length > 0) {
        this.highlightedIndex = 0;
        console.log('[PDS-COMBOBOX] focusFirstOption - highlightedIndex set to:', this.highlightedIndex);
        // DON'T focus the option elements - keep focus on trigger and use aria-activedescendant
        // This prevents the focusout event that was closing the dropdown
        // But still call updateOptionFocus for scrolling
        if (this.listboxEl) {
          console.log('[PDS-COMBOBOX] focusFirstOption - calling updateOptionFocus');
          this.updateOptionFocus();
        } else {
          console.warn('[PDS-COMBOBOX] focusFirstOption - no listboxEl available');
        }
      }
    }
  }

  /**
   * Focus management helper - actually focuses the first option when opened via arrow keys
   */
  private focusFirstOptionForArrowKeys() {
    console.log('[PDS-COMBOBOX] focusFirstOptionForArrowKeys called:', {
      isOpen: this.isOpen,
      filteredItemsLength: this.filteredItems.length,
      listboxEl: !!this.listboxEl
    });

    if (this.isOpen) {
      // Set arrow-key navigation mode
      this.isArrowKeyNavigationMode = true;
      console.log('[PDS-COMBOBOX] Arrow-key navigation mode enabled');

      const selectableOptions = this.filteredItems.filter(item => item.tagName === 'OPTION');
      console.log('[PDS-COMBOBOX] focusFirstOptionForArrowKeys - selectableOptions:', selectableOptions.length);
      if (selectableOptions.length > 0) {
        this.highlightedIndex = 0;
        console.log('[PDS-COMBOBOX] focusFirstOptionForArrowKeys - highlightedIndex set to:', this.highlightedIndex);
        // For arrow key navigation, actually focus the first option
        if (this.listboxEl) {
          const optionElements = this.listboxEl.querySelectorAll('[role="option"]');
          console.log('[PDS-COMBOBOX] focusFirstOptionForArrowKeys - found option elements:', optionElements.length);
          const firstOption = optionElements[0] as HTMLElement;
          if (firstOption) {
            console.log('[PDS-COMBOBOX] focusFirstOptionForArrowKeys - focusing first option:', firstOption);
            // Remove tabindex from all options first
            optionElements.forEach(option => {
              (option as HTMLElement).setAttribute('tabindex', '-1');
            });
            // Set tabindex and focus on first option
            firstOption.setAttribute('tabindex', '0');
            firstOption.focus();
            firstOption.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            console.log('[PDS-COMBOBOX] focusFirstOptionForArrowKeys - focus set on first option');
          } else {
            console.warn('[PDS-COMBOBOX] focusFirstOptionForArrowKeys - no first option found');
          }
        } else {
          console.warn('[PDS-COMBOBOX] focusFirstOptionForArrowKeys - no listboxEl available');
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

      console.log('[PDS-COMBOBOX] updateOptionFocus:', {
        highlightedIndex: this.highlightedIndex,
        hasOptionFocus: hasOptionFocus,
        isArrowKeyNavigationMode: this.isArrowKeyNavigationMode,
        activeElement: document.activeElement
      });

      if (hasOptionFocus || this.isArrowKeyNavigationMode) {
        // We're in arrow-key navigation mode, so actually move focus between options
        console.log('[PDS-COMBOBOX] Moving actual DOM focus to option:', this.highlightedIndex);
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

  // Handler for button trigger click
  private onButtonTriggerClick = () => {
    this.isOpen = !this.isOpen;
    if (this.isOpen) setTimeout(() => this.openDropdownPositioning(), 0);
  };

  // Handler for button trigger keyboard events
  private onButtonTriggerKeyDown = (e: KeyboardEvent) => {
    console.log('[PDS-COMBOBOX] onButtonTriggerKeyDown called:', {
      key: e.key,
      isOpen: this.isOpen,
      target: e.target,
      triggerEl: this.triggerEl
    });

    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      console.log('[PDS-COMBOBOX] Button trigger activation key pressed:', e.key);
      e.preventDefault();
      e.stopPropagation(); // Prevent the event from bubbling and triggering click

      if (!this.isOpen) {
        console.log('[PDS-COMBOBOX] Opening dropdown from button trigger');
        this.isOpen = true; // CRITICAL FIX: This was incorrectly set to false, preventing dropdown from opening!
        console.log('[PDS-COMBOBOX] isOpen set to:', this.isOpen);
        this.filterOptions();
        // Set highlighted index immediately for testing
        const selectableOptions = this.filteredItems.filter(item => item.tagName === 'OPTION');
        console.log('[PDS-COMBOBOX] Button trigger - selectableOptions found:', selectableOptions.length);
        if (selectableOptions.length > 0) {
          this.highlightedIndex = 0;
          console.log('[PDS-COMBOBOX] Button trigger - highlightedIndex set to:', this.highlightedIndex);
        }
        setTimeout(() => {
          console.log('[PDS-COMBOBOX] Button trigger - executing delayed positioning and focus');
          this.openDropdownPositioning();
          // For arrow keys, focus the first option so subsequent navigation works
          // For space/enter, keep focus on trigger (handled in focusFirstOption)
          if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            console.log('[PDS-COMBOBOX] Using focusFirstOptionForArrowKeys for:', e.key);
            this.focusFirstOptionForArrowKeys();
          } else {
            console.log('[PDS-COMBOBOX] Using focusFirstOption for:', e.key);
            this.focusFirstOption();
          }
        }, 0);
      }
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

    console.log('[PDS-COMBOBOX] onComboboxFocusOut called:', {
      target: event.target,
      relatedTarget: relatedTarget,
      elContainsRelatedTarget: isRelatedTargetInCombobox,
      isRelatedTargetInListbox: isRelatedTargetInListbox,
      isOpen: this.isOpen
    });

    // Don't close if focus is moving to an option in the listbox or staying within the combobox
    if (!isRelatedTargetInCombobox && !isRelatedTargetInListbox) {
      console.log('[PDS-COMBOBOX] Focus left combobox - closing dropdown');
      this.isOpen = false;
      this.highlightedIndex = -1;
      this.isArrowKeyNavigationMode = false; // Reset arrow-key navigation mode
      this.updateAriaActiveDescendant(); // Clear aria-activedescendant

      // If there's a selected option but the input value doesn't match, restore the selected option's value
      if (this.selectedOption && this.value !== this.getOptionLabel(this.selectedOption)) {
        this.value = this.getOptionLabel(this.selectedOption);
      }
    } else {
      console.log('[PDS-COMBOBOX] Focus stayed within combobox or moved to listbox - keeping dropdown open');
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
    console.log('[PDS-COMBOBOX] renderDropdown called:', {
      isOpen: this.isOpen,
      filteredItemsLength: this.filteredItems.length
    });

    if (!this.isOpen || this.filteredItems.length === 0) {
      console.log('[PDS-COMBOBOX] renderDropdown returning null - not open or no items');
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
            const currentOptionIndex = optionIndex++;

            return (
              <li
                key={option.value}
                id={`pds-combobox-option-${currentOptionIndex}`}
                role="option"
                aria-selected={isSelected ? 'true' : 'false'}
                aria-setsize={selectableOptions.length}
                aria-posinset={currentOptionIndex + 1}
                aria-label={isLayout ? option.getAttribute('aria-label') || this.getOptionLabel(option) : undefined}
                tabindex={isHighlighted ? '0' : '-1'}
                class={{
                  'pds-combobox__option': true,
                  'pds-combobox__option--highlighted': isHighlighted,
                  'pds-combobox__option--layout': isLayout,
                }}
                data-option-index={currentOptionIndex}
                onMouseDown={this.onOptionMouseDown}
                onClick={this.onOptionClick}
                onMouseEnter={this.onOptionMouseEnter}
                onKeyDown={this.onOptionKeyDown}
              >
                {isLayout ? (
                  <pds-box class="pds-combobox__option-layout-wrapper" innerHTML={this.getOptionLayoutContent(option)} />
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
              <pds-icon icon="enlarge" aria-hidden="true" class="pds-combobox__input-icon" />
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
