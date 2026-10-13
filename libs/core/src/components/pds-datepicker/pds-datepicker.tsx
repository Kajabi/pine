import { Component, Element, Event, EventEmitter, h, Host, Method, Prop, State, Watch } from '@stencil/core';
import { autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom';
import { calendarSimple, caretDown, caretLeft, caretRight, check } from '@pine-ds/icons/icons';
import { isSpecTest } from '../../utils/form';
import { resolveLocale } from '../../i18n';
import type { PlacementType } from '@utils/types';
import type { DatepickerChangeEventDetail, DatepickerPreset } from './datepicker-interface';
import type { InputInputEventDetail } from '../pds-input/input-interface';
import {
  addDays,
  addMonths,
  clampDate,
  dateFormatter,
  formatDate,
  isOutOfRange,
  isSameDay,
  localeFirstDayOfWeek,
  monthWeeks,
  parseIsoDate,
  supportedLocale,
  toIsoDate,
  today,
  weekdayColumn,
  weekdayNames,
} from './date-utils';
import { matchPreset, presetInRange, resolvePresets } from './presets';
import type { ResolvedPreset } from './presets';
import {
  RANGE_SEPARATOR,
  clockFor,
  compareDateTime,
  fieldFormat,
  joinTime,
  parseDateTime,
  parseFieldText,
  parseRangeText,
  splitTime,
  toFieldText,
  toValueString,
} from './value';
import type { DateTimeValue } from './value';

const FULL_DATE: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
const DEFAULT_START_TIME = '00:00';
const DEFAULT_END_TIME = '23:59';
/** How many years either side of today the year dropdown offers without `min` or `max`. */
const DROPDOWN_YEARS = 100;

const firstOfMonth = (date: Date) => new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));

/**
 * A field for one date, or in range mode a start and end date, with a calendar to pick from.
 * The value is `YYYY-MM-DD`, or `YYYY-MM-DD/YYYY-MM-DD` for a range; with the time picker, each
 * date carries a time, as `YYYY-MM-DDTHH:mm`.
 */
@Component({
  tag: 'pds-datepicker',
  styleUrl: 'pds-datepicker.scss',
  shadow: true,
  formAssociated: true,
})
export class PdsDatepicker {
  private inputEl?: HTMLPdsInputElement;
  private triggerEl?: HTMLButtonElement;
  private dialogEl?: HTMLElement;
  private internals?: ElementInternals;
  private cleanupAutoUpdate?: () => void;
  /** Set when the active day should take focus on the next render. */
  private focusActiveDay = false;

  @Element() el!: HTMLPdsDatepickerElement;

  /**
   * Accessible label for the button that applies the chosen dates.
   */
  @Prop() applyLabel = 'Apply';

  /**
   * Accessible label for the button that closes the calendar without changing the dates.
   */
  @Prop() cancelLabel = 'Cancel';

  /**
   * Replaces the Cancel button with a Clear button, which empties the field. Shown with the range
   * mode and time picker buttons.
   */
  @Prop() clearable = false;

  /**
   * Accessible label for the button that empties the field, when `clearable` is set.
   */
  @Prop() clearLabel = 'Clear';

  /**
   * A unique identifier used for the underlying component `id` attribute.
   */
  @Prop() componentId!: string;

  /**
   * The label of the presets entry that stands for a range of your own. Range mode with presets only.
   */
  @Prop() customRangeLabel = 'Custom range';

  /**
   * Determines whether or not the datepicker is disabled.
   */
  @Prop() disabled?: boolean;

  /**
   * Accessible label for the end time, in range mode with the time picker.
   */
  @Prop() endTimeLabel = 'End time';

  /**
   * Specifies the error message and provides an error-themed treatment to the field.
   */
  @Prop() errorMessage?: string;

  /**
   * The first day of the week in the calendar, from `0` (Sunday) to `6` (Saturday). Defaults to the
   * locale's first day where the browser reports it, otherwise Sunday.
   */
  @Prop() firstDayOfWeek?: number;

  /**
   * How the field shows dates and reads typed ones, as tokens: `YYYY`, `MM` or `M` (month), `DD` or
   * `D` (day), and with the time picker `HH` or `H` (24-hour), `hh` or `h` (12-hour), `mm` and `A`
   * (AM/PM), as `MM/DD/YYYY` or `D.M.YYYY h:mm A`. The value and the change event stay ISO
   * (`YYYY-MM-DD`), whatever the format. Typed ISO dates are always accepted too.
   */
  @Prop() format = 'YYYY-MM-DD';

  /**
   * Determines whether or not the datepicker takes full width of its container.
   */
  @Prop() fullWidth?: boolean;

  /**
   * Displays a message or hint below the field.
   */
  @Prop() helperMessage?: string;

  /**
   * Visually hides the label text for instances where only the field should be displayed. Label remains accessible to assistive technology such as screen readers.
   */
  @Prop() hideLabel: boolean;

  /**
   * Accessible label for the hour in the time picker.
   */
  @Prop() hourLabel = 'Hour';

  /**
   * Determines whether or not the datepicker is invalid or throws an error.
   */
  @Prop() invalid?: boolean;

  /**
   * The validation message the form reports when the typed text isn't a date that can be picked.
   */
  @Prop() invalidDateMessage = 'Enter a date in the format shown.';

  /**
   * Text to be displayed as the datepicker label.
   */
  @Prop() label?: string;

  /**
   * The locale used for month and weekday names, as a BCP 47 language tag such as `en-US` or `fr`.
   * Defaults to the nearest `lang` attribute, then the browser's language.
   */
  @Prop() locale?: string;

  /**
   * The latest date that can be picked, as `YYYY-MM-DD`.
   */
  @Prop() max?: string;

  /**
   * The earliest date that can be picked, as `YYYY-MM-DD`.
   */
  @Prop() min?: string;

