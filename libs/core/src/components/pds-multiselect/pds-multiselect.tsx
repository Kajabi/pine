import { Component, Element, Event, EventEmitter, h, Host, Listen, Method, Prop, State, Watch } from '@stencil/core';
import { computePosition, flip, offset, shift, size, autoUpdate } from '@floating-ui/dom';
import { debounceEvent } from '@utils/utils';
import { messageId, assignDescription } from '../../utils/form';
import { danger, enlarge } from '@pine-ds/icons/icons';
import type {
  MultiselectOption,
  MultiselectChangeEventDetail,
  MultiselectSearchEventDetail,
  MultiselectLoadOptionsEventDetail,
  AsyncResponse,
} from './multiselect-interface';

/**
 * @slot (default) - Static option elements for the multiselect
 * @slot empty - Custom empty state message when no options match
 * @slot loading - Custom loading indicator
 */
@Component({
  tag: 'pds-multiselect',
  styleUrl: 'pds-multiselect.scss',
  shadow: true,
  formAssociated: true,
})
export class PdsMultiselect {
  private triggerEl?: HTMLButtonElement;
  private searchInputEl?: HTMLInputElement;
  private containerEl?: HTMLElement;
  private listboxEl?: HTMLElement;
  private panelEl?: HTMLElement;
  private internals?: ElementInternals;
  private abortController?: AbortController;
  private observer?: MutationObserver;
  private cleanupAutoUpdate?: () => void;

  @Element() el!: HTMLPdsMultiselectElement;

  /**
   * A unique identifier used for the underlying component `id` attribute.
   */
  @Prop() componentId!: string;

  /**
   * Text to be displayed as the multiselect label.
   */
  @Prop() label?: string;

  /**
   * Placeholder text for the search input.
   */
  @Prop() placeholder?: string = 'Select...';

  /**
   * The name of the form control for form submission.
   */
  @Prop() name?: string;

  /**
   * Array of selected option values.
   */
  @Prop({ mutable: true }) value: string[] = [];

  /**
   * Whether the multiselect is disabled.
   */
  @Prop() disabled: boolean = false;

  /**
   * URL endpoint for async data fetching.
   */
  @Prop() asyncUrl?: string;

  /**
   * HTTP method for async requests.
   */
  @Prop() asyncMethod: 'GET' | 'POST' = 'GET';

  /**
   * Debounce delay in milliseconds for search/fetch.
   */
  @Prop() debounceMs: number = 300;

  /**
   * Maximum number of selections allowed.
   */
  @Prop() maxSelections?: number;

  /**
   * Maximum height of the dropdown before scrolling.
   */
  @Prop() maxHeight: string = '300px';

  /**
   * Width of the trigger button (and reference for dropdown positioning).
   */
  @Prop() triggerWidth: string = '100%';

  /**
   * Minimum width of the dropdown panel.
   */
  @Prop() minWidth: string = '250px';

  /**
   * Width of the dropdown panel. Defaults to the trigger width.
   */
  @Prop() panelWidth?: string;

  /**
   * Visually hides the label but keeps it accessible.
   */
  @Prop() hideLabel: boolean = false;

  /**
   * Error message to display.
   */
  @Prop() errorMessage?: string;

  /**
   * Helper message to display below the input.
   */
  @Prop() helperMessage?: string;

  /**
   * Whether the component is in an invalid state.
   */
  @Prop() invalid?: boolean;

  /**
   * Whether the multiselect is required.
   */
  @Prop() required: boolean = false;

  /**
   * Whether the component is currently loading async options.
   */
  @Prop({ mutable: true }) loading: boolean = false;

  /**
   * Options provided externally (for consumer-managed async).
   */
  @Prop() options?: MultiselectOption[];

  /**
   * Function to format async results. Receives raw API response item.
   */
  @Prop() formatResult?: (item: unknown) => MultiselectOption;

  // Internal state
  @State() isOpen: boolean = false;
  @State() searchQuery: string = '';
  @State() highlightedIndex: number = -1;
  @State() internalOptions: MultiselectOption[] = [];
  @State() selectedItems: MultiselectOption[] = [];
  @State() currentPage: number = 1;
  @State() hasMore: boolean = false;

