import { addDays, addMonths, isOutOfRange, parseIsoDate } from './date-utils';
import type { DatepickerPreset } from './datepicker-interface';

/** A preset resolved against today: what the panel lists and matches the range against. */
export interface ResolvedPreset {
  key: string;
  label: string;
  start: Date;
  end: Date;
}

const DEFAULT_LABELS: Record<string, string | undefined> = {
  'today': 'Today',
  'yesterday': 'Yesterday',
  'last-7-days': 'Last 7 days',
  'last-30-days': 'Last 30 days',
  'last-90-days': 'Last 90 days',
  'this-month': 'This month',
  'last-month': 'Last month',
  'this-quarter': 'This quarter',
  'last-quarter': 'Last quarter',
  'this-year': 'This year',
  'last-year': 'Last year',
  'year-to-date': 'Year to date',
  'last-12-months': 'Last 12 months',
};

const utc = (year: number, month: number, day: number) => new Date(Date.UTC(year, month, day));

/**
 * The range a built-in preset covers on the given day, or `null` for an unknown key. "Last N days"
 * is N days ending today; "this" and "last" periods are whole periods; "to date" ends today.
 */
export function builtInPresetRange(key: string, now: Date): [Date, Date] | null {
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth();
  const quarterStart = month - (month % 3);

  switch (key) {
    case 'today':
      return [now, now];
    case 'yesterday':
      return [addDays(now, -1), addDays(now, -1)];
    case 'last-7-days':
      return [addDays(now, -6), now];
    case 'last-30-days':
      return [addDays(now, -29), now];
    case 'last-90-days':
      return [addDays(now, -89), now];
    case 'this-month':
      return [utc(year, month, 1), utc(year, month + 1, 0)];
    case 'last-month':
      return [utc(year, month - 1, 1), utc(year, month, 0)];
    case 'this-quarter':
      return [utc(year, quarterStart, 1), utc(year, quarterStart + 3, 0)];
    case 'last-quarter':
      return [utc(year, quarterStart - 3, 1), utc(year, quarterStart, 0)];
    case 'this-year':
      return [utc(year, 0, 1), utc(year, 11, 31)];
    case 'last-year':
      return [utc(year - 1, 0, 1), utc(year - 1, 11, 31)];
    case 'year-to-date':
      return [utc(year, 0, 1), now];
    case 'last-12-months':
      return [addMonths(now, -12), now];
    default:
      return null;
  }
}

const isWholeNumber = (value: unknown): value is number => typeof value === 'number' && Number.isInteger(value);

/** A preset's offset range: whole days from today, a missing one being today. `null` if unusable. */
export function offsetPresetRange(preset: DatepickerPreset, now: Date): [Date, Date] | null {
  const { startOffset, endOffset } = preset;
  if (startOffset === undefined && endOffset === undefined) return null;
  // Checked at runtime, as offsets often come from JSON.
  if (startOffset !== undefined && !isWholeNumber(startOffset)) return null;
  if (endOffset !== undefined && !isWholeNumber(endOffset)) return null;

  const start = addDays(now, startOffset ?? 0);
  const end = addDays(now, endOffset ?? 0);
  return start <= end ? [start, end] : null;
}

// The list is re-resolved on every read, so each warning is said once.
const warned = new Set<string>();

function warnOnce(message: string) {
  if (warned.has(message)) return;
  warned.add(message);
  console.warn(`PDS Datepicker: ${message}`);
}

/**
 * Normalizes the `presets` prop: a comma-separated list of built-in keys, or an array of presets
 * that may relabel a built-in or give their own range. Unusable entries are dropped with a warning.
 */
export function resolvePresets(presets: string | DatepickerPreset[] | undefined, now: Date): ResolvedPreset[] {
  const entries: DatepickerPreset[] =
    typeof presets === 'string'
      ? presets
          .split(',')
          .map((key) => key.trim())
          .filter(Boolean)
          .map((key) => ({ key }))
      : Array.isArray(presets)
      ? presets
      : [];

  const resolved: ResolvedPreset[] = [];
  for (const preset of entries) {
    // Presets often come from parsed JSON, so check types at runtime: a non-string label would
    // otherwise reach the render as an object, which Stencil can turn into nodes.
    if (!preset || typeof preset.key !== 'string') {
      warnOnce('a preset with no string key was left out.');
      continue;
    }
    const start = typeof preset.start === 'string' ? parseIsoDate(preset.start) : null;
    const end = typeof preset.end === 'string' ? parseIsoDate(preset.end) : null;
    // Fixed days, then offsets, then the built-in range.
    const fixed: [Date, Date] | null = start !== null && end !== null && start <= end ? [start, end] : null;
    const range: [Date, Date] | null = fixed ?? offsetPresetRange(preset, now) ?? builtInPresetRange(preset.key, now);
    // A blank label would leave the button unnamed.
    const label = typeof preset.label === 'string' && preset.label.trim() !== '' ? preset.label : DEFAULT_LABELS[preset.key];
    if (range === null) {
      warnOnce(`preset "${preset.key}" has no usable range and was left out. Give it whole-day startOffset/endOffset or YYYY-MM-DD start/end, start first.`);
      continue;
    }
    if (label === undefined) {
      warnOnce(`preset "${preset.key}" has no label and was left out.`);
      continue;
    }
    resolved.push({ key: preset.key, label, start: range[0], end: range[1] });
  }
  return resolved;
}

/** The first preset covering exactly this range. */
export function matchPreset(presets: ResolvedPreset[], start: Date | null, end: Date | null): ResolvedPreset | undefined {
  if (!start || !end) return undefined;
  return presets.find((preset) => preset.start.getTime() === start.getTime() && preset.end.getTime() === end.getTime());
}

/** Whether a preset's whole range can be picked within `min` and `max`. */
export function presetInRange(preset: ResolvedPreset, min: Date | null, max: Date | null): boolean {
  return !isOutOfRange(preset.start, min, max) && !isOutOfRange(preset.end, min, max);
}