  /**
   * The minutes the time picker steps by, such as `15` or `30`.
   */
  @Prop() minuteIncrement = 1;

  /**
   * Accessible label for the minute in the time picker.
   */
  @Prop() minuteLabel = 'Minute';

  /**
   * Accessible label for the month dropdown, when `show-dropdowns` is set.
   */
  @Prop() monthLabel = 'Month';

  /**
   * Specifies the name. Submitted with the form name/value pair.
   */
  @Prop() name?: string;

  /**
   * Accessible label for the button that shows the next month.
   */
  @Prop() nextMonthLabel = 'Next month';

  /**
   * Accessible label for the AM or PM choice in the time picker, in locales with a 12-hour clock.
   */
  @Prop() periodLabel = 'AM or PM';

  /**
   * Specifies a short hint that describes the expected value of the field. Defaults to the format
   * the field takes, such as `YYYY-MM-DD`.
   */
  @Prop() placeholder?: string;

  /**
   * The placement of the calendar relative to the field.
   */
  @Prop() placement: PlacementType = 'bottom-start';

  /**
   * Ranges listed beside the calendar in range mode. A comma-separated list of built-in keys
   * (`today`, `yesterday`, `last-7-days`, `last-30-days`, `last-90-days`, `this-month`,
   * `last-month`, `this-quarter`, `last-quarter`, `this-year`, `last-year`, `year-to-date`,
   * `last-12-months`), or an array of `{ key, label?, start?, end? }` to relabel built-ins or add
   * your own.
   */
  @Prop() presets?: string | DatepickerPreset[];

  /**
   * Accessible label for the button that shows the previous month.
   */
  @Prop() previousMonthLabel = 'Previous month';

  /**
   * Picks a range: a start and an end date, from two months side by side, applied with the Apply
   * button. The value is `YYYY-MM-DD/YYYY-MM-DD`.
   */
  @Prop() range = false;

  /**
   * Determines whether or not the datepicker is readonly.
   */
  @Prop() readonly?: boolean;

  /**
   * Determines whether or not the datepicker is required.
   */
  @Prop() required?: boolean;

  /**
   * Shows month and year dropdowns in place of the month heading, for jumping far, as to a birth year.
   */
  @Prop() showDropdowns = false;

  /**
   * Accessible label for the start time, in range mode with the time picker.
   */
  @Prop() startTimeLabel = 'Start time';

  /**
   * Adds hour and minute pickers below the calendar, and the value carries the time as
   * `YYYY-MM-DDTHH:mm`. The dates are applied with the Apply button.
   */
  @Prop() timePicker = false;

  /**
   * Accessible label for the time, with the time picker and a single date.
   */
  @Prop() timeLabel = 'Time';

  /**
   * Accessible label for the button that opens the calendar. The selected date is added to it.
   */
  @Prop() triggerLabel = 'Choose date';

  /**
   * The selected date as `YYYY-MM-DD`, or in range mode the range as `YYYY-MM-DD/YYYY-MM-DD`; with
   * the time picker, each date as `YYYY-MM-DDTHH:mm`. An empty string when nothing is selected.
   */
  @Prop({ mutable: true }) value?: string = '';

  /**
   * Accessible label for the year dropdown, when `show-dropdowns` is set.
   */
  @Prop() yearLabel = 'Year';

  /**
   * Emitted when the value changes.
   *
   * This event will not emit when programmatically setting the `value` property.
   */
  @Event() pdsDatepickerChange!: EventEmitter<DatepickerChangeEventDetail>;

  /**
   * Emitted when the datepicker loses focus: when focus leaves the field and the calendar.
   */
  @Event() pdsBlur!: EventEmitter<FocusEvent>;

  /**
   * Emitted when the datepicker gains focus: when focus moves into the field or the calendar from outside.
   */
  @Event() pdsFocus!: EventEmitter<FocusEvent>;

  @State() isOpen = false;


  /** The text in the field, which may not be a valid date yet. */
  @State() text = '';

  /** Whether the text in the field isn't a date that can be picked. */
  @State() textInvalid = false;

  /** The day the keyboard is on in the calendar, as `YYYY-MM-DD`. */
  @State() activeDate = '';

  /** The first month on view, as the first of the month, `YYYY-MM-DD`. */
  @State() viewMonth = '';

  /**
   * The dates being chosen, before Apply: range mode's start and end, or the time picker's date.
   * The end is empty while it's being picked.
   */
  @State() draftStart = '';
  @State() draftEnd = '';

  /** The time picker's times, as `HH:mm`. */
  @State() startTime = DEFAULT_START_TIME;
  @State() endTime = DEFAULT_END_TIME;

  /** Range mode: the day under the pointer or keyboard, previewing the end of the range. */
  @State() previewDate = '';

  /**
   * Opens the calendar and moves focus to the selected day, or today.
   */
  @Method()
  async open() {
    this.openCalendar(true);
  }

  /**
   * Closes the calendar.
   */
  @Method()
  async close() {
    this.closeCalendar(false);
  }

  /**
   * Sets focus on the datepicker's text field.
   */
  @Method()
  async setFocus() {
    await this.inputEl?.setFocus();
  }

  @Watch('value')
  protected valueChanged() {
    this.text = this.fieldText();
    this.textInvalid = false;
    this.updateFormValue();
  }

  @Watch('required')
  protected requiredChanged() {
    this.updateFormValue();
  }

  componentWillLoad() {
    this.text = this.fieldText();
  }

  connectedCallback() {
    if (this.el.attachInternals && !this.internals) {
      this.internals = this.el.attachInternals();
    }
  }

  componentDidLoad() {
    this.updateFormValue();
  }

  disconnectedCallback() {
    this.closeCalendar(false);
  }

  componentDidRender() {
    if (!this.isOpen || !this.dialogEl) return;

    if (!this.cleanupAutoUpdate) this.startPositioning();
    this.flushActiveDayFocus();
  }

