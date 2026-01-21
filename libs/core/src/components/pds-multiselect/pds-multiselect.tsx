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
  private inputEl?: HTMLInputElement;
  private containerEl?: HTMLElement;
  private listboxEl?: HTMLElement;
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
  }

  private setupSlotChangeListener() {
    const slot = this.el.shadowRoot?.querySelector('slot:not([name])') as HTMLSlotElement;
    if (slot) {
      slot.addEventListener('slotchange', () => this.updateOptionsFromSlot());
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
  protected valueChanged() {
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
   * Sets focus on the search input.
   */
  @Method()
  async setFocus() {
    this.inputEl?.focus();
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
      this.inputEl?.focus();
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
    const allOptions = this.getAllOptions();
    this.selectedItems = this.value
      .map(val => allOptions.find(opt => String(opt.id) === String(val)))
      .filter((opt): opt is MultiselectOption => opt !== undefined);
  }

  private getAllOptions(): MultiselectOption[] {
    return this.options || this.internalOptions;
  }

  private getFilteredOptions(): MultiselectOption[] {
    const allOptions = this.getAllOptions();
    const query = this.searchQuery.toLowerCase();

    return allOptions.filter(opt => {
      // Filter out already selected items
      const isSelected = this.value.includes(String(opt.id));
      if (isSelected) return false;

      // Filter by search query
      if (query) {
        return opt.text.toLowerCase().includes(query);
      }
      return true;
    });
  }

  private updateFormValue() {
    if (this.internals?.setFormValue) {
      // Submit as multiple values with same name (native select multiple behavior)
      const formData = new FormData();
      this.value.forEach(val => {
        if (this.name) {
          formData.append(this.name, val);
        }
      });
      this.internals.setFormValue(formData);

      // Update validity state for required validation
      if (this.required && this.value.length === 0) {
        this.internals.setValidity(
          { valueMissing: true },
          'Please select at least one option.',
          this.inputEl
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

  private handleInputChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    this.searchQuery = target.value;
    this.highlightedIndex = -1;

    if (!this.isOpen) {
      this.openDropdown();
    }

    // Emit search event for consumer-managed async
    this.pdsMultiselectSearch.emit({ query: this.searchQuery });

    // Fetch from async URL if configured
    if (this.asyncUrl) {
      this.fetchOptions(this.searchQuery, 1);
    }
  };

  private handleInputClick = () => {
    if (!this.isOpen && !this.disabled) {
      this.openDropdown();
    }
  };

  private handleInputKeyDown = (e: KeyboardEvent) => {
    const filteredOptions = this.getFilteredOptions();

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!this.isOpen) {
          this.openDropdown();
        } else {
          this.highlightedIndex = Math.min(this.highlightedIndex + 1, filteredOptions.length - 1);
          this.scrollOptionIntoView();
        }
        break;

      case 'ArrowUp':
        e.preventDefault();
        if (this.isOpen) {
          this.highlightedIndex = Math.max(this.highlightedIndex - 1, 0);
          this.scrollOptionIntoView();
        }
        break;

      case 'Enter':
        e.preventDefault();
        if (this.isOpen && this.highlightedIndex >= 0) {
          const option = filteredOptions[this.highlightedIndex];
          if (option) {
            this.selectOption(option);
          }
        }
        break;

      // Escape is handled by the global @Listen('keydown') handler

      case 'Backspace':
        if (this.searchQuery === '' && this.selectedItems.length > 0) {
          // Remove the last selected item
          const lastItem = this.selectedItems[this.selectedItems.length - 1];
          this.removeSelection(lastItem);
        }
        break;

      case 'Tab':
        this.closeDropdown();
        break;
    }
  };

  private handleContainerFocusOut = () => {
    // Use requestAnimationFrame to delay the check - this allows click events to complete
    // before we decide to close the dropdown
    requestAnimationFrame(() => {
      if (!this.isOpen) return;

      const activeElement = document.activeElement;

      // Check if focus is within our component
      const isInContainer = this.containerEl?.contains(activeElement);
      const isInDropdown = this.listboxEl?.contains(activeElement);
      const isInShadowRoot = activeElement && this.el.shadowRoot?.contains(activeElement);

      if (!isInContainer && !isInDropdown && !isInShadowRoot) {
        this.closeDropdown();
      }
    });
  };

  private openDropdown() {
    if (this.disabled) return;

    this.isOpen = true;
    this.highlightedIndex = -1;

    // Trigger initial fetch if async
    if (this.asyncUrl && this.internalOptions.length === 0) {
      this.fetchOptions(this.searchQuery, 1);
    }

    requestAnimationFrame(() => {
      this.positionDropdown();
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
    if (!this.containerEl || !this.listboxEl) return;

    const updatePosition = () => {
      computePosition(this.containerEl!, this.listboxEl!, {
        placement: 'bottom-start',
        strategy: 'absolute',
        middleware: [
          offset(4),
          flip(),
          shift({ padding: 8 }),
          size({
            apply({ rects, elements }) {
              Object.assign(elements.floating.style, {
                width: `${rects.reference.width}px`,
              });
            },
          }),
        ],
      }).then(({ x, y }) => {
        if (this.listboxEl) {
          this.listboxEl.style.left = `${x}px`;
          this.listboxEl.style.top = `${y}px`;
        }
      });
    };

    // Initial position
    updatePosition();

    // Set up auto-update for window resize and scroll
    this.cleanupAutoUpdate = autoUpdate(
      this.containerEl,
      this.listboxEl,
      updatePosition
    );
  }

  private scrollOptionIntoView() {
    requestAnimationFrame(() => {
      const highlighted = this.listboxEl?.querySelector(`[data-index="${this.highlightedIndex}"]`) as HTMLElement;
      highlighted?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    });
  }

  private selectOption(option: MultiselectOption) {
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

    this.searchQuery = '';
    this.highlightedIndex = -1;
    this.inputEl?.focus();
  }

  private removeSelection(option: MultiselectOption) {
    const newValue = this.value.filter(v => v !== String(option.id));
    this.value = newValue;

    const newSelectedItems = this.selectedItems.filter(item => String(item.id) !== String(option.id));

    this.pdsMultiselectChange.emit({
      values: newValue,
      items: newSelectedItems,
    });

    this.inputEl?.focus();
  }

  private handleOptionMouseDown = (option: MultiselectOption) => (e: MouseEvent) => {
    e.preventDefault(); // Prevent focus change
    this.selectOption(option);
  };

  private handleOptionMouseEnter = (index: number) => () => {
    this.highlightedIndex = index;
  };

  private handleChipRemove = (option: MultiselectOption) => () => {
    this.removeSelection(option);
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

  private renderChips() {
    return this.selectedItems.map(item => (
      <pds-chip
        key={String(item.id)}
        variant="tag"
        sentiment="neutral"
        onPdsTagCloseClick={this.handleChipRemove(item)}
      >
        {item.text}
      </pds-chip>
    ));
  }

  private renderDropdown() {
    if (!this.isOpen) return null;

    const filteredOptions = this.getFilteredOptions();
    const hasSlottedEmpty = !!this.el.querySelector('[slot="empty"]');
    const hasSlottedLoading = !!this.el.querySelector('[slot="loading"]');

    return (
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
          const isHighlighted = index === this.highlightedIndex;
          const optionId = `${this.componentId}-option-${index}`;

          return (
            <li
              key={String(option.id)}
              id={optionId}
              class={{
                'pds-multiselect__option': true,
                'pds-multiselect__option--highlighted': isHighlighted,
              }}
              role="option"
              aria-selected="false"
              data-index={index}
              onMouseDown={this.handleOptionMouseDown(option)}
              onMouseEnter={this.handleOptionMouseEnter(index)}
            >
              <pds-checkbox
                componentId={`${this.componentId}-checkbox-${index}`}
                checked={false}
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
    );
  }

  render() {
    const hasChips = this.selectedItems.length > 0;

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
            class={{
              'pds-multiselect__container': true,
              'pds-multiselect__container--open': this.isOpen,
              'pds-multiselect__container--disabled': this.disabled,
              'pds-multiselect__container--invalid': this.invalid || !!this.errorMessage,
              'pds-multiselect__container--has-chips': hasChips,
            }}
            ref={el => (this.containerEl = el)}
            onFocusout={this.handleContainerFocusOut}
          >
            <div class="pds-multiselect__pillbox">
              {this.renderChips()}
              <input
                ref={el => (this.inputEl = el)}
                type="text"
                class="pds-multiselect__input"
                id={this.componentId}
                name={this.name}
                placeholder={hasChips ? '' : this.placeholder}
                value={this.searchQuery}
                disabled={this.disabled}
                required={this.required}
                aria-required={this.required ? 'true' : undefined}
                aria-expanded={this.isOpen ? 'true' : 'false'}
                aria-controls={`${this.componentId}-listbox`}
                aria-activedescendant={this.highlightedIndex >= 0 ? `${this.componentId}-option-${this.highlightedIndex}` : undefined}
                aria-describedby={assignDescription(this.componentId, this.invalid, this.errorMessage || this.helperMessage)}
                aria-invalid={this.invalid ? 'true' : undefined}
                role="combobox"
                aria-autocomplete="list"
                autocomplete="off"
                onInput={this.handleInputChange}
                onClick={this.handleInputClick}
                onKeyDown={this.handleInputKeyDown}
              />
            </div>
            <pds-icon class="pds-multiselect__icon" icon={enlarge}  />
          </div>

          {this.renderDropdown()}

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