  // Flag to prevent focusout from closing during open transition
  private isOpening: boolean = false;

  /**
   * Emitted when selection changes.
   */
  @Event() pdsMultiselectChange!: EventEmitter<MultiselectChangeEventDetail>;

  /**
   * Emitted on search input (for consumer-managed async).
   */
  @Event() pdsMultiselectSearch!: EventEmitter<MultiselectSearchEventDetail>;

  /**
   * Emitted to request more options (pagination).
   */
  @Event() pdsMultiselectLoadOptions!: EventEmitter<MultiselectLoadOptionsEventDetail>;

  private originalSearchEmitter?: EventEmitter<MultiselectSearchEventDetail>;

  connectedCallback() {
    if (this.el.attachInternals) {
      this.internals = this.el.attachInternals();
    }
  }

  componentWillLoad() {
    this.originalSearchEmitter = this.pdsMultiselectSearch;
    this.syncSelectedItems();
  }

  componentDidLoad() {
    this.setupDebounce();
    this.setupMutationObserver();
    this.setupSlotChangeListener();
    this.updateFormValue();

    // Ensure preselected values sync after DOM is fully ready
    // This handles cases where slot content loads after initial render (e.g., in docs/MDX)
    requestAnimationFrame(() => {
      this.updateOptionsFromSlot();
      this.syncSelectedItems();
    });
  }

  private setupSlotChangeListener() {
    const slot = this.el.shadowRoot?.querySelector('slot:not([name])') as HTMLSlotElement;
    if (slot) {
      slot.addEventListener('slotchange', () => {
        this.updateOptionsFromSlot();
        this.syncSelectedItems();
      });
      // Also call it immediately in case content is already slotted
      this.updateOptionsFromSlot();
    }
  }

  disconnectedCallback() {
    this.observer?.disconnect();
    this.abortController?.abort();
    this.cleanupAutoUpdate?.();
  }

  @Watch('debounceMs')
  protected setupDebounce() {
    const { pdsMultiselectSearch, debounceMs, originalSearchEmitter } = this;
    this.pdsMultiselectSearch = debounceMs === undefined
      ? originalSearchEmitter ?? pdsMultiselectSearch
      : debounceEvent(pdsMultiselectSearch, debounceMs);
  }

  @Watch('value')
  protected valueChanged(newValue: string[] | string) {
    // Handle JSON string values (from HTML attributes)
    if (typeof newValue === 'string') {
      try {
        const parsed = JSON.parse(newValue);
        if (Array.isArray(parsed)) {
          this.value = parsed;
          return; // The assignment will trigger this watcher again with the array
        }
      } catch {
        // Not valid JSON, treat as single value
        this.value = newValue ? [newValue] : [];
        return;
      }
    }
    this.syncSelectedItems();
    this.updateFormValue();
  }

  @Watch('options')
  protected optionsChanged() {
    if (this.options) {
      this.internalOptions = [...this.options];
    }
  }

  @Watch('internalOptions')
  protected internalOptionsChanged() {
    // Re-sync selected items when options become available
    // This handles the case where value is set before options are loaded (e.g., from slot)
    this.syncSelectedItems();
  }

  /**
   * Sets focus on the trigger button.
   */
  @Method()
  async setFocus() {
    this.triggerEl?.focus();
  }