  /** Focuses the active day once the calendar is placed: a hidden calendar can't take focus. */
  private flushActiveDayFocus() {
    if (!this.focusActiveDay || this.dialogEl?.style.visibility !== 'visible') return;

    this.focusActiveDay = false;
    this.dialogEl.querySelector<HTMLElement>(`[data-date="${this.activeDate}"]`)?.focus();
  }

  private get resolvedLocale(): string {
    return supportedLocale(this.locale || resolveLocale(this.el));
  }

  private get weekStart(): number {
    const day = this.firstDayOfWeek;
    if (typeof day === 'number' && Number.isInteger(day) && day >= 0 && day <= 6) return day;
    return localeFirstDayOfWeek(this.resolvedLocale);
  }

  private get minDate(): Date | null {
    return parseIsoDate(this.min);
  }

  private get maxDate(): Date | null {
    return parseIsoDate(this.max);
  }

  private get isInteractive(): boolean {
    return !this.disabled && !this.readonly;
  }

  /** How many months the calendar shows side by side. */
  private get monthCount(): number {
    return this.range ? 2 : 1;
  }

  /** Whether picks wait for Apply: always for a range, and for a date with a time. */
  private get hasFooter(): boolean {
    return this.range || this.timePicker;
  }

  private get resolvedPresets(): ResolvedPreset[] {
    return this.range ? resolvePresets(this.presets, today()) : [];
  }

  /** The committed value, parsed: one date, or a range's start and end. */
  private parsedValue(): DateTimeValue[] | null {
    if (this.range) {
      const [start, end, extra] = (this.value ?? '').split('/');
      const startValue = parseDateTime(start);
      const endValue = parseDateTime(end);
      return extra === undefined && startValue && endValue && compareDateTime(startValue, endValue) <= 0
        ? [startValue, endValue]
        : null;
    }
    const single = parseDateTime(this.value);
    return single ? [single] : null;
  }

  /** The format the field shows and reads, with a time when the time picker is on. */
  private get resolvedFormat(): string {
    return fieldFormat(this.format, this.timePicker, this.timePicker && clockFor(this.resolvedLocale).hour12);
  }

  /** What the field shows for the committed value. */
  private fieldText(): string {
    const parsed = this.parsedValue();
    if (!parsed) return this.value && !this.range && !parseDateTime(this.value) ? this.value : '';
    return parsed.map((part) => toFieldText(this.withTimePicker(part), this.resolvedFormat)).join(RANGE_SEPARATOR);
  }

  /** Drops a time the time picker doesn't show, or adds the default one it does. */
  private withTimePicker(value: DateTimeValue, fallback = DEFAULT_START_TIME): DateTimeValue {
    return { date: value.date, time: this.timePicker ? (value.time ?? fallback) : null };
  }

  private get fieldPlaceholder(): string {
    if (this.placeholder) return this.placeholder;
    const one = this.resolvedFormat;
    return this.range ? `${one}${RANGE_SEPARATOR}${one}` : one;
  }

  /** Loads the committed value into the draft the calendar edits. */
  private loadDraft(parts: DateTimeValue[] | null) {
    const [start, end] = parts ?? [];
    this.draftStart = start ? toIsoDate(start.date) : '';
    this.draftEnd = this.range && end ? toIsoDate(end.date) : '';
    this.startTime = start?.time ?? DEFAULT_START_TIME;
    this.endTime = end?.time ?? DEFAULT_END_TIME;
    this.previewDate = '';
  }

  /**
   * Opens the calendar. From the button or the keyboard, focus moves to the active day; from a
   * click in the field, it stays there so typing keeps working.
   */
  private openCalendar(focusDay: boolean) {
    if (!this.isInteractive || this.isOpen) return;

    const parts = this.parsedValue();
    this.loadDraft(parts);
    const start = (parts && parts[parts.length - 1].date) ?? today();

    this.showDate(clampDate(start, this.minDate, this.maxDate), true);
    this.focusActiveDay = focusDay;
    this.isOpen = true;
    document.addEventListener('pointerdown', this.onDocumentPointerDown, true);
  }

  private closeCalendar(returnFocus: boolean) {
    if (!this.isOpen) return;

    this.isOpen = false;
    this.stopPositioning();
    document.removeEventListener('pointerdown', this.onDocumentPointerDown, true);
    if (returnFocus) this.triggerEl?.focus();
  }

  /**
   * Makes a day the active one and brings it into view. With two months, a day already on view
   * doesn't move the view; `reset` lines the view up so the day is in the last month shown.
   */
  private showDate(date: Date, reset = false) {
    const first = firstOfMonth(date);
    const view = parseIsoDate(this.viewMonth);
    const lastView = view && addMonths(view, this.monthCount - 1);

    if (reset || !view || first < view) {
      this.viewMonth = toIsoDate(reset ? addMonths(first, 1 - this.monthCount) : first);
    } else if (lastView && first > lastView) {
      this.viewMonth = toIsoDate(addMonths(first, 1 - this.monthCount));
    }
    this.activeDate = toIsoDate(date);
  }

  private pickDate(date: Date) {
    if (isOutOfRange(date, this.minDate, this.maxDate)) return;

    if (this.range) {
      this.pickRangeDay(date);
    } else if (this.timePicker) {
      this.draftStart = toIsoDate(date);
      this.activeDate = this.draftStart;
    } else {
      this.commitValue(toIsoDate(date));
      this.closeCalendar(true);
    }
  }

  /**
   * The first pick starts a range and the second ends it. A day before the start moves the start,
   * and a pick after a finished range starts a new one.
   */
  private pickRangeDay(date: Date) {
    const start = parseIsoDate(this.draftStart);
    const iso = toIsoDate(date);

    if (!start || this.draftEnd) {
      this.draftStart = iso;
      this.draftEnd = '';
    } else if (date < start) {
      this.draftStart = iso;
    } else {
      this.draftEnd = iso;
    }
    this.previewDate = '';
    this.activeDate = iso;
  }

