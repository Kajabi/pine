import { Component, Element, Event, EventEmitter, h, Host, Prop, State, Watch, Method } from '@stencil/core';
import type { BasePdsProps } from '@utils/interfaces';
import { assignDescription, isSpecTest, messageId } from '../../utils/form';
import type { ChipSentimentType } from '@utils/types';
import { autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom';
import { cancelDebouncedEvent, debounceEvent, flushDebouncedEvent } from '@utils/utils';
import { closest } from '@utils/closest';
import DOMPurify from 'dompurify';
import {
  FlyoutController,
  buildPanelEntries,
  findGroup,
  groupIconOf,
  groupLabelOf,
  isGroupDisabled,
  isOptionDisabled,
  optionIconOf,
  panelColumn,
  parentOptgroupOf,
} from './grouped-options-panel';
import type { PanelEntry, PanelGroup, PanelItem } from './grouped-options-panel';
import type {
  ComboboxOption,
  ComboboxSearchEventDetail,
  ComboboxLoadOptionsEventDetail,
  AsyncResponse,
} from './combobox-interface';

/**
 * @slot option - Option elements for the combobox dropdown
 * @slot trigger-content - Custom content for the button trigger when customTriggerContent is true
 * @slot empty - Custom empty state message when no options match
 * @slot loading - Custom loading indicator
 */
@Component({
  tag: 'pds-combobox',
  styleUrl: 'pds-combobox.scss',
  shadow: true,
  formAssociated: true,
})
export class PdsCombobox implements BasePdsProps {
  /** Reference to the host element */
  @Element() el!: HTMLPdsComboboxElement;

  /**
   * A unique identifier used for the underlying component `id` attribute.
   */
  @Prop() componentId!: string;

  /**
   * The name of the form control. Submitted with the form as part of a name/value pair.
   */
  @Prop({ reflect: true }) name?: string;

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
   * Error message to display.
   */
  @Prop() errorMessage?: string;

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
   * Where to mount the dropdown listbox (`host` or `body`, sometimes called “append to body”).
   * Use `body` inside scrollable containers (for example modals) so the list is not clipped by
   * `overflow: hidden` ancestors. The portal is appended to the nearest `<dialog>` when present
   * (including `pds-modal` / `showModal()`), using a composed ascent so shadow DOM and slot
   * boundaries do not hide the dialog from discovery; otherwise it is appended to `document.body`.
   * Keyboard focus stays on the trigger, or moves to the panel's own search field, so modal focus
   * traps keep working. The mounted dropdown renders in its own shadow root with the combobox's
   * styles, so it needs no global CSS and page CSS can't reach it: customize it with custom
   * properties on `pds-combobox`. Its reading direction, language, theme and custom properties are
   * taken from the combobox when it opens. Custom `empty` and `loading` slots are not supported when
   * `body` is used; the default empty and loading content is shown instead.
   * @default 'host'
   */
  @Prop() dropdownMount: 'host' | 'body' = 'host';

  /**
   * Accessible prefix for the row that returns to the group list when `group-display` is
   * `drill-in`, read before the open group's label. Pass a translated string to localize it; defaults to English.
   * @defaultValue 'Back'
   */
  @Prop() drillInBackLabel = 'Back';

  /**
   * Text shown when no options match the search. Pass a translated string to localize it; defaults to English.
   * @defaultValue 'No options found'
   */
  @Prop() noOptionsFoundLabel = 'No options found';

  /**
   * Maximum width of a group's flyout when `group-display` is `flyout`. Any valid CSS width value.
   * @default '380px'
   */
  @Prop() flyoutMaxWidth: string = '380px';

  /**
   * Minimum width of a group's flyout when `group-display` is `flyout`. Any valid CSS width value.
   * The flyout is as wide as its options, between this and `flyout-max-width`.
   * @default '280px'
   */
  @Prop() flyoutMinWidth: string = '280px';

  /**
   * How option groups (`<optgroup>`, or the `group` field of `options`) are shown in the dropdown.
   * `inline` lists each group's label above its options. `flyout` lists the groups, and opens a
   * group's options in a panel beside it on hover or click; while searching, the matching options
   * are listed under their group labels, and search also matches group labels. `flyout` groups
   * by `<optgroup>` (or `group`) only: options under a `<pds-text>` heading are listed ungrouped.
   * `drill-in` lists the groups too, but a click replaces the list with that group's options and a
   * row back to the groups; use it where nothing can open beside the dropdown, such as a side
   * panel. `flyout` falls back to `drill-in` when there is no room for a flyout on either side.
   * @default 'inline'
   */
  @Prop() groupDisplay: 'inline' | 'flyout' | 'drill-in' = 'inline';

  /**
   * Helper message to display below the combobox.
   */
  @Prop() helperMessage?: string;

  /**
   * Visually hides the label text for instances where only the combobox should be displayed.
   * The visible `<label>` is omitted (same pattern as `pds-select`) so label spacing does not reserve layout;
   * the trigger uses `aria-label` so the name stays available to assistive technology.
   */
  @Prop() hideLabel: boolean = false;

  /**
   * If true, the combobox is in an invalid state.
   */
  @Prop() invalid?: boolean;

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
   * In filter mode, reopening the menu while the input still shows the label of the selected option temporarily lists
   * all options until you type (so you can switch to a different choice without clearing the field first).
   * @default 'filter'
   */
  @Prop() mode: 'filter' | 'select-only' = 'filter';

  /**
   * Shows a search field at the top of the dropdown for the `button` and `chip` triggers, which
   * can't be typed into. Search filters the options the same way typing in the `input` trigger
   * does; in a grouped display it also matches group labels.
   * @default false
   */
  @Prop() panelSearch: boolean = false;

  /**
   * Placeholder text for the input field.
   */
  @Prop() placeholder?: string;

  /**
   * Accessible label for the search input inside the dropdown panel (`panel-search`). Pass a translated string to localize it; defaults to English.
   * @defaultValue 'Search options'
   */
  @Prop() searchOptionsLabel = 'Search options';

  /**
   * Placeholder text for the search input inside the dropdown panel (`panel-search`). Pass a translated string to localize it; defaults to English.
   * @defaultValue 'Find...'
   */
  @Prop() searchPlaceholder = 'Find...';

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
   * The shape of the button trigger. Use 'input' to render the trigger with input-like styling
   * (subtle border radius, input height) for use in form or filter rows alongside PdsSelect and PdsMultiselect.
   * @default 'pill'
   */
  @Prop() triggerShape: 'pill' | 'input' = 'pill';

  /**
   * Determines whether the button trigger's label and the option labels should truncate and display with an ellipsis.
   * When a label overflows, a `title` showing the full label will appear on hover.
   * @defaultValue false
   */
  @Prop() truncate = false;

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
  @Prop() debounce: number = 300;

  /**
   * Timeout in milliseconds for async fetch requests.
   */
  @Prop() fetchTimeout: number = 30000;

  /**
   * Whether the component is currently loading async options.
   */
  @Prop({ mutable: true }) loading: boolean = false;

  /**
   * Options provided externally (for consumer-managed async).
   */
  @Prop() options?: ComboboxOption[];

  /**
   * Function to format async results. Receives raw API response item.
   */
  @Prop() formatResult?: (item: unknown) => ComboboxOption;

  /**
   * Emitted when the value changes.
   */
  @Event() pdsComboboxChange!: EventEmitter<{ value: string }>;

  /**
   * Emitted on search input (for consumer-managed async).
   */
  @Event() pdsComboboxSearch!: EventEmitter<ComboboxSearchEventDetail>;

  /**
   * Emitted to request more options (pagination).
   */
  @Event() pdsComboboxLoadOptions!: EventEmitter<ComboboxLoadOptionsEventDetail>;

  /**
   * Internal state for the display text shown in the input/trigger
   */
  @State() displayText: string = '';

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
   * The optgroup whose flyout is open, when `groupDisplay` is `flyout`.
   */
  @State() openGroup: HTMLOptGroupElement | null = null;

  /**
   * Which way drill-in just moved, so the list slides that way: `in` to a group, `out` back to the
   * groups. Cleared once the slide ends, so later renders don't animate.
   */
  @State() drillDirection: 'in' | 'out' | null = null;

  /**
   * The group row highlighted in the grouped panel. It counts only while no option is
   * highlighted (`highlightedIndex` is -1); see `highlightedGroupRow`.
   */
  @State() highlightedGroup: HTMLOptGroupElement | null = null;

  /** The keys, not the pointer, moved the highlight last; the focus ring shows only then. */
  @State() keyboardNavigating: boolean = false;

  /**
   * A drill-in group row the first arrow showed rather than moved past. `aria-activedescendant`
   * already pointed at it, so the status region says it instead.
   */
  @State() revealedGroupLabel: string | null = null;

  /**
   * The pointer in the panel can hover: a mouse or pen, not touch. Touch browsers keep a tapped row
   * hovered, so group rows shade on `:hover` only for a pointer that can hover. Checked on the
   * pointer itself rather than `(hover: hover)`, which a touch-first device with a trackpad fails.
   */
  @State() pointerCanHover: boolean = true;

  /**
   * What's typed in the dropdown's own search field (`panelSearch`).
   */
  @State() panelQuery: string = '';

  /**
   * `groupDisplay` is `flyout` but there's no room beside the dropdown, so groups drill in instead.
   */
  @State() flyoutFallback: boolean = false;

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

  /**
   * Internal state for async options.
   */
  @State() internalOptions: ComboboxOption[] = [];

  /**
   * Internal state for current page (pagination).
   */
  @State() currentPage: number = 1;

  /**
   * Internal state for hasMore (pagination).
   */
  @State() hasMore: boolean = false;

  private inputEl?: HTMLInputElement;
  private optionEls: HTMLOptionElement[] = [];
  private allItems: (HTMLOptionElement | HTMLOptGroupElement | HTMLPdsTextElement)[] = [];
  private triggerEl?: HTMLElement;
  private listboxEl?: HTMLElement;
  private portalEl: HTMLElement | null = null;
  /** The portal's shadow root, which holds the dropdown and a copy of the combobox's styles. */
  private portalRoot: ShadowRoot | null = null;
  private cleanupPositionAutoUpdate?: () => void;
  private bodyPortalAutoUpdateActive = false;
  /** Deferred so portal teardown runs after Stencil reconciles `isOpen === false`. */
  private deferredPortalTeardownId?: ReturnType<typeof setTimeout>;
  private internals?: ElementInternals;
  private isUpdatingFromSelection: boolean = false;
  private abortController?: AbortController;
  private fetchDebounceTimer?: number;
  private fetchTimeoutTimer?: number;
  private observer?: MutationObserver;
  private originalSearchEmitter?: EventEmitter<ComboboxSearchEventDetail>;
  private flyout = new FlyoutController<HTMLOptGroupElement>(
    () => this.openGroup,
    group => {
      this.openGroup = group;
    },
  );
  /** The groups in the flyout panel's last render, so a row's index finds its optgroup. */
  private renderedGroups: PanelGroup[] = [];

  /**
   * Where each ungrouped option and optgroup built from the `options` prop came in the data, so
   * the flyout and drill-in panels draw them in that order. Slotted markup is already in order.
   */
  private panelPositions = new WeakMap<Element, number>();
  private panelSearchEl?: HTMLInputElement;
  /** With panel search, the options' list, which takes focus while a group is drilled into. */
  private panelTreeEl?: HTMLElement;
  /** What panel search last focused this open: the search field, or the list while drilled in. */
  private panelFocusEl?: HTMLElement;
  /** Room for a flyout was checked for this open. */
  private flyoutRoomChecked = false;
  /** The highlighted option sits in a flyout that hasn't rendered yet; focus it after the next render. */
  private pendingOptionFocus = false;
  /** Group rows' DOM ids, stable across renders so `aria-activedescendant` can point at a row. */
  private groupIds = new WeakMap<HTMLOptGroupElement, string>();
  private groupIdCount = 0;

  /**
   * In filter mode, after choosing an option the input still shows the label and would
   * otherwise filter the list to matching substrings only. While this flag is true,
   * the list shows every option until the user types (then normal filtering applies).
   */
  private expandFilterListWhileOpen = false;

  connectedCallback() {
    // Initialize ElementInternals for form association (only once per element instance)
    if (this.el.attachInternals && !this.internals) {
      this.internals = this.el.attachInternals();
    }
  }

  /**
   * Form Associated Custom Elements API: Called when the form is disabled
   */
  formDisabledCallback(disabled: boolean) {
    // Also fires when this element's own `disabled` attribute is merely present, even as the
    // literal string "false" (a consumer's or React's attribute serialization can write that) —
    // the platform treats any value as disabled, independent of fieldset state. A real disabled
    // fieldset ancestor confirms this is genuinely that, not this element's own attribute.
    if (disabled && !this.el.closest('fieldset[disabled]')) return;
    this.disabled = disabled;
  }

  componentWillLoad() {
    this.originalSearchEmitter = this.pdsComboboxSearch;
    this.updateOptions();
  }

  componentDidLoad() {
    this.setupDebounce();

    // Check for value-based preselection if no option is selected yet
    if (!this.selectedOption && this.value && this.optionEls.length > 0) {
      const matchingOption = this.optionEls.find(opt => opt.value === this.value);
      if (matchingOption) {
        this.setSelectedOption(matchingOption);
        // Update the display text to show the option's text content
        this.displayText = this.getOptionLabel(matchingOption);
        // Keep this.value as the actual option value
        // this.value remains unchanged (already matches matchingOption.value)
      }
    }

    // Initialize form value with current value
    this.updateFormValue(this.selectedOption?.value ?? this.value ?? '');
  }

  disconnectedCallback() {
    if (this.deferredPortalTeardownId !== undefined) {
      clearTimeout(this.deferredPortalTeardownId);
      this.deferredPortalTeardownId = undefined;
    }
    this.observer?.disconnect();
    cancelDebouncedEvent(this.pdsComboboxSearch);
    this.clearAsyncFetchState();
    this.removeBodyPortal();
    this.flyout.reset();
  }

  componentDidRender() {
    if (this.usesBodyPortal && this.isOpen) {
      this.syncBodyPortal();
    }

    const row = this.listboxEl?.querySelector('.pds-combobox__group-row--open') as HTMLElement | null | undefined;
    const flyoutEl = row?.querySelector('.pds-combobox__flyout') as HTMLElement | null | undefined;
    if (this.isOpen && this.listboxEl && row && flyoutEl) {
      this.flyout.position(row, this.listboxEl, flyoutEl);
    } else {
      this.flyout.stopPositioning();
    }

    // The row back is sticky over the group's options; scrolling an option into view stops below
    // it. Set before any scroll below, and when it first applies, scroll the highlighted option
    // again: the list keeps its offset on drilling in, and an earlier scroll had no padding.
    if (this.panelTreeEl) {
      const header = this.hidesPanelSearch ? (this.panelTreeEl.querySelector('.pds-combobox__group-back-trigger') as HTMLElement | null) : null;
      const padding = header ? `${header.offsetHeight}px` : '';
      if (this.panelTreeEl.style.scrollPaddingBlockStart !== padding) {
        this.panelTreeEl.style.scrollPaddingBlockStart = padding;
        if (padding !== '' && this.highlightedIndex >= 0) this.pendingOptionFocus = true;
      }
    }

    if (this.pendingOptionFocus) {
      this.pendingOptionFocus = false;
      this.updateOptionFocus();
    }

    // Panel search keeps focus in the search field, or in the list while a group hides the field.
    const panelFocusEl = this.hidesPanelSearch ? this.panelTreeEl : this.panelSearchEl;
    if (this.isOpen && this.usesPanelSearch && panelFocusEl && panelFocusEl !== this.panelFocusEl) {
      this.focusPanel(panelFocusEl);
    }
  }

  // A `title` only while the text is cut, measured on hover. On the span, not the option or trigger,
  // so it isn't read again as their description.
  private syncTitle(el: HTMLElement, selector: string) {
    const text = el.querySelector<HTMLElement>(selector);
    if (!text) return;
    if (text.scrollWidth > text.clientWidth) {
      text.title = text.textContent || '';
    } else {
      text.removeAttribute('title');
    }
  }

  /**
   * Scrolls just enough to show `el`, as `scrollIntoView({ block: 'nearest' })` does. In the drill-in
   * panel it scrolls the list alone, and never sideways: while a drill-in slide offsets a row past
   * the list's edge, `scrollIntoView` also scrolls the list horizontally to reach it, which eats most
   * of the slide. There it keeps clear of the sticky row back, through the scroll padding set for it,
   * but doesn't scroll the page or a scrolling ancestor.
   */
  private scrollIntoViewNearest(el: HTMLElement, smooth: boolean) {
    const behavior = smooth ? 'smooth' : 'auto';
    if (!this.showsGroupedPanel || this.effectiveGroupDisplay !== 'drill-in') {
      el.scrollIntoView({ block: 'nearest', behavior });
      return;
    }
    const list = this.usesPanelSearch ? this.panelTreeEl : this.listboxEl;
    if (!list) return;
    const offset = el.getBoundingClientRect().top - list.getBoundingClientRect().top - list.clientTop;
    // The padding keeps rows clear of the sticky row back; the row back itself doesn't need it.
    const padding = el.classList.contains('pds-combobox__group-back-trigger') ? 0 : parseFloat(list.style.scrollPaddingBlockStart) || 0;
    const top = list.scrollTop + offset - padding;
    const bottom = list.scrollTop + offset + el.offsetHeight - list.clientHeight;
    const target = top < list.scrollTop ? top : bottom > list.scrollTop ? bottom : null;
    if (target !== null) list.scrollTo({ top: target, behavior });
  }

  private focusPanel(el: HTMLElement) {
    this.panelFocusEl = el;
    // Before the dropdown is positioned it sits in the page's flow; don't scroll to it.
    el.focus({ preventScroll: true });
    // A search started by typing in the list carries its first character; type on after it.
    if (el === this.panelSearchEl && this.panelQuery !== '') {
      this.panelSearchEl.setSelectionRange?.(this.panelQuery.length, this.panelQuery.length);
    }
    this.updateAriaActiveDescendant();
  }

  /** Switching display mode leaves no flyout or hover timer from the last one. */
  @Watch('groupDisplay')
  protected groupDisplayChanged() {
    this.flyout.reset();
    this.openGroup = null;
    // The reset isn't a drill-out, so it doesn't slide either.
    this.drillDirection = null;
  }

  @Watch('openGroup')
  protected openGroupChanged(next: HTMLOptGroupElement | null, previous: HTMLOptGroupElement | null) {
    this.handPanelFocusToList();
    this.revealedGroupLabel = null;
    // Only moves between the drill-in panel's views slide; search results don't.
    if (!this.isOpen || this.effectiveGroupDisplay !== 'drill-in' || !this.showsGroupedPanel) return;
    if (next !== null && previous === null) this.drillDirection = 'in';
    else if (next === null && previous !== null) this.drillDirection = 'out';
  }

  /** A flyout with no room beside the dropdown drills in, which can hide the focused search field too. */
  @Watch('flyoutFallback')
  protected flyoutFallbackChanged() {
    this.handPanelFocusToList();
  }

  /**
   * Drilling into a group hides the search field, so focus moves to the list before the field
   * unmounts: focus lost with it would leave the combobox and close the dropdown.
   */
  private handPanelFocusToList() {
    if (this.isOpen && this.hidesPanelSearch && this.panelTreeEl) this.focusPanel(this.panelTreeEl);
  }

  private onPanelPointer = (event: PointerEvent) => {
    const canHover = event.pointerType !== 'touch';
    if (this.pointerCanHover !== canHover) this.pointerCanHover = canHover;
  };

  private onDrillAnimationEnd = (event: AnimationEvent) => {
    // Only the slide's own end: slotted consumer content can animate inside the list too.
    if (event.animationName === 'pds-combobox-drill') this.drillDirection = null;
  };

  @Watch('disabled')
  protected disabledChanged(disabled: boolean) {
    if (!disabled || !this.isOpen) return;
    const shadowActive = this.el.shadowRoot?.activeElement ?? null;
    const focusInDropdown =
      !!this.portalEl?.shadowRoot?.activeElement || (!!shadowActive && !!this.listboxEl?.contains(shadowActive));
    this.isOpen = false;
    this.highlightedIndex = -1;
    this.isArrowKeyNavigationMode = false;
    this.clearExpandFilterList();
    this.updateAriaActiveDescendant();
    // Closing removes the search field or option that held focus. A button or chip trigger can still
    // take it (aria-disabled), so focus doesn't fall to the page; a disabled input can't, as natively.
    if (focusInDropdown && this.trigger !== 'input') this.restoreFocusToTrigger();
  }

  @Watch('isOpen')
  protected isOpenChanged(isOpen: boolean) {
    if (!isOpen) {
      this.revealedGroupLabel = null;
      this.drillDirection = null;
      this.openGroup = null;
      this.highlightedGroup = null;
      this.keyboardNavigating = false;
      this.flyout.reset();
      if (this.panelQuery !== '') {
        // The field reopens empty, so tell consumers who filter `options` from this event.
        this.panelQuery = '';
        this.pdsComboboxSearch.emit({ query: '' });
      }
      // And with `async-url`, start loading the unsearched list now, so it's ready by the reopen.
      if (this.usesPanelSearch && this.asyncUrl && this.lastFetchedQuery !== '') {
        this.debouncedFetchAsyncOptions('', 1);
      }
      this.panelFocusEl = undefined;
      this.flyoutRoomChecked = false;
      this.flyoutFallback = false;
    }

    if (isOpen && this.deferredPortalTeardownId !== undefined) {
      clearTimeout(this.deferredPortalTeardownId);
      this.deferredPortalTeardownId = undefined;
    }

    if (isOpen && this.usesBodyPortal) {
      // Rapid reopen can cancel deferred teardown while the portal still holds the previous
      // listbox node; clear portal state before the next render attaches the new listbox, and
      // reset Floating UI autoUpdate bookkeeping.
      this.removeBodyPortal();
    }

    if (!isOpen && this.usesBodyPortal) {
      if (this.deferredPortalTeardownId !== undefined) {
        clearTimeout(this.deferredPortalTeardownId);
      }
      this.deferredPortalTeardownId = setTimeout(() => {
        this.deferredPortalTeardownId = undefined;
        if (!this.el.isConnected) {
          return;
        }
        if (!this.isOpen) {
          this.removeBodyPortal();
        }
      }, 0);
      return;
    }

    if (!isOpen) {
      this.removeBodyPortal();
    }
  }

  private get usesBodyPortal(): boolean {
    return this.dropdownMount === 'body';
  }

  private get labelId(): string {
    return `${this.componentId}-label`;
  }

  /** One check for "the `<label>` is rendered", so the label and the reference to it can't disagree. */
  private get hasVisibleLabel(): boolean {
    return Boolean(this.label) && !this.hideLabel;
  }

  /**
   * The button and chip triggers are `div`s, which `<label for>` can't name, so they point at the
   * visible label instead. With `hide-label` there is no visible label and `aria-label` names them.
   * With panel search the trigger is a button, which has no value, so its own text (the selection
   * or placeholder) joins the label in its name.
   */
  private get triggerLabelledBy(): string | undefined {
    if (!this.hasVisibleLabel) return undefined;
    return this.usesPanelSearch ? `${this.labelId} ${this.componentId}` : this.labelId;
  }

  /** The div triggers' `aria-label` when the label is hidden; with panel search it names the selection too. */
  private get triggerAriaLabel(): string | undefined {
    if (!this.hideLabel) return undefined;
    const shown = this.selectedLabel || this.placeholder;
    return this.usesPanelSearch && shown ? `${this.label}, ${shown}` : this.label;
  }

  /** `<label for>` only works on the input trigger; for a div trigger a click on the label focuses it. */
  private onLabelClick = () => {
    if (this.trigger !== 'input' && !this.disabled) {
      this.triggerEl?.focus();
    }
  };

  private get listboxId(): string {
    return `${this.componentId}-listbox`;
  }

  private optionDomId(optionIndex: number): string {
    return `${this.componentId}-option-${optionIndex}`;
  }

  private groupDomId(optgroup: HTMLOptGroupElement): string {
    let id = this.groupIds.get(optgroup);
    if (id === undefined) {
      id = `${this.componentId}-group-${this.groupIdCount++}`;
      this.groupIds.set(optgroup, id);
    }
    return id;
  }

  @Watch('debounce')
  protected setupDebounce() {
    const { pdsComboboxSearch, debounce, originalSearchEmitter } = this;
    this.pdsComboboxSearch = debounce === undefined
      ? originalSearchEmitter ?? pdsComboboxSearch
      : debounceEvent(pdsComboboxSearch, debounce);
    // After the swap, so an emit made while flushing goes to the new emitter, not the old one.
    flushDebouncedEvent(pdsComboboxSearch);
  }

  @Watch('options')
  protected optionsChanged() {
    if (this.options) {
      this.internalOptions = [...this.options];
      this.updateOptionsFromAsync();
    }
  }

  @Watch('value')
  handleValueChange() {
    this.filterOptions();
    // Sync with form internals for form association
    this.updateFormValue(this.value);

    // Find and select option that matches the value (for external value changes)
    // Only do this if we're not already updating from a selection
    if (!this.isUpdatingFromSelection && this.value && this.optionEls.length > 0) {
      const currentSelectedValue = this.selectedOption ? this.selectedOption.value : null;

      // If the value doesn't match the currently selected option's value, we need to update
      if (this.value !== currentSelectedValue) {
        const matchingOption = this.optionEls.find(opt => opt.value === this.value);
        if (matchingOption) {
          this.isUpdatingFromSelection = true;
          this.setSelectedOption(matchingOption);
          // Update the display text to show the option's text content
          this.displayText = this.getOptionLabel(matchingOption);
          // Keep this.value as the actual option value (already correct)
          this.isUpdatingFromSelection = false;
        }
      }
    }
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

    // Update display text when selected option changes
    if (this.selectedOption) {
      this.displayText = this.getOptionLabel(this.selectedOption);
      this.value = this.selectedOption.value;
      // Update form internals with the actual option value
      this.updateFormValue(this.selectedOption.value);
    } else {
      this.displayText = '';
      this.value = '';
      this.updateFormValue('');
    }
  }

  private updateFormValue(value: string) {
    if (isSpecTest()) return;

    if (this.internals && this.internals.setFormValue) {
      this.internals.setFormValue(value);
    }
  }

  private clearAsyncFetchState() {
    if (this.fetchDebounceTimer !== undefined) {
      window.clearTimeout(this.fetchDebounceTimer);
      this.fetchDebounceTimer = undefined;
    }
    if (this.fetchTimeoutTimer !== undefined) {
      window.clearTimeout(this.fetchTimeoutTimer);
      this.fetchTimeoutTimer = undefined;
    }
    this.abortController?.abort();
    this.abortController = undefined;
  }

  /** The query behind the options loaded from `async-url`. */
  private lastFetchedQuery = '';

  private debouncedFetchAsyncOptions(query: string, page: number = 1) {
    if (!this.asyncUrl) return;

    if (this.fetchDebounceTimer !== undefined) {
      window.clearTimeout(this.fetchDebounceTimer);
    }

    const delay = Math.max(0, this.debounce ?? 0);
    this.fetchDebounceTimer = window.setTimeout(() => {
      this.fetchDebounceTimer = undefined;
      this.fetchOptions(query, page);
    }, delay);
  }

  private async fetchOptions(query: string, page: number = 1) {
    if (!this.asyncUrl) return;

    // Abort any pending request and clear existing timeout
    this.abortController?.abort();
    if (this.fetchTimeoutTimer !== undefined) {
      window.clearTimeout(this.fetchTimeoutTimer);
      this.fetchTimeoutTimer = undefined;
    }

    this.abortController = new AbortController();
    this.loading = true;

    // Set up timeout for fetch request
    this.fetchTimeoutTimer = window.setTimeout(() => {
      this.abortController?.abort();
      this.fetchTimeoutTimer = undefined;
    }, this.fetchTimeout);

    try {
      // Guard against malformed asyncUrl
      let url: URL;
      try {
        url = new URL(this.asyncUrl, window.location.origin);
      } catch (urlError) {
        throw new TypeError(`Invalid asyncUrl: ${this.asyncUrl}`);
      }

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

      // Clear timeout on successful response
      if (this.fetchTimeoutTimer !== undefined) {
        window.clearTimeout(this.fetchTimeoutTimer);
        this.fetchTimeoutTimer = undefined;
      }

      if (!response.ok) throw new Error('Failed to fetch options');

      const data: AsyncResponse = await response.json();

      const formattedResults = data.results.map(item => {
        // If formatResult is provided, use it
        if (this.formatResult) {
          return this.formatResult(item);
        }

        // Defensive check: ensure item is an object before spreading
        if (typeof item === 'object' && item !== null) {
          return {
            id: item.id,
            text: item.text,
            ...item,
          } as ComboboxOption;
        }

        // Handle primitives by converting to safe shape
        return {
          id: String(item),
          text: String(item),
        } as ComboboxOption;
      });

      if (page === 1) {
        this.internalOptions = formattedResults;
        // Only once its results have loaded: a failed or aborted fetch leaves the last query's.
        this.lastFetchedQuery = query;
      } else {
        this.internalOptions = [...this.internalOptions, ...formattedResults];
      }

      this.hasMore = data.totalCount ? this.internalOptions.length < data.totalCount : false;
      this.currentPage = page;

      // Update DOM options from async data
      this.updateOptionsFromAsync();

    } catch (error) {
      // Clear timeout on error
      if (this.fetchTimeoutTimer !== undefined) {
        window.clearTimeout(this.fetchTimeoutTimer);
        this.fetchTimeoutTimer = undefined;
      }

      if ((error as Error).name !== 'AbortError') {
        console.error('PdsCombobox: Failed to fetch options', error);
      }
    } finally {
      this.loading = false;
    }
  }

  private updateOptionsFromAsync() {
    if (!this.asyncUrl && !this.options) return;

    // Clear existing slot-based options when using async
    this.optionEls = [];
    this.allItems = [];

    // Create option elements from async data. Grouped options are nested in an optgroup, as
    // slotted markup would be, so grouping, filtering and labels work the same either way. Each
    // group is listed where it first appears with all of its options, even when the data
    // interleaves groups, so an option never renders under another group's label. Ungrouped
    // options come first, so none reads as part of the group above it. The flyout and drill-in
    // panels draw groups as rows, where that can't happen, so they keep the data's order instead.
    const asyncOptions = this.options || this.internalOptions;
    const groups = new Map<string, HTMLOptGroupElement>();
    const ungrouped: HTMLOptionElement[] = [];
    const groupEntries: HTMLOptGroupElement[] = [];
    this.panelPositions = new WeakMap();
    asyncOptions.forEach((opt, position) => {
      const optionEl = document.createElement('option') as HTMLOptionElement;
      optionEl.value = String(opt.id);
      optionEl.textContent = opt.text;
      if (opt.disabled === true) optionEl.setAttribute('disabled', '');
      // Only strings group an option or name an icon; anything else from JS is ignored, not coerced.
      if (typeof opt.icon === 'string' && opt.icon !== '') optionEl.setAttribute('data-icon', opt.icon);

      if (typeof opt.group !== 'string' || opt.group === '') {
        ungrouped.push(optionEl);
        this.panelPositions.set(optionEl, position);
        return;
      }

      let optgroup = groups.get(opt.group);
      if (!optgroup) {
        optgroup = document.createElement('optgroup');
        optgroup.label = opt.group;
        groups.set(opt.group, optgroup);
        groupEntries.push(optgroup);
        this.panelPositions.set(optgroup, position);
      }
      if (!optgroup.hasAttribute('data-icon') && typeof opt.groupIcon === 'string' && opt.groupIcon !== '') {
        optgroup.setAttribute('data-icon', opt.groupIcon);
      }
      optgroup.appendChild(optionEl);
    });

    [...ungrouped, ...groupEntries].forEach(entry => {
      if (entry.tagName === 'OPTGROUP') {
        this.allItems.push(entry);
        Array.from(entry.children).forEach(child => {
          this.optionEls.push(child as HTMLOptionElement);
          this.allItems.push(child as HTMLOptionElement);
        });
      } else {
        this.optionEls.push(entry as HTMLOptionElement);
        this.allItems.push(entry);
      }
    });

    // A rebuild replaces every optgroup. Follow the open group to its new element by label, so the
    // flyout stays open across reloads and pagination, or close it if the group is gone. The hover
    // timers still hold the old element, so they're cleared either way. filterOptions, below,
    // resets the highlight.
    if (this.openGroup !== null && !groupEntries.includes(this.openGroup)) {
      this.flyout.reset();
      this.openGroup = groups.get(this.openGroup.label) ?? null;
    }

    // Re-apply the selection to the rebuilt options: when `value` is set before async options have
    // loaded, and after any rebuild, which detaches the previously selected option element.
    if (this.value && (!this.selectedOption || !this.optionEls.includes(this.selectedOption))) {
      const matchingOption = this.optionEls.find(opt => opt.value === this.value);
      if (matchingOption) {
        // Relinking a selection keeps the same value, so it keeps any text being typed too, which
        // the selectedOption watcher would otherwise reset to the label.
        const typed = this.selectedOption ? this.displayText : undefined;
        this.setSelectedOption(matchingOption);
        if (typed !== undefined) this.displayText = typed;
      }
    }

    this.filterOptions();
  }

  private updateOptions() {
    // Skip slot-based options if using async
    if (this.asyncUrl || this.options) {
      this.updateOptionsFromAsync();
      return;
    }

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

      // Set initial selected option based on value property
      let initialSelected: HTMLOptionElement | null = null;

      // Check if value property matches any option
      if (this.value) {
        initialSelected = this.optionEls.find(opt => opt.value === this.value) || null;
        if (initialSelected) {
          // Update the display text to show the option's text content
          this.displayText = this.getOptionLabel(initialSelected);
          // Keep this.value as the actual option value (already correct)
        }
      }

      // For chip triggers, ensure we always have a selected option
      const firstEnabled = this.optionEls.find(opt => !isOptionDisabled(opt));
      if (initialSelected === null && this.trigger === 'chip' && firstEnabled !== undefined) {
        initialSelected = firstEnabled;
        this.value = initialSelected.value;
        this.displayText = this.getOptionLabel(initialSelected);
        console.warn('PDS Combobox: Chip triggers should always have a selected option. Automatically selected the first enabled option.');
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
    // A new list replaces the rows a slide was animating, so its end event may never come.
    this.drillDirection = null;
    // Ensure allItems includes optionEls if not already populated (for edge cases)
    if (this.allItems.length === 0 && this.optionEls.length > 0) {
      this.allItems = [...this.optionEls];
    }

    const searchesPanel = this.usesPanelSearch;
    if ((this.mode === 'select-only' && !searchesPanel) || this.expandFilterListWhileOpen || (searchesPanel && this.panelQuery === '')) {
      this.filteredItems = [...this.allItems];
    } else {
      const val = (searchesPanel ? this.panelQuery : this.displayText).toLowerCase();
      const filteredOptions = this.optionEls.filter(option => {
        // Outside inline mode a group's label is part of what search matches, so "tag" finds
        // every option in the Tag group.
        if (this.groupDisplay !== 'inline') {
          const groupLabel = groupLabelOf(option);
          if (groupLabel !== null && groupLabel.toLowerCase().includes(val)) return true;
        }
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
    this.highlightedGroup = null;
  }

  private clearExpandFilterList() {
    this.expandFilterListWhileOpen = false;
  }

  /**
   * When reopening the dropdown in filter mode with the input still showing the
   * committed selection label, show the full option list until the user edits the query.
   */
  private prepareExpandFilterListOnOpen() {
    if (
      this.mode === 'filter' &&
      this.selectedOption &&
      this.displayText === this.getOptionLabel(this.selectedOption)
    ) {
      this.expandFilterListWhileOpen = true;
    } else {
      this.expandFilterListWhileOpen = false;
    }
  }

  private positionDropdown() {
    if (!this.triggerEl || !this.listboxEl) {
      return;
    }

    const strategy = this.usesBodyPortal ? 'fixed' : 'absolute';
    const zIndex = this.usesBodyPortal
      ? 'var(--pine-z-index-priority)'
      : 'var(--pine-z-index-raised)';

    this.listboxEl.style.width = this.dropdownWidth;

    if (this.maxHeight) {
      this.listboxEl.style.maxHeight = this.maxHeight;
      // With panel search, the options list scrolls under a fixed search field.
      this.listboxEl.style.overflowY = this.usesPanelSearch ? 'hidden' : 'auto';
    }

    this.listboxEl.offsetHeight;

    return computePosition(this.triggerEl, this.listboxEl, {
      placement: this.dropdownPlacement,
      strategy,
      middleware: [offset(12), flip(), shift({ padding: 5 })],
    }).then(({ x, y }) => {
      if (!this.listboxEl) {
        return;
      }

      Object.assign(this.listboxEl.style, {
        left: `${x}px`,
        top: `${y}px`,
        position: strategy,
        zIndex,
      });
      this.checkFlyoutRoom();
    });
  }

  /**
   * Once per open, after the dropdown is placed: with no room for a flyout on either side of it,
   * `flyout` drills in instead. `flyout-min-width` is resolved through CSS, so any length works.
   */
  private checkFlyoutRoom() {
    if (!this.isOpen || this.groupDisplay !== 'flyout' || this.flyoutRoomChecked || !this.listboxEl) return;
    this.flyoutRoomChecked = true;

    const probe = document.createElement('div');
    // Fixed, like the flyout, so a percentage resolves against the viewport as the flyout's does.
    probe.style.cssText = 'position:fixed;visibility:hidden;width:0;';
    probe.style.minWidth = this.flyoutMinWidth;
    this.listboxEl.appendChild(probe);
    const needed = parseFloat(getComputedStyle(probe).minWidth);
    probe.remove();

    const rect = this.listboxEl.getBoundingClientRect();
    const room = Math.max(window.innerWidth - rect.right, rect.left);
    const fallback = Number.isFinite(needed) && needed > 0 && rect.width > 0 && room < needed;
    if (fallback !== this.flyoutFallback) this.flyoutFallback = fallback;
  }

  private openDropdownPositioning() {
    if (!this.triggerEl || !this.listboxEl) {
      return;
    }

    void this.positionDropdown();
  }

  private startBodyPortalAutoUpdate() {
    if (this.bodyPortalAutoUpdateActive || !this.triggerEl || !this.listboxEl) {
      return;
    }

    this.cleanupPositionAutoUpdate = autoUpdate(this.triggerEl, this.listboxEl, () => {
      void this.positionDropdown();
    });
    this.bodyPortalAutoUpdateActive = true;
  }

  private stopBodyPortalAutoUpdate() {
    this.cleanupPositionAutoUpdate?.();
    this.cleanupPositionAutoUpdate = undefined;
    this.bodyPortalAutoUpdateActive = false;
  }

  private getPortalMountRoot(): HTMLElement {
    return this.findNearestDialogForPortal(this.el) ?? document.body;
  }

  /**
   * Resolves the native `<dialog>` to host the portaled listbox so it stays in the same top layer
   * as `showModal()`. `Element.closest('dialog')` stops at shadow boundaries and can miss a
   * dialog that only wraps slotted content; this walks assigned slots and shadow hosts, and
   * falls back to `pds-modal`'s dialog when the combobox lives inside that subtree.
   */
  private findNearestDialogForPortal(from: HTMLElement): HTMLDialogElement | null {
    const seen = new Set<Node>();
    let current: Node | null = from;

    while (current && !seen.has(current)) {
      seen.add(current);

      if (current.nodeType === Node.ELEMENT_NODE && (current as Element).localName === 'dialog') {
        return current as HTMLDialogElement;
      }

      if (current.nodeType === Node.ELEMENT_NODE) {
        const assigned = (current as HTMLElement).assignedSlot;
        if (assigned) {
          current = assigned;
          continue;
        }
      }

      const parent = current.parentNode;
      if (parent) {
        current = parent instanceof ShadowRoot ? parent.host : parent;
        continue;
      }

      break;
    }

    const pineModal = from.closest('pds-modal');
    if (pineModal) {
      const pineDialog = pineModal.querySelector('dialog');
      if (pineDialog) {
        return pineDialog as HTMLDialogElement;
      }
    }

    return null;
  }

  private ensureBodyPortal(): HTMLElement {
    if (this.portalEl !== null) {
      const target = this.getPortalMountRoot();
      if (this.portalEl.parentElement !== target) {
        target.appendChild(this.portalEl);
        // What differs from the new parent may not be what differed from the old one.
        this.copyPortalContext();
      }
      return this.portalEl;
    }

    this.portalEl = document.createElement('div');
    this.portalEl.className = 'pds-combobox-dropdown-portal';
    // The copied stylesheet's `:host` rules match this div too; keep it out of layout. It still
    // passes `dir` and the theme down.
    this.portalEl.style.display = 'contents';
    this.portalRoot = this.portalEl.attachShadow({ mode: 'open' });
    this.getPortalMountRoot().appendChild(this.portalEl);
    this.copyPortalContext();
    return this.portalEl;
  }

  /**
   * Gives the portal what the dropdown would otherwise get inside the combobox: its styles (so it
   * needs no global CSS), the reading direction and language, a theme set on an ancestor, and
   * custom properties set between the combobox and where the portal mounts. A snapshot: the portal
   * is rebuilt on every open, so a theme switched while it's open applies from the next open.
   */
  private copyPortalContext() {
    const portal = this.portalEl;
    const root = this.portalRoot;
    const source = this.el.shadowRoot;
    if (!portal || !root) return;

    if (source?.adoptedStyleSheets?.length) {
      root.adoptedStyleSheets = source.adoptedStyleSheets;
    } else if (source && !root.querySelector('style')) {
      source.querySelectorAll('style').forEach(style => root.appendChild(style.cloneNode(true)));
    }

    const computed = getComputedStyle(this.el);
    portal.dir = computed.direction || 'ltr';
    const lang = closest('[lang]', this.el)?.getAttribute('lang');
    if (lang) portal.lang = lang;
    const theme = closest('[data-theme]', this.el)?.getAttribute('data-theme');
    if (theme) portal.setAttribute('data-theme', theme);

    const outside = portal.parentElement ? getComputedStyle(portal.parentElement) : null;
    for (let i = 0; i < computed.length; i++) {
      const property = computed[i];
      if (!property.startsWith('--')) continue;
      const value = computed.getPropertyValue(property);
      if (outside && value === outside.getPropertyValue(property)) continue;
      portal.style.setProperty(property, value.trim());
    }
  }

  private syncBodyPortal() {
    if (!this.listboxEl) {
      return;
    }

    this.ensureBodyPortal();
    const root = this.portalRoot!;
    for (const stale of Array.from(root.children)) {
      if (stale !== this.listboxEl && stale.tagName !== 'STYLE') {
        stale.remove();
      }
    }

    if (this.listboxEl.parentNode !== root) {
      root.appendChild(this.listboxEl);
      void this.positionDropdown();
      this.startBodyPortalAutoUpdate();
    }
  }

  private removeBodyPortal() {
    this.stopBodyPortalAutoUpdate();

    if (this.portalEl?.parentNode) {
      this.portalEl.parentNode.removeChild(this.portalEl);
    }

    this.portalEl = null;
    this.portalRoot = null;

    if (this.listboxEl && !this.listboxEl.isConnected) {
      this.listboxEl = undefined;
    }
  }

  private handleInput = (e: Event) => {
    const target = e.target as HTMLInputElement;
    this.clearExpandFilterList();
    this.displayText = target.value;
    this.isOpen = true;
    this.filterOptions();

    // Emit search event for consumer-managed async
    this.pdsComboboxSearch.emit({ query: this.displayText });

    // Fetch from async URL if configured
    if (this.asyncUrl) {
      this.debouncedFetchAsyncOptions(this.displayText, 1);
    }

    setTimeout(() => this.openDropdownPositioning(), 0);
  };

  private handleInputClick = () => {
    // Open dropdown when input is clicked (but not when tabbed into)
    if (!this.isOpen) {
      this.isOpen = true;
      this.prepareExpandFilterListOnOpen();
      this.filterOptions();

      // Trigger initial fetch if async and no options loaded yet
      if (this.asyncUrl && this.internalOptions.length === 0) {
        this.debouncedFetchAsyncOptions(this.displayText, 1);
      }

      this.setInitialHighlightedIndex();
      setTimeout(() => {
        this.openDropdownPositioning();
        if (this.trigger === 'input' && this.expandFilterListWhileOpen && this.inputEl) {
          this.inputEl.select();
        }
      }, 0);
    }
  };

  private handleKeyDown = (e: KeyboardEvent) => {
    if (!this.isOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp' || (e.altKey && e.key === 'ArrowDown'))) {
      e.preventDefault();
      this.keyboardNavigating = true;
      this.isOpen = true;
      this.prepareExpandFilterListOnOpen();
      this.filterOptions();
      // Set highlighted index immediately for testing
      this.setInitialHighlightedIndex();
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

    if (this.handleGroupedPanelKey(e)) return;
    // The input trigger's text keeps Space, Home and End while the grouped panel shows.
    if (this.showsGroupedPanel && this.trigger === 'input' && (e.key === ' ' || e.key === 'Home' || e.key === 'End')) return;

    // Get only the option elements (skip group labels) for navigation
    const selectableOptions = this.filteredItems.filter(item => item.tagName === 'OPTION') as HTMLOptionElement[];

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        // If no option is highlighted, start at the first
        this.highlightOptionAt(selectableOptions, this.highlightedIndex < 0 ? 0 : this.highlightedIndex + 1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        // If no option is highlighted, start at the last
        this.highlightOptionAt(selectableOptions, this.highlightedIndex < 0 ? selectableOptions.length - 1 : this.highlightedIndex - 1);
        break;
      case 'Home':
        e.preventDefault();
        this.highlightOptionAt(selectableOptions, 0);
        break;
      case 'End':
        e.preventDefault();
        this.highlightOptionAt(selectableOptions, selectableOptions.length - 1);
        break;
      case 'PageDown':
        e.preventDefault();
        this.highlightOptionAt(selectableOptions, this.highlightedIndex + 10);
        break;
      case 'PageUp':
        e.preventDefault();
        this.highlightOptionAt(selectableOptions, this.highlightedIndex - 10);
        break;
      case 'Enter':
      case ' ': {
        e.preventDefault();
        // An option in a flyout the pointer has since closed isn't on screen; don't choose it.
        if (this.showsGroupedPanel && this.activeDescendantId === undefined) break;
        const option = selectableOptions[this.highlightedIndex];
        if (option !== undefined && !isOptionDisabled(option)) {
          this.handleOptionClick(option);
          this.restoreFocusToTrigger();
        }
        break;
      }
      case 'Escape':
        e.preventDefault();
        this.isOpen = false;
        this.highlightedIndex = -1;
        this.clearExpandFilterList();
        this.isArrowKeyNavigationMode = false; // Reset arrow-key navigation mode
        this.restoreFocusToTrigger();
        break;
      case 'Tab':
        // Allow normal tab behavior to close dropdown and move focus
        this.isOpen = false;
        this.highlightedIndex = -1;
        this.clearExpandFilterList();
        this.isArrowKeyNavigationMode = false; // Reset arrow-key navigation mode
        break;
    }
  };

  /**
   * The tree keys in the grouped panel. Up, Down, Home, End, PageUp and PageDown move within one
   * level; Right, Enter or Space opens a group at its first option; Left, or Escape, closes the
   * open group back to its row. Returns false for keys the listbox handling covers, such as
   * Enter on an option.
   */
  private handleGroupedPanelKey(e: KeyboardEvent): boolean {
    if (!this.showsGroupedPanel) return false;
    const highlightShown = this.keyboardNavigating;
    this.keyboardNavigating = true;
    // In the input trigger, Left and Right still move the caret through typed text, and Space,
    // Home and End edit it, as they do in the panel's search field.
    if (this.trigger === 'input') {
      if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') && this.displayText !== '') return false;
      if (e.key === ' ' || e.key === 'Home' || e.key === 'End') return false;
    }

    const entries = this.panelEntries();
    const drilledIn = this.effectiveGroupDisplay === 'drill-in' && this.openGroup !== null;
    const current = this.currentPanelItem();
    const column = panelColumn(entries, this.openGroup, current, drilledIn);
    if (column.length === 0) return false;
    const position = current === null ? -1 : column.indexOf(current);
    // Drill-in doesn't shade a group row the pointer or a click-open highlighted, so the first Up or
    // Down shows that row rather than moving past one the user never saw.
    const unseenRow = !highlightShown && this.effectiveGroupDisplay === 'drill-in' && current !== null && typeof current !== 'number' && current !== this.openGroup;

    const moveTo = (to: number) => {
      e.preventDefault();
      this.highlightPanelItem(column[Math.max(0, Math.min(column.length - 1, to))]);
      this.revealedGroupLabel = null;
      return true;
    };
    const reveal = () => {
      e.preventDefault();
      this.revealedGroupLabel = (current as HTMLOptGroupElement).label;
      return true;
    };

    switch (e.key) {
      case 'ArrowDown':
        return unseenRow ? reveal() : moveTo(position < 0 ? 0 : position + 1);
      case 'ArrowUp':
        return unseenRow ? reveal() : moveTo(position < 0 ? column.length - 1 : position - 1);
      case 'Home':
        return moveTo(0);
      case 'End':
        return moveTo(column.length - 1);
      case 'PageDown':
        return moveTo(position < 0 ? 0 : position + 10);
      case 'PageUp':
        return moveTo(position < 0 ? column.length - 1 : position - 10);
      case 'ArrowRight':
      case 'Enter':
      case ' ': {
        if (current === null || typeof current === 'number') return false;
        e.preventDefault();
        if (!drilledIn || current !== this.openGroup) {
          this.expandGroup(entries, current);
        } else if (e.key === 'ArrowRight') {
          // On the row back of a drilled-in group: down into its options.
          if (column.length > 1) this.highlightPanelItem(column[1]);
        } else {
          this.leaveDrilledInGroup();
        }
        return true;
      }
      case 'ArrowLeft':
      case 'Escape': {
        // Escape with no group open closes the panel, through the listbox handling.
        if (this.openGroup === null) return false;
        e.preventDefault();
        this.collapseToGroup(this.openGroup);
        return true;
      }
    }
    return false;
  }

  /**
   * Where the keyboard is in the grouped panel. An option highlighted in a group that has since
   * closed (the pointer left its flyout) counts as its group's row, so the keys carry on from
   * what's showing rather than from an option that isn't.
   */
  private currentPanelItem(): PanelItem | null {
    if (this.highlightedIndex < 0) return this.highlightedGroup;
    const selectable = this.filteredItems.filter(item => item.tagName === 'OPTION') as HTMLOptionElement[];
    const group = parentOptgroupOf(selectable[this.highlightedIndex]);
    return group !== null && group !== this.openGroup ? group : this.highlightedIndex;
  }

  /**
   * Highlights the option at `index`, kept within the list. Disabled options can be highlighted,
   * so assistive tech announces them as unavailable, but not chosen.
   */
  private highlightOptionAt(options: HTMLOptionElement[], index: number) {
    if (options.length === 0) return;
    this.highlightedIndex = Math.max(0, Math.min(options.length - 1, index));
    this.updateOptionFocus();
  }

  /** Highlights a group row or an option, opening or closing flyouts to match. */
  private highlightPanelItem(item: PanelItem) {
    if (typeof item === 'number') {
      this.highlightedIndex = item;
    } else {
      this.highlightedIndex = -1;
      this.highlightedGroup = item;
    }
    this.updateOptionFocus();
  }

  private expandGroup(entries: ReturnType<typeof buildPanelEntries>, optgroup: HTMLOptGroupElement) {
    this.flyout.open(optgroup);
    const first = findGroup(entries, optgroup)?.options[0];
    if (first !== undefined) this.highlightPanelItem(first.index);
    // Its options render after this change; scroll to the first one then.
    this.pendingOptionFocus = true;
  }

  /** Closes the open group and highlights its row, as a tree's Left does from a child. */
  private collapseToGroup(optgroup: HTMLOptGroupElement) {
    this.flyout.reset();
    this.openGroup = null;
    this.highlightPanelItem(optgroup);
    // The row renders after this change (in drill-in it replaces the row back); scroll to it then.
    this.pendingOptionFocus = true;
  }

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
   * Sets the initial highlighted index when dropdown opens. Highlights the selected option unless
   * it's disabled. Otherwise highlights the first enabled option, or, in the grouped panel, the
   * first row with something to choose, or nothing when every option is disabled.
   */
  private setInitialHighlightedIndex() {
    const selectableOptions = this.filteredItems.filter(item => item.tagName === 'OPTION') as HTMLOptionElement[];

    if (selectableOptions.length === 0) {
      this.highlightedIndex = -1;
      return;
    }

    // If there's a selected option, find its index in the filtered options. A disabled one can be
    // the value, as in a native select, but it isn't highlighted.
    if (this.selectedOption && !isOptionDisabled(this.selectedOption)) {
      const selectedIndex = selectableOptions.findIndex(option => option === this.selectedOption);
      if (selectedIndex >= 0) {
        this.highlightedIndex = selectedIndex;
        // In the grouped panel, open on the selection's group, however the dropdown was opened, and
        // scroll the selection into view once its group has rendered.
        if (this.showsGroupedPanel) {
          this.openGroup = parentOptgroupOf(this.selectedOption);
          // Opening on the selection isn't drilling in, so it doesn't slide.
          this.drillDirection = null;
          this.pendingOptionFocus = true;
        }
        return;
      }
    }

    // In the grouped panel, the first row with something to choose: a group stays closed until
    // it's opened.
    if (this.showsGroupedPanel) {
      const first = this.panelEntries().find(entry =>
        entry.kind === 'group' ? !isGroupDisabled(entry.group) : !isOptionDisabled(entry.option),
      );
      this.highlightedIndex = first?.kind === 'option' ? first.index : -1;
      this.highlightedGroup = first?.kind === 'group' ? first.group.optgroup : null;
      return;
    }

    // No selected option or selected option not in filtered results, highlight the first enabled option
    this.highlightedIndex = selectableOptions.findIndex(option => !isOptionDisabled(option));
  }

  /**
   * Focus management helper - moves focus to the first option when dropdown opens
   */
  private focusFirstOption() {
    if (this.isOpen) {
      const selectableOptions = this.filteredItems.filter(item => item.tagName === 'OPTION');
      if (selectableOptions.length > 0) {
        this.setInitialHighlightedIndex();
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
    if (!this.isOpen) {
      return;
    }

    // Body-mounted listboxes stay outside modal focus traps; keep focus on the trigger.
    if (this.usesBodyPortal) {
      this.isArrowKeyNavigationMode = true;
      this.focusFirstOption();
      return;
    }

    this.isArrowKeyNavigationMode = true;

    const selectableOptions = this.filteredItems.filter(item => item.tagName === 'OPTION');
    if (selectableOptions.length > 0) {
      this.setInitialHighlightedIndex();
      // By index, through the same path as arrowing: it opens the option's flyout group first
      // when it isn't rendered, and highlights it once it is.
      this.updateOptionFocus();
    }
  }

  // Track if we're in arrow-key navigation mode (focus should move between options)
  private isArrowKeyNavigationMode: boolean = false;

  /**
   * Focus management helper - updates visual state and scrolling for the currently highlighted option
   * Note: We don't actually focus the option to prevent focusout events that close the dropdown
   */
  private updateOptionFocus() {
    if (this.listboxEl === undefined || this.listboxEl === null) return;

    // A row highlighted outright; an option highlighted in a closed group opens it below instead.
    const groupRow = this.showsGroupedPanel && this.highlightedIndex < 0 ? this.highlightedGroup : null;
    if (groupRow !== null) {
      // Arrowing onto another row closes a flyout that hover left open.
      if (this.effectiveGroupDisplay === 'flyout' && this.openGroup !== null && this.openGroup !== groupRow) {
        this.flyout.reset();
        this.openGroup = null;
      }
      // Matched by id, not a selector: componentId is consumer text and may not be selector-safe.
      const id = this.groupDomId(groupRow);
      const row = Array.from(this.listboxEl.querySelectorAll('[role="treeitem"]'))
        .find(item => item.id === id);
      // The row's trigger, not its item: the row back's item wraps the group's options, and showing
      // all of a group taller than the list would scroll the row back itself out of view.
      const trigger = Array.from(row?.children ?? []).find(child => child.classList.contains('pds-combobox__group-row-trigger'));
      if (trigger) this.scrollIntoViewNearest(trigger as HTMLElement, false);
      this.updateAriaActiveDescendant();
      return;
    }

    if (this.highlightedIndex < 0) return;

    // In the flyout panel only the open group's options are rendered: open the highlighted
    // option's group, and finish once it has rendered. Through the controller, so a hover timer
    // left running by the pointer can't close or switch the group the keys just moved into.
    if (this.showsGroupedPanel) {
      const selectable = this.filteredItems.filter(item => item.tagName === 'OPTION') as HTMLOptionElement[];
      const group = parentOptgroupOf(selectable[this.highlightedIndex]);
      const changed = group !== this.openGroup;
      if (group !== null) {
        this.flyout.open(group);
      } else {
        this.flyout.reset();
        this.openGroup = null;
      }
      if (changed) {
        this.pendingOptionFocus = true;
        return;
      }
    }

    const optionElements = this.listboxEl.querySelectorAll('[role="option"]');
    // By index, not position: the flyout panel renders only some options.
    const currentOption = this.listboxEl.querySelector(
      `[data-option-index="${this.highlightedIndex}"]`,
    ) as HTMLElement | null;

    if (currentOption) {
      // Check if any option currently has focus OR if we're in arrow-key navigation mode
      const hasOptionFocus = Array.from(optionElements).some(el => el === document.activeElement);

      // The panel's search field keeps focus and points at the option with aria-activedescendant,
      // and so does the trigger over the grouped panel, whose group rows can't take focus and
      // whose options are hidden while a flyout is placed.
      const shouldFocusOption =
        !this.usesBodyPortal &&
        !this.usesPanelSearch &&
        !this.showsGroupedPanel &&
        (hasOptionFocus || this.isArrowKeyNavigationMode);

      if (shouldFocusOption) {
        optionElements.forEach(option => {
          (option as HTMLElement).setAttribute('tabindex', '-1');
        });
        currentOption.setAttribute('tabindex', '0');
        currentOption.focus();
      }

      // Always scroll the option into view; in a flyout, by scrolling the flyout alone.
      const flyout = currentOption.closest('.pds-combobox__flyout') as HTMLElement | null;
      if (flyout) {
        this.flyout.reveal(flyout, currentOption);
      } else {
        this.scrollIntoViewNearest(currentOption, true);
      }
    }

    // Always update aria-activedescendant on the trigger element
    this.updateAriaActiveDescendant();
  }

  /** The highlighted group row in the grouped panel, or null while an option is highlighted. */
  private get highlightedGroupRow(): HTMLOptGroupElement | null {
    if (!this.showsGroupedPanel) return null;
    if (this.highlightedIndex < 0) return this.highlightedGroup;
    // An option left highlighted in a flyout that has since closed shows as its group's row.
    const current = this.currentPanelItem();
    return typeof current === 'number' ? null : current;
  }

  /**
   * The id of the highlighted option or group row, only while it's rendered. In the flyout panel
   * an option in a closed group isn't in the DOM, and drilled into a group the other groups' rows
   * aren't; `aria-activedescendant` must not point at a missing element.
   */
  private get activeDescendantId(): string | undefined {
    if (!this.isOpen) return undefined;
    const groupRow = this.highlightedGroupRow;
    if (groupRow !== null) {
      const drilledIntoAnother = this.effectiveGroupDisplay === 'drill-in' && this.openGroup !== null && this.openGroup !== groupRow;
      return drilledIntoAnother ? undefined : this.groupDomId(groupRow);
    }
    if (this.highlightedIndex < 0) return undefined;
    if (this.showsGroupedPanel) {
      const selectable = this.filteredItems.filter(item => item.tagName === 'OPTION') as HTMLOptionElement[];
      const group = parentOptgroupOf(selectable[this.highlightedIndex]);
      if (group !== null && group !== this.openGroup) return undefined;
    }
    return this.optionDomId(this.highlightedIndex);
  }

  /** Points the focused element's aria-activedescendant at the highlighted option, or clears it. */
  private updateAriaActiveDescendant() {
    // With panel search, the element with focus owns it, not the trigger: the search field, or
    // the list while a drilled-in group hides the field.
    const target = this.usesPanelSearch ? (this.hidesPanelSearch ? this.panelTreeEl : this.panelSearchEl) : this.triggerEl;
    if (!target) return;
    const id = this.activeDescendantId;
    if (id !== undefined) {
      target.setAttribute('aria-activedescendant', id);
    } else {
      target.removeAttribute('aria-activedescendant');
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

  /**
   * Clears the selected value and resets the component. Works while disabled too, as setting a
   * native control's value from script does.
   */
  @Method()
  async clear() {
    const hadValue = this.value !== '' || this.displayText !== '';

    this.displayText = '';
    this.setSelectedOption(null);
    this.value = '';
    this.filterOptions();
    this.updateFormValue('');

    if (hadValue) {
      this.pdsComboboxChange.emit({ value: '' });
    }
  }

  // Event handler for option click
  private onOptionClick = (event: Event) => {
    const idx = Number((event.currentTarget as HTMLElement).getAttribute('data-option-index'));
    const selectableOptions = this.filteredItems.filter(item => item.tagName === 'OPTION') as HTMLOptionElement[];
    const option = selectableOptions[idx];
    if (isOptionDisabled(option)) return;
    this.handleOptionClick(option);
    // The search field closes with the panel; send focus back to the trigger instead of losing it.
    // (Enter and Space already restore focus in the key handler.)
    if (this.usesPanelSearch) this.restoreFocusToTrigger();
  };

  private onButtonTriggerMouseEnter = (event: Event) => {
    this.syncTitle(event.currentTarget as HTMLElement, '.pds-combobox__button-trigger-text');
  };

  // Event handler for mouse enter on option
  private onOptionMouseEnter = (event: Event) => {
    const row = event.currentTarget as HTMLElement;
    if (this.truncate) this.syncTitle(row, '.pds-combobox__option-text');
    this.highlightedIndex = Number(row.getAttribute('data-option-index'));
    this.keyboardNavigating = false;
  };

  // Group rows in the flyout panel carry their group's index, as options carry theirs.
  private groupFromEvent(event: Event): HTMLOptGroupElement | null {
    const index = Number((event.currentTarget as HTMLElement).getAttribute('data-group-index'));
    return this.renderedGroups[index]?.optgroup ?? null;
  }

  private onGroupRowMouseEnter = (event: Event) => {
    const group = this.groupFromEvent(event);
    if (group !== null) this.flyout.enter(group);
  };

  private onGroupRowMouseLeave = (event: Event) => {
    const group = this.groupFromEvent(event);
    if (group !== null) this.flyout.leave(group);
  };

  // The pointer highlights a group's row as it does an option, so the keys carry on from there.
  private onGroupRowTriggerMouseEnter = (event: Event) => {
    const group = this.groupFromEvent(event);
    if (group !== null) this.highlightGroupRowByPointer(group);
  };

  private onGroupBackMouseEnter = () => {
    if (this.openGroup !== null) this.highlightGroupRowByPointer(this.openGroup);
  };

  private highlightGroupRowByPointer(group: HTMLOptGroupElement) {
    this.highlightedIndex = -1;
    this.highlightedGroup = group;
    this.keyboardNavigating = false;
    // So revealing this row again later is announced again.
    this.revealedGroupLabel = null;
  }

  private onGroupRowClick = (event: Event) => {
    const group = this.groupFromEvent(event);
    if (group === null) return;
    this.flyout.open(group);
    // Highlight the group's first option, so the arrow keys carry on from the group just opened
    // rather than from wherever the highlight was before.
    const first = this.renderedGroups.find(entry => entry.optgroup === group)?.options[0];
    if (first !== undefined) {
      this.highlightedIndex = first.index;
      this.updateAriaActiveDescendant();
    }
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
    return this.displayText || '';
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
      if (chipElement?.getAttribute('size') === 'lg') return true;
    }

    // Third priority: Check if we have custom trigger content with a chip (initial state)
    if (this.customTriggerContent) {
      const slottedChip = this.el.querySelector('pds-chip[slot="trigger-content"]');
      if (slottedChip && slottedChip.getAttribute('size') === 'lg') {
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
    // The button and chip triggers are divs, so a click reaches them even while disabled.
    if (this.disabled) return;
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.prepareExpandFilterListOnOpen();
      this.filterOptions();
      this.fetchAsyncOptionsOnOpen();

      // Set highlighted index and prepare for keyboard navigation
      this.setInitialHighlightedIndex();
      // For button trigger, prepare for arrow-key navigation mode
      this.isArrowKeyNavigationMode = true;
      setTimeout(() => this.openDropdownPositioning(), 0);
    } else {
      // Reset navigation mode when closing
      this.clearExpandFilterList();
      this.isArrowKeyNavigationMode = false;
    }
  };

  /**
   * With `async-url`, fetches when the button trigger opens: the first page if nothing has loaded.
   * The panel's search field opens empty, so results left from the last search are refetched for
   * an empty query.
   */
  private fetchAsyncOptionsOnOpen() {
    if (!this.asyncUrl) return;
    if (this.usesPanelSearch && (this.internalOptions.length === 0 || this.lastFetchedQuery !== '')) {
      this.debouncedFetchAsyncOptions('', 1);
    } else if (this.internalOptions.length === 0) {
      this.debouncedFetchAsyncOptions(this.displayText, 1);
    }
  }

  // Handler for button trigger keyboard events
  private onButtonTriggerKeyDown = (e: KeyboardEvent) => {
    // Disabled takes it out of the tab order, but setFocus() or a click can still focus it.
    if (this.disabled) {
      // Keep Space from scrolling the page, as on a native disabled button.
      if (e.key === ' ') e.preventDefault();
      return;
    }
    // Escape closes an open group before the dropdown. Other keys reach the tree through handleKeyDown.
    if (this.isOpen && e.key === 'Escape' && this.handleGroupedPanelKey(e)) return;
    if ((e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown' || e.key === 'ArrowUp') && !this.isOpen) {
      e.preventDefault();
      e.stopPropagation(); // Prevent the event from bubbling and triggering click
      this.keyboardNavigating = true;

      this.isOpen = true;
      this.prepareExpandFilterListOnOpen();
      this.filterOptions();
      this.fetchAsyncOptionsOnOpen();
      // Set highlighted index immediately
      this.setInitialHighlightedIndex();
      setTimeout(() => {
        this.openDropdownPositioning();
        // For all button trigger keyboard opening, focus the first option so subsequent navigation works
        this.focusFirstOptionForArrowKeys();
      }, 0);
    } else if (e.key === 'Escape') {
      // Only an open dropdown claims Escape; a closed one leaves it to a modal or popover around it.
      if (this.isOpen) {
        e.preventDefault();
        this.isOpen = false;
        this.highlightedIndex = -1;
        this.clearExpandFilterList();
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

    const isRelatedTargetInListbox =
      relatedTarget &&
      (this.listboxEl?.contains(relatedTarget) || this.portalEl?.contains(relatedTarget));
    // `contains` doesn't cross into the shadow root, where the trigger lives; with panel search,
    // focus leaves the search field for the trigger whenever it's clicked to close.
    const isRelatedTargetInCombobox =
      relatedTarget !== null && (this.el.contains(relatedTarget) || !!this.el.shadowRoot?.contains(relatedTarget));

    // Don't close if focus is moving to an option in the listbox or staying within the combobox
    if (!isRelatedTargetInCombobox && !isRelatedTargetInListbox) {
      this.isOpen = false;
      this.highlightedIndex = -1;
      this.clearExpandFilterList();
      this.isArrowKeyNavigationMode = false; // Reset arrow-key navigation mode
      this.updateAriaActiveDescendant(); // Clear aria-activedescendant

      // If there's a selected option but the display text doesn't match, restore the selected option's display text
      if (this.selectedOption && this.displayText !== this.getOptionLabel(this.selectedOption)) {
        this.displayText = this.getOptionLabel(this.selectedOption);
        // The @Watch('selectedOption') will handle value and form internals if needed
      }
    }
  };

  private handleOptionClick(option: HTMLOptionElement) {
    if (isOptionDisabled(option)) return;
    // Update reactive state - single source of truth
    // The @Watch('selectedOption') will handle displayText, value, and form internals
    this.setSelectedOption(option);

    this.isOpen = false;
    this.clearExpandFilterList();
    this.pdsComboboxChange.emit({ value: option.value });
  }

  private handleScroll = (e: Event) => {
    if (!this.asyncUrl || !this.hasMore || this.loading) return;

    const target = e.target as HTMLElement;
    const scrollBottom = target.scrollHeight - target.scrollTop - target.clientHeight;

    // Load more when near bottom (within 50px)
    if (scrollBottom < 50) {
      this.pdsComboboxLoadOptions.emit({
        query: this.activeQuery,
        page: this.currentPage + 1,
      });
      this.debouncedFetchAsyncOptions(this.activeQuery, this.currentPage + 1);
    }
  };

  private renderDropdown() {
    if (!this.isOpen) {
      return null;
    }

    const hasSlottedEmpty = !this.usesBodyPortal && !!this.el.querySelector('[slot="empty"]');
    const hasSlottedLoading = !this.usesBodyPortal && !!this.el.querySelector('[slot="loading"]');

    const selectableOptions = this.filteredItems.filter(item => item.tagName === 'OPTION') as HTMLOptionElement[];

    const withSearch = this.usesPanelSearch;
    // While a drilled-in group hides the search field, the list takes focus in its place.
    const listTakesFocus = this.hidesPanelSearch;
    const list = (
      <ul
        key="panel-list"
        class={{
          'pds-combobox__listbox': !withSearch,
          'pds-combobox__listbox-options': withSearch,
          'pds-combobox__listbox-options--drilled-in': listTakesFocus,
          'pds-combobox__listbox--grouped': this.groupDisplay !== 'inline',
          'pds-combobox__listbox--drill-in': this.drillDirection === 'in',
          'pds-combobox__listbox--drill-out': this.drillDirection === 'out',
          'pds-combobox__listbox--pointer-hover': this.pointerCanHover,
          'pds-combobox__listbox--truncate': this.truncate,
        }}
        onAnimationEnd={this.onDrillAnimationEnd}
        onPointerMove={this.onPanelPointer}
        onPointerDown={this.onPanelPointer}
        role={this.showsGroupedPanel ? 'tree' : 'listbox'}
        id={this.listboxId}
        aria-label={this.label || 'Options'}
        aria-multiselectable="false"
        // Focusable but out of the tab order with panel search, so it can take focus when a
        // drilled-in group hides the field. Dropping it while focused would blur the list and close.
        tabIndex={withSearch ? -1 : undefined}
        aria-activedescendant={listTakesFocus ? this.activeDescendantId : undefined}
        onKeyDown={withSearch ? this.onPanelTreeKeyDown : undefined}
        ref={el => {
          if (withSearch) this.panelTreeEl = el as HTMLElement;
          else this.listboxEl = el as HTMLElement;
        }}
        onScroll={this.handleScroll}
      >
        {this.loading && (
          <li class="pds-combobox__loading" role="presentation">
            {hasSlottedLoading ? (
              <slot name="loading" />
            ) : (
              <pds-loader size="small" />
            )}
          </li>
        )}

        {!this.loading && this.filteredItems.length === 0 && (
          <li class="pds-combobox__empty" role="presentation">
            {hasSlottedEmpty ? (
              <slot name="empty" />
            ) : (
              <span>{this.noOptionsFoundLabel}</span>
            )}
          </li>
        )}

        {this.showsGroupedPanel ? this.renderGroupedPanel() : this.renderListboxItems(selectableOptions.length)}

        {this.hasMore && !this.loading && (
          <li class="pds-combobox__load-more" role="presentation">
            <pds-loader size="small" />
          </li>
        )}
      </ul>
    );

    if (!withSearch) return list;

    // The search field sits above the list; the wrapper is what's positioned and portaled.
    return (
      <div
        class="pds-combobox__listbox pds-combobox__listbox--with-search"
        ref={el => (this.listboxEl = el as HTMLElement)}
        onMouseDown={this.onPanelMouseDown}
        // Portaled, the panel sits outside .pds-combobox, so its focusout wouldn't reach that handler.
        onFocusout={this.usesBodyPortal ? this.onComboboxFocusOut : undefined}
      >
        {!listTakesFocus && this.renderPanelSearch()}
        {list}
      </div>
    );
  }

  // A press on the panel's padding, captions or status rows keeps focus in the search field;
  // otherwise it would blur the field, closing a portaled panel or stranding the keys.
  private onPanelMouseDown = (event: MouseEvent) => {
    if (event.target !== this.panelSearchEl) event.preventDefault();
  };

  /**
   * The listbox's items. Each optgroup's options sit in a `group` named for it, as in
   * `pds-multiselect`, so assistive tech announces the group on entering it; a `pds-text` label
   * stays a caption above the options that follow it.
   */
  private renderListboxItems(setSize: number) {
    const rendered = [];
    let optionIndex = 0;
    let group: { optgroup: HTMLOptGroupElement; key: string; options: unknown[]; members: HTMLOptionElement[] } | null = null;

    const closeGroup = () => {
      if (group === null) return;
      const { optgroup, key, options, members } = group;
      const groupIcon = groupIconOf(optgroup);
      // As in the grouped displays: disabled when there's nothing left in it to choose.
      const disabled = members.length > 0 && members.every(member => isOptionDisabled(member));
      rendered.push(
        <li
          key={key}
          class={{ 'pds-combobox__group': true, 'pds-combobox__group--disabled': disabled }}
          role="group"
          aria-label={optgroup.label}
          aria-disabled={disabled ? 'true' : undefined}
        >
          <div
            class={{ 'pds-combobox__group-label': true, 'pds-combobox__group-label--with-icon': groupIcon !== null }}
            aria-hidden="true"
          >
            {groupIcon !== null && (
              // `name`, not `icon`: `icon` also loads URLs and data: SVGs, unsanitized.
              <pds-icon name={groupIcon} size="small" aria-hidden="true" class="pds-combobox__group-icon" />
            )}
            {optgroup.label}
          </div>
          <ul class="pds-combobox__group-list" role="presentation">
            {options}
          </ul>
        </li>,
      );
      group = null;
    };

    this.filteredItems.forEach((item, itemIdx) => {
      if (item.tagName === 'OPTGROUP') {
        closeGroup();
        group = { optgroup: item as HTMLOptGroupElement, key: `optgroup-${itemIdx}`, options: [], members: [] };
      } else if (item.tagName === 'PDS-TEXT') {
        closeGroup();
        rendered.push(
          <li key={`pds-text-${itemIdx}`} class="pds-combobox__group-label" role="presentation">
            {(item as HTMLPdsTextElement).textContent}
          </li>,
        );
      } else if (item.tagName === 'OPTION') {
        const option = item as HTMLOptionElement;
        if (group !== null && parentOptgroupOf(option) !== group.optgroup) closeGroup();
        const rendering = this.renderOption(option, optionIndex, { posinset: optionIndex + 1, setsize: setSize });
        optionIndex++;
        if (group !== null) {
          group.options.push(rendering);
          group.members.push(option);
        } else {
          rendered.push(rendering);
        }
      }
    });
    closeGroup();
    return rendered;
  }

  /** `panelSearch` applies to the triggers that can't be typed into. */
  private get usesPanelSearch(): boolean {
    return this.panelSearch && this.trigger !== 'input';
  }

  /** `groupDisplay`, with `flyout` drilling in when there's no room beside the dropdown. */
  private get effectiveGroupDisplay(): 'inline' | 'flyout' | 'drill-in' {
    return this.groupDisplay === 'flyout' && this.flyoutFallback ? 'drill-in' : this.groupDisplay;
  }

  /**
   * The popup's role, for the triggers' `aria-haspopup`: a `tree` while the grouped panel shows
   * groups, and a `listbox` of options otherwise, search results included.
   */
  private get popupRole(): 'tree' | 'listbox' {
    return this.showsGroupedPanel ? 'tree' : 'listbox';
  }

  /**
   * The input trigger's `aria-haspopup`. While closed it names what opening shows: the full list,
   * so the grouped panel in a grouped display, even though the input still holds the selection's
   * label.
   */
  private get inputPopupRole(): 'tree' | 'listbox' {
    if (this.isOpen) return this.popupRole;
    return this.effectiveGroupDisplay === 'inline' ? 'listbox' : 'tree';
  }

  /**
   * The button and chip triggers' `aria-haspopup`. With panel search the trigger opens the panel,
   * which starts as a tree in a grouped display, so typing in the panel doesn't change it.
   */
  private get triggerPopupRole(): 'tree' | 'listbox' {
    if (!this.usesPanelSearch) return this.popupRole;
    return this.groupDisplay === 'inline' ? 'listbox' : 'tree';
  }

  /**
   * Drilled into a group with panel search: the group's row back takes the search field's place,
   * since one group's options don't need searching. Typing searches the whole list again.
   */
  private get hidesPanelSearch(): boolean {
    return this.usesPanelSearch && this.showsGroupedPanel && this.effectiveGroupDisplay === 'drill-in' && this.openGroup !== null;
  }

  /** The grouped panel is showing groups rather than search results. */
  private get showsGroupedPanel(): boolean {
    if (this.effectiveGroupDisplay === 'inline') return false;
    const searching = this.usesPanelSearch
      ? this.panelQuery !== ''
      : this.mode === 'filter' && !this.expandFilterListWhileOpen && this.displayText !== '';
    return !searching;
  }

  private onPanelSearchInput = (event: Event) => {
    this.setPanelQuery((event.target as HTMLInputElement).value);
  };

  private setPanelQuery(query: string) {
    this.panelQuery = query;
    this.clearExpandFilterList();
    this.filterOptions();
    this.pdsComboboxSearch.emit({ query: this.panelQuery });
    if (this.asyncUrl !== undefined && this.asyncUrl !== '') {
      this.debouncedFetchAsyncOptions(this.panelQuery, 1);
    }
    // The list changes size, so place the dropdown again, as typing in the input trigger does.
    setTimeout(() => this.openDropdownPositioning(), 0);
  }

  /** What's being searched: the panel's field, or the input trigger's text. */
  private get activeQuery(): string {
    return this.usesPanelSearch ? this.panelQuery : this.displayText;
  }

  // Space, Home and End edit the search text rather than moving through the options.
  private onPanelSearchKeyDown = (event: KeyboardEvent) => {
    if (event.key === ' ' || event.key === 'Home' || event.key === 'End') return;
    if (this.handlePanelTab(event)) return;
    this.handleKeyDown(event);
  };

  /**
   * Keys in the list while a drilled-in group hides the search field. Backspace, like ArrowLeft,
   * steps back to the groups; a character starts a search of the whole list. Characters typed
   * before the search field renders and takes focus still land on the list, so they add to the
   * query rather than starting it again.
   */
  private onPanelTreeKeyDown = (event: KeyboardEvent) => {
    if (this.handlePanelTab(event)) return;
    if (event.key === 'Backspace') {
      event.preventDefault();
      if (!this.leaveDrilledInGroup() && this.panelQuery !== '') this.setPanelQuery(this.panelQuery.slice(0, -1));
      return;
    }
    // AltGr (Ctrl+Alt on Windows) and Option on macOS type characters too; Meta and Ctrl alone are
    // shortcuts.
    if (event.key.length === 1 && event.key !== ' ' && !event.metaKey && (!event.ctrlKey || event.altKey)) {
      event.preventDefault();
      this.flyout.reset();
      // The query first, so leaving the group reads as search results, not a slide back.
      this.setPanelQuery(this.panelQuery + event.key);
      this.openGroup = null;
      return;
    }
    this.handleKeyDown(event);
  };

  // Tab closes the dropdown and lands on the trigger, as Escape does: the focused field or list is
  // about to unmount, so the browser can't tab on from it. The next Tab continues from the trigger.
  private handlePanelTab(event: KeyboardEvent): boolean {
    if (event.key !== 'Tab') return false;
    event.preventDefault();
    this.handleKeyDown(event);
    this.restoreFocusToTrigger();
    return true;
  }

  /** Returns from a drilled-in group to the group list; false when not drilled in. */
  private leaveDrilledInGroup(): boolean {
    if (!this.showsGroupedPanel || this.effectiveGroupDisplay !== 'drill-in' || this.openGroup === null) return false;
    this.collapseToGroup(this.openGroup);
    return true;
  }

  private onGroupBackClick = () => {
    this.leaveDrilledInGroup();
  };

  private renderPanelSearch() {
    return (
      <div key="panel-search" class="pds-combobox__panel-search">
        <pds-icon name="search" size="regular" aria-hidden="true" />
        <input
          ref={el => (this.panelSearchEl = el as HTMLInputElement)}
          type="text"
          class="pds-combobox__panel-search-input"
          placeholder={this.searchPlaceholder}
          value={this.panelQuery}
          role="combobox"
          aria-label={this.searchOptionsLabel}
          aria-haspopup={this.popupRole}
          aria-controls={this.listboxId}
          aria-autocomplete="list"
          aria-expanded="true"
          aria-activedescendant={this.activeDescendantId}
          autocomplete="off"
          onInput={this.onPanelSearchInput}
          onKeyDown={this.onPanelSearchKeyDown}
        />
      </div>
    );
  }

  /**
   * An option, as a listbox `option` or, given a tree `level`, a `treeitem`. `posinset` and
   * `setsize` place it among its siblings.
   */
  private renderOption(
    option: HTMLOptionElement,
    index: number,
    { posinset, setsize, level }: { posinset: number; setsize: number; level?: number },
  ) {
    const isSelected = this.isOptionSelected(option);
    const isHighlighted = this.highlightedIndex === index;
    const isLayout = this.isOptionLayout(option);
    const isChip = this.isOptionChip(option);
    const isDisabled = isOptionDisabled(option);
    const tree = level !== undefined;

    return (
      <li
        key={option.value}
        id={this.optionDomId(index)}
        role={tree ? 'treeitem' : 'option'}
        // A single-select tree marks only the selected item; a listbox marks every option.
        aria-selected={isSelected ? 'true' : tree ? undefined : 'false'}
        aria-disabled={isDisabled ? 'true' : undefined}
        aria-level={level}
        aria-setsize={setsize}
        aria-posinset={posinset}
        aria-label={isLayout || isChip ? option.getAttribute('aria-label') || this.getOptionLabel(option) : undefined}
        tabindex={this.usesBodyPortal || this.usesPanelSearch || tree ? '-1' : isHighlighted ? '0' : '-1'}
        class={{
          'pds-combobox__option': true,
          'pds-combobox__option--highlighted': isHighlighted,
          'pds-combobox__option--layout': isLayout,
          'pds-combobox__option--chip': isChip,
          'pds-combobox__option--disabled': isDisabled,
        }}
        data-option-index={index}
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
          this.renderOptionLabel(option)
        )}
        {isSelected && <pds-icon icon="check" size="regular" aria-hidden="true" class="pds-combobox__option-check" />}
      </li>
    );
  }

  /** An option's text, after its `data-icon` when it has one. */
  private renderOptionLabel(option: HTMLOptionElement) {
    const icon = optionIconOf(option);
    const label = this.truncate ? <span class="pds-combobox__option-text">{this.getOptionLabel(option)}</span> : this.getOptionLabel(option);
    if (icon === null) return label;
    return (
      <span class="pds-combobox__option-label">
        {/* `name`, not `icon`: `icon` also loads URLs and data: SVGs, unsanitized. */}
        <pds-icon name={icon} size="regular" aria-hidden="true" class="pds-combobox__option-icon" />
        {label}
      </span>
    );
  }

  /** The grouped panel's rows, in the order the panel draws them and the keyboard moves through. */
  private panelEntries(): PanelEntry[] {
    // Slotted markup is already in order; only options from data record positions.
    if (this.options === undefined && !this.asyncUrl) return buildPanelEntries(this.filteredItems);
    return buildPanelEntries(this.filteredItems, element => this.panelPositions.get(element));
  }

  /**
   * `flyout`: one row per group, its options in a flyout beside it. `drill-in`: the same rows, and
   * an opened group replaces them with its row, drawn as a row back, above its options. Either way
   * it's a tree: the rows and ungrouped options are level 1, a group's options level 2.
   */
  private renderGroupedPanel() {
    const entries = this.panelEntries();
    const setsize = entries.length;

    if (this.effectiveGroupDisplay === 'drill-in' && this.openGroup !== null) {
      const position = entries.findIndex(entry => entry.kind === 'group' && entry.group.optgroup === this.openGroup);
      const open = entries[position];
      if (open?.kind === 'group') return this.renderGroupBackRow(open.group, { posinset: position + 1, setsize });
    }

    this.renderedGroups = [];
    return entries.map((entry, position) => {
      const placement = { posinset: position + 1, setsize };
      if (entry.kind === 'option') return this.renderOption(entry.option, entry.index, { ...placement, level: 1 });
      this.renderedGroups.push(entry.group);
      return this.renderGroupRow(entry.group, this.renderedGroups.length - 1, placement);
    });
  }

  /** A group's options, as its children in the tree. */
  private renderGroupOptions(group: PanelGroup) {
    return group.options.map(({ option, index }, position) =>
      this.renderOption(option, index, { posinset: position + 1, setsize: group.options.length, level: 2 }),
    );
  }

  /**
   * Drilled into a group: its treeitem, expanded. Its row reads as a way back ("Back: Tag") and
   * leads its options.
   */
  private renderGroupBackRow(group: PanelGroup, { posinset, setsize }: { posinset: number; setsize: number }) {
    const id = this.groupDomId(group.optgroup);
    const disabled = isGroupDisabled(group);
    return (
      <li
        key="group-back"
        id={id}
        class={{
          'pds-combobox__group-back': true,
          'pds-combobox__group-back--disabled': disabled,
          // As the group rows: shaded for the keys, and by `:hover` for the pointer.
          'pds-combobox__group-back--highlighted': this.keyboardNavigating && this.highlightedGroupRow === group.optgroup,
          'pds-combobox__group-back--keyboard': this.keyboardNavigating && this.highlightedGroupRow === group.optgroup,
        }}
        role="treeitem"
        aria-expanded="true"
        aria-disabled={disabled ? 'true' : undefined}
        aria-level={1}
        aria-posinset={posinset}
        aria-setsize={setsize}
        aria-labelledby={`${id}-label`}
      >
        <div
          class="pds-combobox__group-row-trigger pds-combobox__group-back-trigger"
          onMouseDown={this.onOptionMouseDown}
          onMouseEnter={this.onGroupBackMouseEnter}
          onClick={this.onGroupBackClick}
        >
          <span class="pds-combobox__group-row-label" id={`${id}-label`}>
            <pds-icon name="caret-left" size="regular" aria-hidden="true" class="pds-combobox__group-row-caret" />
            <span class="visually-hidden">{this.drillInBackLabel}: </span>
            {group.label}
          </span>
        </div>
        <ul class="pds-combobox__drill-in-options" role="group" aria-label={group.label}>
          {this.renderGroupOptions(group)}
        </ul>
      </li>
    );
  }

  private renderGroupRow(group: PanelGroup, groupIndex: number, { posinset, setsize }: { posinset: number; setsize: number }) {
    const flyout = this.effectiveGroupDisplay === 'flyout';
    const isOpen = flyout && this.openGroup === group.optgroup;
    // Drill-in shades a group row only for the keys: not for the group holding the selection, or the
    // row the pointer or a click-open left highlighted, which read as picked. `:hover` covers the pointer.
    const hasSelection = flyout && group.options.some(({ option }) => this.isOptionSelected(option));
    const isCurrent = this.highlightedGroupRow === group.optgroup;
    const disabled = isGroupDisabled(group);
    const id = this.groupDomId(group.optgroup);

    return (
      <li
        key={`group-${groupIndex}`}
        id={id}
        class={{
          'pds-combobox__group-row': true,
          'pds-combobox__group-row--open': isOpen,
          'pds-combobox__group-row--has-selection': hasSelection,
          'pds-combobox__group-row--highlighted': isCurrent && (flyout || this.keyboardNavigating),
          'pds-combobox__group-row--keyboard': isCurrent && this.keyboardNavigating,
          'pds-combobox__group-row--disabled': disabled,
        }}
        role="treeitem"
        aria-expanded={isOpen ? 'true' : 'false'}
        aria-disabled={disabled ? 'true' : undefined}
        aria-level={1}
        aria-posinset={posinset}
        aria-setsize={setsize}
        aria-labelledby={`${id}-label`}
        data-group-index={groupIndex}
        onMouseEnter={flyout ? this.onGroupRowMouseEnter : undefined}
        onMouseLeave={flyout ? this.onGroupRowMouseLeave : undefined}
      >
        {/* A pointer shortcut: every option it reveals is reachable with the arrow keys. */}
        <div
          class="pds-combobox__group-row-trigger"
          data-group-index={groupIndex}
          onMouseDown={this.onOptionMouseDown}
          onMouseEnter={this.onGroupRowTriggerMouseEnter}
          onClick={this.onGroupRowClick}
        >
          <span class="pds-combobox__group-row-label" id={`${id}-label`}>
            {group.icon !== null && (
              // `name`, not `icon`: `icon` also loads URLs and data: SVGs, unsanitized.
              <pds-icon name={group.icon} size="regular" aria-hidden="true" class="pds-combobox__group-icon" />
            )}
            {group.label}
          </span>
          <pds-icon name="caret-right" size="regular" aria-hidden="true" class="pds-combobox__group-row-caret" />
        </div>
        {isOpen && (
          <ul
            class="pds-combobox__flyout"
            role="group"
            aria-label={group.label}
            style={{ minWidth: this.flyoutMinWidth, maxWidth: this.flyoutMaxWidth }}
          >
            {this.renderGroupOptions(group)}
          </ul>
        )}
      </li>
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
    const icon = this.selectedIcon;
    return (
      <span
        class={{
          'pds-combobox__button-trigger-label': true,
          'pds-combobox__button-trigger-label--placeholder': !this.selectedLabel,
          'pds-combobox__button-trigger-label--with-icon': icon !== null,
        }}
      >
        {icon !== null && (
          // `name`, not `icon`: `icon` also loads URLs and data: SVGs, unsanitized.
          <pds-icon name={icon} size="regular" aria-hidden="true" class="pds-combobox__button-trigger-icon" />
        )}
        {this.truncate ? (
          // Keyed so a new label drops a stale `title`.
          <span key={this.selectedLabel || this.placeholder} class="pds-combobox__button-trigger-text">
            {this.selectedLabel || this.placeholder}
          </span>
        ) : (
          this.selectedLabel || this.placeholder
        )}
      </span>
    );
  }

  /** The selection's icon for the button trigger: the option's own, or else its group's. */
  private get selectedIcon(): string | null {
    const option = this.selectedOption;
    if (!option) return null;
    const optgroup = parentOptgroupOf(option);
    return optionIconOf(option) ?? (optgroup !== null ? groupIconOf(optgroup) : null);
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
        size={this.selectedOptionChipProps.large ? 'lg' : undefined}
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
        {this.selectedChipIcon && <pds-icon icon={this.selectedChipIcon} aria-hidden="true" class="pds-combobox__chip-trigger-icon" />}
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
        size={chipProps.large ? 'lg' : undefined}
        icon={chipProps.icon}
        dot={chipProps.dot}
        class="pds-combobox__option-chip"
      >
        {this.getOptionLabel(option)}
      </pds-chip>
    );
  }



  // Mirrors pds-multiselect and pds-select: an error message on its own puts the
  // field in an invalid state, so assistive tech agrees with the visual treatment.
  private isInvalid(): boolean {
    return Boolean(this.invalid) || Boolean(this.errorMessage);
  }

  private renderMessages() {
    const hasErrorMessage = Boolean(this.errorMessage);
    const showHelperMessage = Boolean(this.helperMessage) && !hasErrorMessage;

    return [
      showHelperMessage && (
        <p class="pds-combobox__helper" id={messageId(this.componentId, 'helper')}>
          {this.helperMessage}
        </p>
      ),
      hasErrorMessage && (
        <p class="pds-combobox__error" id={messageId(this.componentId, 'error')} aria-live="assertive">
          <pds-icon icon="danger" size="small" aria-hidden="true" />
          {this.errorMessage}
        </p>
      ),
    ];
  }

  render() {
    const triggerClass = [
      'pds-combobox__button-trigger',
      `pds-combobox__button-trigger--${this.triggerVariant}`,
      this.triggerShape === 'input' && 'pds-combobox__button-trigger--input-shape',
      this.truncate && 'pds-combobox__button-trigger--truncate',
    ]
      .filter(Boolean)
      .join(' ');
    return (
      <Host aria-disabled={this.disabled ? 'true' : null}>
        <div class="pds-combobox" tabIndex={-1} onFocusout={this.onComboboxFocusOut} part="combobox">
          {this.hasVisibleLabel && (
            <label
              htmlFor={this.trigger === 'input' ? this.componentId : undefined}
              id={this.labelId}
              class="pds-combobox__label"
              onClick={this.onLabelClick}
            >
              {this.label}
            </label>
          )}
          {this.trigger === 'input' ? (
            <div class="pds-combobox__input-wrapper" style={{ width: this.triggerWidth }}>
              <input
                ref={el => {
                  this.inputEl = el as HTMLInputElement;
                  this.triggerEl = el as HTMLElement;
                }}
                class={{
                  'pds-combobox__input': true,
                  'pds-combobox__input--invalid': this.isInvalid(),
                }}
                type="text"
                role="combobox"
                aria-autocomplete="list"
                aria-haspopup={this.inputPopupRole === 'tree' ? 'tree' : undefined}
                aria-controls={this.listboxId}
                aria-describedby={assignDescription(this.componentId, this.isInvalid(), this.helperMessage, this.errorMessage)}
                aria-invalid={this.isInvalid() ? 'true' : undefined}
                aria-activedescendant={this.usesPanelSearch ? undefined : this.activeDescendantId}
                aria-expanded={this.isOpen ? 'true' : 'false'}
                aria-disabled={this.disabled ? 'true' : 'false'}
                aria-label={this.hideLabel ? this.label : undefined}
                id={this.componentId}
                value={this.displayText}
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
              role={this.usesPanelSearch ? 'button' : 'combobox'}
              aria-haspopup={this.triggerPopupRole}
              aria-controls={this.listboxId}
              aria-describedby={assignDescription(this.componentId, this.isInvalid(), this.helperMessage, this.errorMessage)}
              aria-invalid={this.isInvalid() ? 'true' : undefined}
              aria-activedescendant={this.usesPanelSearch ? undefined : this.activeDescendantId}
              aria-expanded={this.isOpen ? 'true' : 'false'}
              aria-disabled={this.disabled ? 'true' : 'false'}
              aria-label={this.triggerAriaLabel}
              aria-labelledby={this.triggerLabelledBy}
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
              role={this.usesPanelSearch ? 'button' : 'combobox'}
              aria-haspopup={this.triggerPopupRole}
              aria-controls={this.listboxId}
              aria-describedby={assignDescription(this.componentId, this.isInvalid(), this.helperMessage, this.errorMessage)}
              aria-invalid={this.isInvalid() ? 'true' : undefined}
              aria-activedescendant={this.usesPanelSearch ? undefined : this.activeDescendantId}
              aria-expanded={this.isOpen ? 'true' : 'false'}
              aria-disabled={this.disabled ? 'true' : 'false'}
              aria-label={this.triggerAriaLabel}
              aria-labelledby={this.triggerLabelledBy}
              id={this.componentId}
              tabIndex={this.disabled ? -1 : 0}
              onClick={this.onButtonTriggerClick}
              data-layout={this.customTriggerContent}
              onKeyDown={this.onButtonTriggerKeyDown}
              onKeyUp={this.onButtonTriggerKeyUp}
              onMouseEnter={this.truncate ? this.onButtonTriggerMouseEnter : undefined}
              ref={el => (this.triggerEl = el as HTMLElement)}
              part="button-trigger"
            >
              {this.renderButtonTriggerContent()}
            </div>
          )}
          {this.renderMessages()}
          {/* Hide the slot so options are not visible */}
          <div style={{ display: 'none' }}>
            <slot onSlotchange={() => this.updateOptions()}></slot>
          </div>
          {this.renderDropdown()}
          {/* Announces the group drilled into, which focus alone doesn't. Rendered for any grouped
              display, so it's in place before a flyout falls back to drilling in. */}
          {this.groupDisplay !== 'inline' && [
            <span key="drill-status" class="visually-hidden" role="status" aria-live="polite">
              {this.isOpen && this.effectiveGroupDisplay === 'drill-in' && this.openGroup !== null ? this.openGroup.label : ''}
            </span>,
            // Its own region: sharing one, revealing a row then opening it would leave the text the
            // same, and opening the group would go unannounced.
            <span key="reveal-status" class="visually-hidden" role="status" aria-live="polite">
              {this.isOpen ? this.revealedGroupLabel ?? '' : ''}
            </span>,
          ]}
        </div>
      </Host>
    );
  }
}