  /**
   * Handle global keyboard events for accessibility.
   * Closes dropdown on Escape key press regardless of focus location.
   */
  @Listen('keydown', { target: 'window' })
  handleWindowKeyDown(event: KeyboardEvent) {
    if (!this.isOpen) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      this.closeDropdown();
      this.triggerEl?.focus();
    }
  }

  private setupMutationObserver() {
    this.observer = new MutationObserver(() => {
      this.updateOptionsFromSlot();
    });

    this.observer.observe(this.el, {
      childList: true,
      subtree: true,
    });
  }

  private updateOptionsFromSlot() {
    const slot = this.el.shadowRoot?.querySelector('slot:not([name])') as HTMLSlotElement;
    if (!slot) return;

    const options = slot.assignedElements({ flatten: true })
      .filter((el): el is HTMLOptionElement => el.tagName === 'OPTION')
      .map(opt => ({
        id: opt.value,
        text: opt.textContent || opt.value,
      }));

    // Only update if we actually found options AND we're not using async/external options
    // Don't clear internalOptions if slot returns empty (might be mid-DOM-update)
    if (options.length > 0 && !this.asyncUrl && !this.options) {
      this.internalOptions = options;
    }
  }

  private syncSelectedItems() {
    // Ensure value is an array (may be string from HTML attribute)
    const valueArray = this.ensureValueArray();
    const allOptions = this.getAllOptions();
    this.selectedItems = valueArray
      .map(val => allOptions.find(opt => String(opt.id) === String(val)))
      .filter((opt): opt is MultiselectOption => opt !== undefined);
  }

  private ensureValueArray(): string[] {
    // Handle JSON string values passed via HTML attribute
    if (typeof this.value === 'string') {
      try {
        const parsed = JSON.parse(this.value as unknown as string);
        if (Array.isArray(parsed)) {
          this.value = parsed;
          return parsed;
        }
      } catch {
        // Not valid JSON, treat as single value
        const singleValue = this.value as unknown as string;
        this.value = singleValue ? [singleValue] : [];
        return this.value;
      }
    }
    return Array.isArray(this.value) ? this.value : [];
  }

  private getAllOptions(): MultiselectOption[] {
    return this.options || this.internalOptions;
  }

  private getFilteredOptions(): MultiselectOption[] {
    const allOptions = this.getAllOptions();
    const query = this.searchQuery.toLowerCase();

    return allOptions.filter(opt => {
      // Filter by search query only - don't filter out selected items
      if (query) {
        return opt.text.toLowerCase().includes(query);
      }
      return true;
    });
  }

  private updateFormValue() {
    if (this.internals?.setFormValue) {
      // Ensure value is an array before iterating
      const valueArray = this.ensureValueArray();

      // Submit as multiple values with same name (native select multiple behavior)
      const formData = new FormData();
      valueArray.forEach(val => {
        if (this.name) {
          formData.append(this.name, val);
        }
      });
      this.internals.setFormValue(formData);

      // Update validity state for required validation
      if (this.required && valueArray.length === 0) {
        this.internals.setValidity(
          { valueMissing: true },
          'Please select at least one option.',
          this.triggerEl
        );
      } else {
        this.internals.setValidity({});
      }
    }
  }

  private async fetchOptions(query: string, page: number = 1) {
    if (!this.asyncUrl) return;

    this.abortController?.abort();
    this.abortController = new AbortController();

    this.loading = true;

    try {
      const url = new URL(this.asyncUrl, window.location.origin);
      if (this.asyncMethod === 'GET') {
        url.searchParams.set('search', query);
        url.searchParams.set('page', String(page));
      }

      const response = await fetch(url.toString(), {
        method: this.asyncMethod,
        signal: this.abortController.signal,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        ...(this.asyncMethod === 'POST' && {
          body: JSON.stringify({ search: query, page }),
        }),
      });

      if (!response.ok) throw new Error('Failed to fetch options');

      const data: AsyncResponse = await response.json();

      const formattedResults = data.results.map(item => {
        if (this.formatResult) {
          return this.formatResult(item);
        }
        return {
          id: item.id,
          text: item.text,
          ...item,
        };
      });

      if (page === 1) {
        this.internalOptions = formattedResults;
      } else {
        this.internalOptions = [...this.internalOptions, ...formattedResults];
      }

      this.hasMore = data.totalCount ? this.internalOptions.length < data.totalCount : false;
      this.currentPage = page;

    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('PdsMultiselect: Failed to fetch options', error);
      }
    } finally {
      this.loading = false;
    }
  }

  private handleTriggerClick = () => {
    if (this.disabled) return;

    if (this.isOpen) {
      this.closeDropdown();
    } else {
      this.openDropdown();
    }
  };

  private handleTriggerKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowUp':
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (!this.isOpen) {
          this.openDropdown();
        }
        break;
    }
  };

  private handleSearchInputChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    this.searchQuery = target.value;
    this.highlightedIndex = -1;

    // Emit search event for consumer-managed async
    this.pdsMultiselectSearch.emit({ query: this.searchQuery });

    // Fetch from async URL if configured
    if (this.asyncUrl) {
      this.fetchOptions(this.searchQuery, 1);
    }
  };

  private handleSearchInputKeyDown = (e: KeyboardEvent) => {
    const filteredOptions = this.getFilteredOptions();

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        this.highlightedIndex = Math.min(this.highlightedIndex + 1, filteredOptions.length - 1);
        this.scrollOptionIntoView();
        break;

      case 'ArrowUp':
        e.preventDefault();
        this.highlightedIndex = Math.max(this.highlightedIndex - 1, 0);
        this.scrollOptionIntoView();
        break;

      case 'Enter':
        e.preventDefault();
        if (this.highlightedIndex >= 0) {
          const option = filteredOptions[this.highlightedIndex];
          if (option) {
            this.selectOption(option);
          }
        }
        break;

      // Escape is handled by the global @Listen('keydown') handler

      case 'Tab':
        this.closeDropdown();
        break;
    }
  };

  private handleContainerFocusOut = () => {
    // Use setTimeout to delay the check - this allows click events and focus transitions to complete
    // before we decide to close the dropdown
    setTimeout(() => {
      // Don't close if we're in the middle of opening or already closed
      if (!this.isOpen || this.isOpening) return;

      const activeElement = document.activeElement;

      // Check if focus is within our component's shadow root
      const isInShadowRoot = this.el.shadowRoot?.contains(activeElement);

      // Also check if focus is on the host element itself
      const isOnHost = activeElement === this.el;

      if (!isInShadowRoot && !isOnHost) {
        this.closeDropdown();
      }
    }, 0);
  };

  private openDropdown() {
    if (this.disabled) return;

    this.isOpening = true;
    this.isOpen = true;
    this.highlightedIndex = -1;

    // Trigger initial fetch if async
    if (this.asyncUrl && this.internalOptions.length === 0) {
      this.fetchOptions(this.searchQuery, 1);
    }

    requestAnimationFrame(() => {
      this.positionDropdown();
      // Focus the search input after the panel is positioned
      this.searchInputEl?.focus();
      // Clear the opening flag after focus has moved
      setTimeout(() => {
        this.isOpening = false;
      }, 50);
    });
  }

  private closeDropdown() {
    this.isOpen = false;
    this.highlightedIndex = -1;
    this.searchQuery = '';

    // Clean up auto-update
    if (this.cleanupAutoUpdate) {
      this.cleanupAutoUpdate();
      this.cleanupAutoUpdate = undefined;
    }
  }

  private positionDropdown() {
    if (!this.containerEl || !this.panelEl) return;
    const referenceEl = this.triggerEl || this.containerEl;

    const { minWidth, panelWidth } = this;

    const updatePosition = () => {
      computePosition(referenceEl!, this.panelEl!, {
        placement: 'bottom-start',
        strategy: 'absolute',
        middleware: [
          offset(12),
          flip(),
          shift({ padding: 8 }),
          size({
            apply: ({ rects, elements }) => {
              Object.assign(elements.floating.style, {
                width: panelWidth ?? `${rects.reference.width}px`,
                minWidth,
              });
            },
          }),
        ],
      }).then(({ x, y }) => {
        if (this.panelEl) {
          this.panelEl.style.left = `${x}px`;
          this.panelEl.style.top = `${y}px`;
        }
      });
    };

    // Initial position
    updatePosition();

    // Set up auto-update for window resize and scroll
    this.cleanupAutoUpdate = autoUpdate(
      referenceEl!,
      this.panelEl,
      updatePosition
    );
  }

  private scrollOptionIntoView() {
    requestAnimationFrame(() => {
      const highlighted = this.listboxEl?.querySelector(`[data-index="${this.highlightedIndex}"]`) as HTMLElement;
      highlighted?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    });
  }

  private toggleOption(option: MultiselectOption) {
    const isSelected = this.value.includes(String(option.id));

    if (isSelected) {
      // Remove from selection
      const newValue = this.value.filter(v => v !== String(option.id));
      this.value = newValue;

      const newSelectedItems = this.selectedItems.filter(item => String(item.id) !== String(option.id));

      this.pdsMultiselectChange.emit({
        values: newValue,
        items: newSelectedItems,
      });
    } else {
      // Add to selection
      if (this.maxSelections && this.value.length >= this.maxSelections) {
        return;
      }

      const newValue = [...this.value, String(option.id)];
      this.value = newValue;

      const newSelectedItems = [...this.selectedItems, option];

      this.pdsMultiselectChange.emit({
        values: newValue,
        items: newSelectedItems,
      });
    }

    // Keep focus on search input, don't close dropdown
    this.searchInputEl?.focus();
  }

  private selectOption(option: MultiselectOption) {
    // For keyboard navigation - toggle the option
    this.toggleOption(option);
  }

  private handleOptionMouseDown = (option: MultiselectOption) => (e: MouseEvent) => {
    e.preventDefault(); // Prevent focus change
    this.toggleOption(option);
  };

  private handleOptionMouseEnter = (index: number) => () => {
    this.highlightedIndex = index;
  };


  private handleScroll = (e: Event) => {
    if (!this.asyncUrl || !this.hasMore || this.loading) return;

    const target = e.target as HTMLElement;
    const scrollBottom = target.scrollHeight - target.scrollTop - target.clientHeight;

    // Load more when near bottom (within 50px)
    if (scrollBottom < 50) {
      this.pdsMultiselectLoadOptions.emit({
        query: this.searchQuery,
        page: this.currentPage + 1,
      });
      this.fetchOptions(this.searchQuery, this.currentPage + 1);
    }
  };


  private renderSelectedItemsList() {
    if (this.selectedItems.length === 0) return null;

    return (
      <div class="pds-multiselect__selected-section">
        <ul class="pds-multiselect__selected-list" role="list">
          {this.selectedItems.map(item => (
            <li key={String(item.id)} class="pds-multiselect__selected-item">
              {item.text}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  private renderDropdown() {
    if (!this.isOpen) return null;

    const filteredOptions = this.getFilteredOptions();
    const valueArray = this.ensureValueArray();
    const hasSlottedEmpty = !!this.el.querySelector('[slot="empty"]');
    const hasSlottedLoading = !!this.el.querySelector('[slot="loading"]');

    return (
      <div
        class="pds-multiselect__panel"
        ref={el => (this.panelEl = el)}
        style={{ minWidth: this.minWidth }}
      >
        {/* Search input */}
        <div class="pds-multiselect__search">
          <pds-icon name="search" size="small" />
          <input
            ref={el => (this.searchInputEl = el)}
            type="text"
            class="pds-multiselect__search-input"
            placeholder="Find..."
            value={this.searchQuery}
            aria-label="Search options"
            aria-controls={`${this.componentId}-listbox`}
            aria-activedescendant={this.highlightedIndex >= 0 ? `${this.componentId}-option-${this.highlightedIndex}` : undefined}
            role="combobox"
            aria-haspopup="listbox"
            aria-expanded="true"
            aria-autocomplete="list"
            autocomplete="off"
            onInput={this.handleSearchInputChange}
            onKeyDown={this.handleSearchInputKeyDown}
          />
        </div>

        {/* Selected items section */}
        {this.renderSelectedItemsList()}

        {/* Options list */}
        <ul
          class="pds-multiselect__listbox"
          role="listbox"
          aria-multiselectable="true"
          aria-label={this.label || 'Options'}
          id={`${this.componentId}-listbox`}
          ref={el => (this.listboxEl = el)}
          style={{ maxHeight: this.maxHeight }}
          onScroll={this.handleScroll}
        >
          {this.loading && (
            <li class="pds-multiselect__loading" role="presentation">
              {hasSlottedLoading ? (
                <slot name="loading" />
              ) : (
                <pds-loader size="small" />
              )}
            </li>
          )}

          {!this.loading && filteredOptions.length === 0 && (
            <li class="pds-multiselect__empty" role="presentation">
              {hasSlottedEmpty ? (
                <slot name="empty" />
              ) : (
                <span>No options found</span>
              )}
            </li>
          )}

          {filteredOptions.map((option, index) => {
            const isSelected = valueArray.includes(String(option.id));
            const isHighlighted = index === this.highlightedIndex;
            const optionId = `${this.componentId}-option-${index}`;

            return (
              <li
                key={String(option.id)}
                id={optionId}
                class={{
                  'pds-multiselect__option': true,
                  'pds-multiselect__option--highlighted': isHighlighted,
                  'pds-multiselect__option--selected': isSelected,
                }}
                role="option"
                aria-selected={isSelected ? 'true' : 'false'}
                data-index={index}
                onMouseDown={this.handleOptionMouseDown(option)}
                onMouseEnter={this.handleOptionMouseEnter(index)}
              >
                <pds-checkbox
                  componentId={`${this.componentId}-checkbox-${index}`}
                  checked={isSelected}
                  label={option.text}
                  style={{ pointerEvents: 'none' }}
                />
              </li>
            );
          })}

          {this.hasMore && !this.loading && (
            <li class="pds-multiselect__load-more" role="presentation">
              <pds-loader size="small" />
            </li>
          )}
        </ul>
      </div>
    );
  }

  private getTriggerText(): string {
    const count = this.selectedItems.length;
    if (count === 0) {
      return this.placeholder || 'Select...';
    }
    return `${count} item${count === 1 ? '' : 's'}`;
  }

  render() {
    const hasSelections = this.selectedItems.length > 0;

    return (
      <Host
        aria-disabled={this.disabled ? 'true' : null}
      >
        <div class="pds-multiselect">
          {this.label && (
            <label
              htmlFor={this.componentId}
              class={{
                'pds-multiselect__label': true,
                'visually-hidden': this.hideLabel,
              }}
            >
              {this.label}
            </label>
          )}

          <div
            class="pds-multiselect__wrapper"
            ref={el => (this.containerEl = el)}
            onFocusout={this.handleContainerFocusOut}
            style={{ width: this.triggerWidth }}
          >
            <button
              ref={el => (this.triggerEl = el)}
              type="button"
              class={{
                'pds-multiselect__trigger': true,
                'pds-multiselect__trigger--open': this.isOpen,
                'pds-multiselect__trigger--disabled': this.disabled,
                'pds-multiselect__trigger--invalid': this.invalid || !!this.errorMessage,
                'pds-multiselect__trigger--has-value': hasSelections,
              }}
              id={this.componentId}
              disabled={this.disabled}
              aria-required={this.required ? 'true' : undefined}
              aria-expanded={this.isOpen ? 'true' : 'false'}
              aria-haspopup="listbox"
              aria-describedby={assignDescription(this.componentId, this.invalid, this.errorMessage || this.helperMessage)}
              aria-invalid={this.invalid ? 'true' : undefined}
              onClick={this.handleTriggerClick}
              onKeyDown={this.handleTriggerKeyDown}
            >
              <span class={{
                'pds-multiselect__trigger-text': true,
                'pds-multiselect__trigger-text--placeholder': !hasSelections,
              }}>
                {this.getTriggerText()}
              </span>
              <pds-icon class="pds-multiselect__icon" icon={enlarge} />
            </button>

            {this.renderDropdown()}
          </div>

          {this.helperMessage && !this.errorMessage && (
            <p class="pds-multiselect__helper" id={messageId(this.componentId, 'helper')}>
              {this.helperMessage}
            </p>
          )}

          {this.errorMessage && (
            <p class="pds-multiselect__error" id={messageId(this.componentId, 'error')}>
              <pds-icon icon={danger} size="small" />
              {this.errorMessage}
            </p>
          )}

          {/* Hidden slot for static options */}
          <div style={{ display: 'none' }}>
            <slot />
          </div>
        </div>
      </Host>
    );
  }
}