  /** Sets the value from the user, emitting the change event when it differs. */
  private commitValue(next: string, detail: Omit<DatepickerChangeEventDetail, 'value'> = {}) {
    const changed = next !== (this.value ?? '');
    this.value = next;
    this.text = this.fieldText();
    this.textInvalid = false;
    if (changed) this.pdsDatepickerChange.emit({ value: next, ...detail });
  }

  /** Commits one date, or a range with its start, end and matching preset. */
  private commitParts(parts: DateTimeValue[]) {
    if (!this.range) {
      this.commitValue(toValueString(parts[0]));
      return;
    }

    const [start, end] = parts;
    const preset = matchPreset(this.resolvedPresets, start.date, end.date);
    this.commitValue(`${toValueString(start)}/${toValueString(end)}`, {
      start: toValueString(start),
      end: toValueString(end),
      ...(preset ? { preset: preset.key } : {}),
    });
  }

  /** The draft as values, or `null` before a start is picked. A lone start is a one-day range. */
  private draftParts(): DateTimeValue[] | null {
    const startDate = parseIsoDate(this.draftStart);
    if (!startDate) return null;

    const start = this.withTimePicker({ date: startDate, time: this.startTime });
    if (!this.range) return [start];

    const end = this.withTimePicker({ date: parseIsoDate(this.draftEnd) ?? startDate, time: this.endTime });
    // An end time before the start time on the same day ends at the start.
    return [start, compareDateTime(end, start) < 0 ? { ...end, time: start.time } : end];
  }

  private onApply = () => {
    const parts = this.draftParts();
    if (!parts) return;

    this.commitParts(parts);
    this.closeCalendar(true);
  };

  private onCancel = () => {
    if (this.clearable) this.commitValue('');
    this.closeCalendar(true);
  };

  private onPresetClick = (event: MouseEvent, preset: ResolvedPreset) => {
    this.draftStart = toIsoDate(preset.start);
    this.draftEnd = toIsoDate(preset.end);
    this.previewDate = '';
    this.showDate(preset.end, true);
    // Safari doesn't focus a clicked button; keep focus in the dialog for Escape and the Tab trap.
    (event.currentTarget as HTMLElement).focus();
  };

  /** "Custom range" points to the calendar, where a range of your own is picked. */
  private onCustomRangeClick = () => {
    this.dialogEl?.querySelector<HTMLElement>('[data-date][tabindex="0"]')?.focus();
  };

  private onDocumentPointerDown = (event: PointerEvent) => {
    if (!event.composedPath().includes(this.el)) this.closeCalendar(false);
  };

  private isInside(node: Node | null): boolean {
    return !!node && (node === this.el || this.el.contains(node) || !!this.el.shadowRoot?.contains(node));
  }

  /**
   * Reports focus arriving from outside. Focus moving within the datepicker never reaches the host:
   * once retargeted, its target and related target are both the host, so the browser skips it.
   */
  private onHostFocusIn = (event: FocusEvent) => {
    if (!this.isInside(event.relatedTarget as Node | null)) this.pdsFocus.emit(event);
  };

  /**
   * The calendar is a modal dialog while focus is in it. Opened by a click in the field, focus stays
   * in the field and the calendar is a plain popup beside it. Set on the element rather than through
   * state: focus often moves in from `componentDidRender`, where a state change doesn't re-render.
   */
  private onCalendarFocusIn = () => {
    this.dialogEl?.setAttribute('aria-modal', 'true');
  };

  private onCalendarFocusOut = (event: FocusEvent) => {
    const next = event.relatedTarget as Node | null;
    if (next && !this.dialogEl?.contains(next)) this.dialogEl?.removeAttribute('aria-modal');
  };

  /** Closes the calendar and reports blur when focus leaves the datepicker, as when tabbing out. */
  private onHostFocusOut = (event: FocusEvent) => {
    const next = event.relatedTarget as Node | null;
    // No next target: focus fell to the page, as when a focused control is disabled; stay open.
    if (!next) return;
    if (this.isInside(next)) return;
    this.closeCalendar(false);
    this.pdsBlur.emit(event);
  };

  private startPositioning() {
    const reference = this.fieldReference();
    const floating = this.dialogEl;
    if (!reference || !floating) return;

    this.cleanupAutoUpdate = autoUpdate(reference, floating, () => {
      computePosition(reference, floating, {
        placement: this.placement,
        strategy: 'fixed',
        middleware: [offset(4), flip(), shift({ padding: 8 })],
      }).then(({ x, y }) => {
        Object.assign(floating.style, { left: `${x}px`, top: `${y}px`, visibility: 'visible' });
        this.flushActiveDayFocus();
      });
    });
  }

  private stopPositioning() {
    this.cleanupAutoUpdate?.();
    this.cleanupAutoUpdate = undefined;
  }

  /** The field's box, so the calendar lines up with it rather than with the label or messages. */
  private fieldReference(): Element | undefined {
    return this.inputEl?.shadowRoot?.querySelector('.pds-input__field-wrapper') ?? this.inputEl;
  }

  // Inner pds-input events stay inside: the datepicker reports its own change, as a date.
  private stopInnerEvent = (event: Event) => event.stopPropagation();

  /** A click in the field opens the calendar beside it; the button inside toggles it on its own. */
  private onFieldClick = (event: MouseEvent) => {
    if (this.triggerEl && event.composedPath().includes(this.triggerEl)) return;
    this.openCalendar(false);
  };

  /** Typing a date or range the calendar can show moves the open calendar to it. */
  private onTextInput = (event: CustomEvent<InputInputEventDetail>) => {
    event.stopPropagation();
    this.text = String(event.detail.value ?? '');
    if (!this.isOpen) return;

    const parts = this.parseText(this.text);
    if (!parts) return;
    this.loadDraft(parts);
    this.showDate(parts[parts.length - 1].date);
  };

  private onTextChange = (event: Event) => {
    event.stopPropagation();
    this.commitText();
  };

  /** The typed text as a date or range that can be picked, or `null`. */
  private parseText(text: string): DateTimeValue[] | null {
    const format = this.resolvedFormat;
    const parts = this.range ? parseRangeText(text, format) : [parseFieldText(text, format)];
    if (!parts || parts.some((part) => !part)) return null;
    if (parts.some((part) => isOutOfRange(part.date, this.minDate, this.maxDate))) return null;
    return parts.map((part, i) => this.withTimePicker(part, i === 1 ? DEFAULT_END_TIME : DEFAULT_START_TIME));
  }

  private commitText() {
    const text = this.text.trim();
    if (text === '') {
      this.commitValue('');
      return;
    }

    const parts = this.parseText(text);
    if (parts) {
      this.commitParts(parts);
    } else {
      this.textInvalid = true;
      this.updateFormValue();
    }
  }

  private onTextKeyDown = (event: CustomEvent<KeyboardEvent>) => {
    event.stopPropagation();
    const key = event.detail;
    if (key.altKey && key.key === 'ArrowDown') {
      key.preventDefault();
      if (this.isOpen) {
        this.focusActiveDay = true;
        this.flushActiveDayFocus();
      } else {
        this.openCalendar(true);
      }
    } else if (key.key === 'Escape' && this.isOpen) {
      this.closeCalendar(false);
    }
  };

  private onTriggerClick = () => {
    if (this.isOpen) {
      this.closeCalendar(true);
    } else {
      this.openCalendar(true);
    }
  };

  /** Whether the month before (`-1`) or after (`1`) the ones on view has a day in range. */
  private canShowMonth(direction: -1 | 1): boolean {
    const view = parseIsoDate(this.viewMonth) ?? today();
    if (direction < 0) return !this.minDate || addDays(view, -1) >= this.minDate;
    return !this.maxDate || addMonths(view, this.monthCount) <= this.maxDate;
  }

  private showMonth(event: MouseEvent, direction: -1 | 1) {
    const view = parseIsoDate(this.viewMonth) ?? today();
    const active = parseIsoDate(this.activeDate) ?? today();
    this.viewMonth = toIsoDate(addMonths(view, direction));
    this.activeDate = toIsoDate(clampDate(addMonths(active, direction), this.minDate, this.maxDate));

    if (this.canShowMonth(direction)) {
      // Safari doesn't focus a clicked button; without this, focus falls to the page and Escape and
      // the Tab trap stop working.
      (event.currentTarget as HTMLElement).focus();
    } else {
      // The button is about to be disabled, which would drop focus.
      this.focusActiveDay = true;
    }
  }

  /** Shows the chosen month in the calendar at `index`, from the month or year dropdown. */
  private jumpTo(index: number, year: number, month: number) {
    const target = clampDate(new Date(Date.UTC(year, month, 1)), this.minDate, this.maxDate);
    this.viewMonth = toIsoDate(addMonths(firstOfMonth(target), -index));

    const active = parseIsoDate(this.activeDate) ?? target;
    const day = Math.min(active.getUTCDate(), new Date(Date.UTC(year, month + 1, 0)).getUTCDate());
    this.activeDate = toIsoDate(clampDate(new Date(Date.UTC(year, month, day)), this.minDate, this.maxDate));
  }

  private onDialogKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      this.closeCalendar(true);
    } else if (event.key === 'Tab') {
      this.trapTab(event);
    }
  };

  /** Keeps Tab within the calendar while it's open, as in a modal dialog. */
  private trapTab(event: KeyboardEvent) {
    const focusable = Array.from(
      this.dialogEl?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), select:not([disabled]), [data-date][tabindex="0"]',
      ) ?? [],
    );
    if (focusable.length === 0) return;

    const current = this.el.shadowRoot?.activeElement;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && current === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && current === last) {
      event.preventDefault();
      first.focus();
    }
  }

  private onGridKeyDown = (event: KeyboardEvent) => {
    const active = parseIsoDate(this.activeDate);
    if (!active) return;

    const rtl = getComputedStyle(this.el).direction === 'rtl';
    const column = weekdayColumn(active, this.weekStart);
    let next: Date | null = null;

    switch (event.key) {
      case 'ArrowLeft':
        next = addDays(active, rtl ? 1 : -1);
        break;
      case 'ArrowRight':
        next = addDays(active, rtl ? -1 : 1);
        break;
      case 'ArrowUp':
        next = addDays(active, -7);
        break;
      case 'ArrowDown':
        next = addDays(active, 7);
        break;
      case 'Home':
        next = addDays(active, -column);
        break;
      case 'End':
        next = addDays(active, 6 - column);
        break;
      case 'PageUp':
        next = addMonths(active, event.shiftKey ? -12 : -1);
        break;
      case 'PageDown':
        next = addMonths(active, event.shiftKey ? 12 : 1);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.pickDate(active);
        if (this.hasFooter) this.focusActiveDay = true;
        return;
      default:
        return;
    }

    event.preventDefault();
    const target = clampDate(next, this.minDate, this.maxDate);
    this.showDate(target);
    if (this.range) this.previewDate = toIsoDate(target);
    this.focusActiveDay = true;
  };

  /** The day under an event in a grid, from its cell. */
  private dayFromEvent(event: Event): Date | null {
    const cell = (event.target as HTMLElement | null)?.closest?.('[data-date]') as HTMLElement | null;
    return parseIsoDate(cell?.dataset.date);
  }

  // One handler per grid rather than per day, so hovering doesn't rebuild 84 closures each render.
  private onGridClick = (event: MouseEvent) => {
    const date = this.dayFromEvent(event);
    if (date) this.pickDate(date);
  };

  private onGridPointerOver = (event: PointerEvent) => {
    if (!this.range || !this.draftStart || this.draftEnd) return;
    const date = this.dayFromEvent(event);
    const iso = date && toIsoDate(date);
    if (iso && iso !== this.previewDate) this.previewDate = iso;
  };

  /**
   * Submits the value and reports validity to the form, as pds-input does: `required` with no
   * value, or typed text that isn't a date, blocks submission.
   */
  private updateFormValue() {
    if (isSpecTest() || !this.internals?.setFormValue) return;
    this.internals.setFormValue(this.value || null);
    if (!this.internals.setValidity) return;

    const anchor = this.inputEl?.shadowRoot?.querySelector('input') ?? undefined;
    if (this.textInvalid) {
      this.internals.setValidity({ badInput: true }, this.invalidDateMessage, anchor);
    } else if (this.required && !this.value) {
      this.internals.setValidity({ valueMissing: true }, anchor?.validationMessage || this.invalidDateMessage, anchor);
    } else {
      this.internals.setValidity({});
    }
  }

  formResetCallback() {
    this.value = '';
    // The value may already be empty, so its watcher wouldn't clear typed text.
    this.text = '';
    this.textInvalid = false;
    this.closeCalendar(false);
    this.updateFormValue();
  }

  formDisabledCallback(disabled: boolean) {
    this.disabled = disabled;
    if (disabled) this.closeCalendar(false);
  }

  formStateRestoreCallback(state: string | FormData | null) {
    if (typeof state === 'string') this.value = state;
  }

  private triggerAccessibleName(locale: string): string {
    const parts = this.parsedValue();
    if (!parts) return this.triggerLabel;

    const dates = parts.map((part) => formatDate(part.date, locale, FULL_DATE));
    return `${this.triggerLabel}, ${dates.join(RANGE_SEPARATOR)}`;
  }

  /** The range to highlight: the chosen one, or the start to the previewed day while picking the end. */
  private highlightedRange(): [Date | null, Date | null] {
    const start = parseIsoDate(this.draftStart);
    const end = parseIsoDate(this.draftEnd);
    if (!start || end) return [start, end];

    const preview = parseIsoDate(this.previewDate);
    return [start, preview && preview > start ? preview : null];
  }

  /** The day shown as selected: the committed one, or the time picker's draft. */
  private selectedDay(): Date | null {
    if (this.range) return null;
    return this.timePicker ? parseIsoDate(this.draftStart) : (this.parsedValue()?.[0].date ?? null);
  }

  private renderMonthHeading(view: Date, index: number, locale: string, headingId: string) {
    const heading = formatDate(view, locale, { month: 'long', year: 'numeric' });
    if (!this.showDropdowns) {
      return (
        <div class="pds-datepicker__heading" id={headingId} aria-live="polite">
          {heading}
        </div>
      );
    }

    const year = view.getUTCFullYear();
    const month = view.getUTCMonth();
    const min = this.minDate;
    const max = this.maxDate;
    const thisYear = today().getUTCFullYear();
    const firstYear = min ? min.getUTCFullYear() : thisYear - DROPDOWN_YEARS;
    const lastYear = max ? max.getUTCFullYear() : thisYear + DROPDOWN_YEARS;
    const monthName = dateFormatter(locale, { month: 'long' });

    return (
      <div class="pds-datepicker__dropdowns">
        <span class="visually-hidden" id={headingId} aria-live="polite">
          {heading}
        </span>
        <span class="pds-datepicker__select-wrap">
          <select
            class="pds-datepicker__heading-select"
            aria-label={this.monthLabel}
            onChange={(event) => this.jumpTo(index, year, Number((event.target as HTMLSelectElement).value))}
          >
            {Array.from({ length: 12 }, (_, m) => {
              const outside =
                (!!min && new Date(Date.UTC(year, m + 1, 0)) < min) || (!!max && new Date(Date.UTC(year, m, 1)) > max);
              return (
                <option value={String(m)} selected={m === month} disabled={outside}>
                  {monthName.format(new Date(Date.UTC(year, m, 1)))}
                </option>
              );
            })}
          </select>
          <pds-icon class="pds-datepicker__select-caret" icon={caretDown} size="small" aria-hidden="true" />
        </span>
        <span class="pds-datepicker__select-wrap">
          <select
            class="pds-datepicker__heading-select"
            aria-label={this.yearLabel}
            onChange={(event) => this.jumpTo(index, Number((event.target as HTMLSelectElement).value), month)}
          >
            {Array.from({ length: Math.max(lastYear, year) - Math.min(firstYear, year) + 1 }, (_, i) => {
              const y = Math.min(firstYear, year) + i;
              return (
                <option value={String(y)} selected={y === year}>
                  {y}
                </option>
              );
            })}
          </select>
          <pds-icon class="pds-datepicker__select-caret" icon={caretDown} size="small" aria-hidden="true" />
        </span>
      </div>
    );
  }

  private renderMonth(view: Date, index: number, locale: string) {
    const year = view.getUTCFullYear();
    const month = view.getUTCMonth();
    const min = this.minDate;
    const max = this.maxDate;
    const selected = this.selectedDay();
    const [rangeStart, rangeEnd] = this.range ? this.highlightedRange() : [null, null];
    const now = today();
    const fullDate = dateFormatter(locale, FULL_DATE);
    const dayNumber = dateFormatter(locale, { day: 'numeric' });
    const headingId = `${this.componentId}-calendar-heading-${index}`;
    const isFirst = index === 0;
    const isLast = index === this.monthCount - 1;

    return (
      <div class="pds-datepicker__month">
        <div class="pds-datepicker__header">
          {isFirst ? (
            <button
              type="button"
              class="pds-datepicker__nav pds-datepicker__nav--previous"
              aria-label={this.previousMonthLabel}
              disabled={!this.canShowMonth(-1)}
              onClick={(event) => this.showMonth(event, -1)}
            >
              <pds-icon icon={caretLeft} aria-hidden="true" />
            </button>
          ) : (
            <span class="pds-datepicker__nav-spacer" />
          )}
          {this.renderMonthHeading(view, index, locale, headingId)}
          {isLast ? (
            <button
              type="button"
              class="pds-datepicker__nav pds-datepicker__nav--next"
              aria-label={this.nextMonthLabel}
              disabled={!this.canShowMonth(1)}
              onClick={(event) => this.showMonth(event, 1)}
            >
              <pds-icon icon={caretRight} aria-hidden="true" />
            </button>
          ) : (
            <span class="pds-datepicker__nav-spacer" />
          )}
        </div>

        <table
          class="pds-datepicker__grid"
          role="grid"
          aria-labelledby={headingId}
          aria-multiselectable={this.range ? 'true' : null}
          onKeyDown={this.onGridKeyDown}
          onClick={this.onGridClick}
          onPointerOver={this.onGridPointerOver}
        >
          <thead>
            <tr>
              {weekdayNames(locale, this.weekStart).map((name) => (
                <th scope="col" class="pds-datepicker__weekday">
                  <span aria-hidden="true">{name.short}</span>
                  <span class="visually-hidden">{name.long}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {monthWeeks(year, month, this.weekStart).map((week) => (
              <tr>
                {week.map((date, column) => {
                  if (!date) return <td class="pds-datepicker__day pds-datepicker__day--empty" />;

                  const iso = toIsoDate(date);
                  const unavailable = isOutOfRange(date, min, max);
                  const isEndpoint = isSameDay(date, rangeStart) || isSameDay(date, rangeEnd);
                  // A range's ends are capped on their outer side; a lone day stays round.
                  const spansDays = !!rangeStart && !!rangeEnd && !isSameDay(rangeStart, rangeEnd);
                  const inRange = !!rangeStart && !!rangeEnd && date >= rangeStart && date <= rangeEnd;
                  const isSelected = isSameDay(date, selected) || isEndpoint || inRange;
                  const isToday = isSameDay(date, now);
                  return (
                    <td
                      class={{
                        'pds-datepicker__day': true,
                        'pds-datepicker__day--selected': isSameDay(date, selected) || isEndpoint,
                        'pds-datepicker__day--in-range': inRange && !isEndpoint,
                        'pds-datepicker__day--range-start': spansDays && isSameDay(date, rangeStart),
                        'pds-datepicker__day--range-end': spansDays && isSameDay(date, rangeEnd),
                        'pds-datepicker__day--row-start': inRange && column === 0,
                        'pds-datepicker__day--row-end': inRange && column === 6,
                        'pds-datepicker__day--today': isToday,
                        'pds-datepicker__day--disabled': unavailable,
                      }}
                      data-date={iso}
                      tabindex={iso === this.activeDate ? '0' : '-1'}
                      aria-label={fullDate.format(date)}
                      aria-selected={isSelected ? 'true' : null}
                      aria-current={isToday ? 'date' : null}
                      aria-disabled={unavailable ? 'true' : null}
                    >
                      {dayNumber.format(date)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>

        {this.timePicker && this.renderTime(index === 0 ? 'start' : 'end', locale)}
      </div>
    );
  }

  /** Hour, minute and (on a 12-hour clock) AM/PM pickers for the start or end time. */
  private renderTime(which: 'start' | 'end', locale: string) {
    const time = which === 'start' ? this.startTime : this.endTime;
    const [hours, minutes] = splitTime(time);
    const clock = clockFor(locale);
    const step = Math.max(1, Math.min(60, Math.floor(this.minuteIncrement) || 1));
    // Not `h`: that's the JSX factory.
    const setTime = (hour: number, minute: number) => {
      if (which === 'start') this.startTime = joinTime(hour, minute);
      else this.endTime = joinTime(hour, minute);
    };
    const groupLabel = !this.range ? this.timeLabel : which === 'start' ? this.startTimeLabel : this.endTimeLabel;
    const isPm = hours >= 12;
    const hourOptions = clock.hour12 ? Array.from({ length: 12 }, (_, i) => i + 1) : Array.from({ length: 24 }, (_, i) => i);
    const shownHour = clock.hour12 ? hours % 12 || 12 : hours;
    const minuteOptions = Array.from({ length: Math.ceil(60 / step) }, (_, i) => i * step);
    // A time off the step stays listed, so the select never shows a different minute than the value.
    if (!minuteOptions.includes(minutes)) minuteOptions.push(minutes);
    minuteOptions.sort((a, b) => a - b);

    const labelId = `${this.componentId}-time-${which}`;

    return (
      <div class="pds-datepicker__time" role="group" aria-labelledby={labelId}>
        <span class="pds-datepicker__time-label" id={labelId}>
          {groupLabel}
        </span>
        <span class="pds-datepicker__time-field">
          <select
            class="pds-datepicker__time-select"
            aria-label={this.hourLabel}
            onChange={(event) => {
              const picked = Number((event.target as HTMLSelectElement).value);
              setTime(clock.hour12 ? (picked % 12) + (isPm ? 12 : 0) : picked, minutes);
            }}
          >
            {hourOptions.map((hour) => (
              <option value={String(hour)} selected={hour === shownHour}>
                {clock.hour12 ? String(hour) : String(hour).padStart(2, '0')}
              </option>
            ))}
          </select>
          <span class="pds-datepicker__time-separator" aria-hidden="true">
            :
          </span>
          <select
            class="pds-datepicker__time-select"
            aria-label={this.minuteLabel}
            onChange={(event) => setTime(hours, Number((event.target as HTMLSelectElement).value))}
          >
            {minuteOptions.map((m) => (
              <option value={String(m)} selected={m === minutes}>
                {String(m).padStart(2, '0')}
              </option>
            ))}
          </select>
          {clock.hour12 && (
            <select
              class="pds-datepicker__time-select pds-datepicker__time-select--period"
              aria-label={this.periodLabel}
              onChange={(event) => {
                const pm = (event.target as HTMLSelectElement).value === 'pm';
                setTime((hours % 12) + (pm ? 12 : 0), minutes);
              }}
            >
              <option value="am" selected={!isPm}>
                {clock.am}
              </option>
              <option value="pm" selected={isPm}>
                {clock.pm}
              </option>
            </select>
          )}
        </span>
      </div>
    );
  }

  private renderPresets() {
    const presets = this.resolvedPresets;
    if (presets.length === 0) return null;

    const current = matchPreset(presets, parseIsoDate(this.draftStart), parseIsoDate(this.draftEnd));
    const isCustom = !current && !!this.draftStart;
    return (
      <div class="pds-datepicker__presets-column">
        <ul class="pds-datepicker__presets" part="presets">
          {presets.map((preset) => {
            const isCurrent = preset === current;
            return (
              <li>
                <button
                  type="button"
                  class={{ 'pds-datepicker__preset': true, 'pds-datepicker__preset--selected': isCurrent }}
                  aria-pressed={isCurrent ? 'true' : 'false'}
                  disabled={!presetInRange(preset, this.minDate, this.maxDate)}
                  onClick={(event) => this.onPresetClick(event, preset)}
                >
                  <span>{preset.label}</span>
                  {isCurrent && <pds-icon icon={check} aria-hidden="true" />}
                </button>
              </li>
            );
          })}
          <li>
            <button
              type="button"
              class={{ 'pds-datepicker__preset': true, 'pds-datepicker__preset--selected': isCustom }}
              onClick={this.onCustomRangeClick}
            >
              <span>{this.customRangeLabel}</span>
              {isCustom && <pds-icon icon={check} aria-hidden="true" />}
            </button>
          </li>
        </ul>
      </div>
    );
  }

  private renderFooter() {
    const parts = this.draftParts();
    const selection = parts
      ? this.range && !this.draftEnd
        ? `${toFieldText(parts[0], this.resolvedFormat)}${RANGE_SEPARATOR}`
        : parts.map((part) => toFieldText(part, this.resolvedFormat)).join(RANGE_SEPARATOR)
      : '';

    return (
      <div class="pds-datepicker__footer">
        <span class="pds-datepicker__selection" aria-live="polite">
          {selection}
        </span>
        <button type="button" class="pds-datepicker__action" onClick={this.onCancel}>
          {this.clearable ? this.clearLabel : this.cancelLabel}
        </button>
        <button
          type="button"
          class="pds-datepicker__action pds-datepicker__action--primary"
          disabled={!parts}
          onClick={this.onApply}
        >
          {this.applyLabel}
        </button>
      </div>
    );
  }

  private renderCalendar(locale: string) {
    const view = parseIsoDate(this.viewMonth) ?? today();
    const months = Array.from({ length: this.monthCount }, (_, i) => addMonths(view, i));

    return (
      <div
        class={{ 'pds-datepicker__dialog': true, 'pds-datepicker__dialog--range': this.range }}
        id={`${this.componentId}-calendar`}
        role="dialog"
        aria-labelledby={this.range ? null : `${this.componentId}-calendar-heading-0`}
        aria-label={this.range ? this.label || this.triggerLabel : null}
        part="calendar"
        ref={(el) => (this.dialogEl = el)}
        onKeyDown={this.onDialogKeyDown}
        onFocusin={this.onCalendarFocusIn}
        onFocusout={this.onCalendarFocusOut}
      >
        {this.range && this.renderPresets()}
        <div class="pds-datepicker__panel">
          <div class="pds-datepicker__months">{months.map((month, index) => this.renderMonth(month, index, locale))}</div>
          {this.hasFooter && this.renderFooter()}
        </div>
      </div>
    );
  }

  render() {
    const locale = this.resolvedLocale;

    return (
      <Host
        class={{ 'pds-datepicker--range': this.range, 'pds-datepicker--time': this.timePicker }}
        full-width={this.fullWidth ? 'true' : null}
        onFocusin={this.onHostFocusIn}
        onFocusout={this.onHostFocusOut}
      >
        <pds-input
          ref={(el) => (this.inputEl = el)}
          componentId={this.componentId}
          label={this.label}
          hideLabel={this.hideLabel}
          helperMessage={this.helperMessage}
          errorMessage={this.errorMessage}
          invalid={this.invalid || this.textInvalid}
          disabled={this.disabled}
          readonly={this.readonly}
          required={this.required}
          placeholder={this.fieldPlaceholder}
          fullWidth={this.fullWidth}
          autocomplete="off"
          value={this.text}
          onClick={this.onFieldClick}
          onPdsInput={this.onTextInput}
          onPdsChange={this.onTextChange}
          onPdsKeyDown={this.onTextKeyDown}
          onPdsFocus={this.stopInnerEvent}
          onPdsBlur={this.stopInnerEvent}
        >
          <button
            slot="suffix"
            type="button"
            class="pds-datepicker__trigger"
            ref={(el) => (this.triggerEl = el)}
            aria-label={this.triggerAccessibleName(locale)}
            aria-haspopup="dialog"
            aria-expanded={this.isOpen ? 'true' : 'false'}
            aria-controls={this.isOpen ? `${this.componentId}-calendar` : null}
            disabled={!this.isInteractive}
            onClick={this.onTriggerClick}
          >
            <pds-icon icon={calendarSimple} aria-hidden="true" />
          </button>
        </pds-input>

        {this.isOpen && this.renderCalendar(locale)}
      </Host>
    );
  }
}
