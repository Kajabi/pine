import { parseIsoDate, toIsoDate } from './date-utils';

/** A day, with a wall-clock time when the time picker is on. No time zone, so it never shifts. */
export interface DateTimeValue {
  date: Date;
  /** `HH:mm`, 24-hour, or `null` without a time. */
  time: string | null;
}

const DATE_TIME = /^(\d{4}-\d{2}-\d{2})(?:[T ](\d{2}):(\d{2}))?$/;

/** Parses `YYYY-MM-DD`, `YYYY-MM-DDTHH:mm` or `YYYY-MM-DD HH:mm`. */
export function parseDateTime(text: string | null | undefined): DateTimeValue | null {
  const match = DATE_TIME.exec((text ?? '').trim());
  if (!match) return null;

  const date = parseIsoDate(match[1]);
  if (!date) return null;
  if (match[2] === undefined) return { date, time: null };

  const hours = Number(match[2]);
  const minutes = Number(match[3]);
  return hours < 24 && minutes < 60 ? { date, time: `${match[2]}:${match[3]}` } : null;
}

export const DEFAULT_FORMAT = 'YYYY-MM-DD';

// Longest tokens first, so `MM` isn't read as two `M`s.
const TOKENS = /YYYY|MM|M|DD|D|HH|H|hh|h|mm|A|a/g;
const HOUR_TOKEN = /HH|H|hh|h/;

/**
 * The field's format: the date format, with a time added when the time picker is on and it has
 * none, on the same clock as the time picker.
 */
export function fieldFormat(format: string | null | undefined, timePicker: boolean, hour12 = false): string {
  const date = format?.trim() || DEFAULT_FORMAT;
  if (!timePicker || HOUR_TOKEN.test(date)) return date;
  return `${date} ${hour12 ? 'h:mm A' : 'HH:mm'}`;
}

const pad = (n: number, width = 2) => String(n).padStart(width, '0');

/**
 * Writes a date in a format of tokens: `YYYY`, `MM`/`M` (month), `DD`/`D` (day), `HH`/`H` (24-hour),
 * `hh`/`h` (12-hour), `mm` (minutes) and `A`/`a` (AM/PM). Anything else is copied as is.
 */
export function formatWith(value: DateTimeValue, format: string): string {
  const [hours, minutes] = splitTime(value.time ?? '00:00');
  const hour12 = hours % 12 || 12;
  const parts: Record<string, string> = {
    YYYY: pad(value.date.getUTCFullYear(), 4),
    MM: pad(value.date.getUTCMonth() + 1),
    M: String(value.date.getUTCMonth() + 1),
    DD: pad(value.date.getUTCDate()),
    D: String(value.date.getUTCDate()),
    HH: pad(hours),
    H: String(hours),
    hh: pad(hour12),
    h: String(hour12),
    mm: pad(minutes),
    A: hours < 12 ? 'AM' : 'PM',
    a: hours < 12 ? 'am' : 'pm',
  };
  return format.replace(TOKENS, (token) => parts[token]);
}

const TOKEN_PATTERNS: Record<string, string> = {
  YYYY: '(\\d{4})',
  MM: '(\\d{1,2})',
  M: '(\\d{1,2})',
  DD: '(\\d{1,2})',
  D: '(\\d{1,2})',
  HH: '(\\d{1,2})',
  H: '(\\d{1,2})',
  hh: '(\\d{1,2})',
  h: '(\\d{1,2})',
  mm: '(\\d{2})',
  A: '([AaPp][Mm])',
  a: '([AaPp][Mm])',
};

/**
 * Reads typed text in a format of tokens, as written by `formatWith`. Leading zeros are optional
 * and spaces are loose, so `1/5/2026` reads as `MM/DD/YYYY`. Returns `null` for anything that
 * isn't a real date and time in that format.
 */
export function parseWith(text: string | null | undefined, format: string): DateTimeValue | null {
  const tokens: string[] = [];
  let pattern = '';
  let last = 0;
  format.replace(TOKENS, (token, offset: number) => {
    pattern += escapeLiteral(format.slice(last, offset));
    pattern += TOKEN_PATTERNS[token];
    tokens.push(token);
    last = offset + token.length;
    return token;
  });
  pattern += escapeLiteral(format.slice(last));

  const match = new RegExp(`^\\s*${pattern}\\s*$`).exec(text ?? '');
  if (!match) return null;

  const read: Record<string, string> = {};
  tokens.forEach((token, i) => (read[token] = match[i + 1]));

  const year = Number(read.YYYY);
  const month = Number(read.MM ?? read.M);
  const day = Number(read.DD ?? read.D);
  if (!read.YYYY || !month || !day) return null;
  const date = parseIsoDate(`${pad(year, 4)}-${pad(month)}-${pad(day)}`);
  if (!date) return null;

  const hourText = read.HH ?? read.H ?? read.hh ?? read.h;
  if (hourText === undefined) return { date, time: null };

  let hours = Number(hourText);
  const minutes = Number(read.mm ?? 0);
  const period = (read.A ?? read.a)?.toLowerCase();
  if (read.hh !== undefined || read.h !== undefined) {
    if (hours < 1 || hours > 12) return null;
    hours = (hours % 12) + (period === 'pm' ? 12 : 0);
  }
  return hours < 24 && minutes < 60 ? { date, time: joinTime(hours, minutes) } : null;
}

/** Escapes a format's literal text for a pattern, letting its spaces match any run of spaces. */
function escapeLiteral(literal: string): string {
  return literal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s*');
}

/** Reads one typed date in the format, falling back to ISO, which is always accepted. */
export function parseFieldText(text: string | null | undefined, format = DEFAULT_FORMAT): DateTimeValue | null {
  return parseWith(text, format) ?? parseDateTime(text);
}

/**
 * Parses a typed range: two dates (with times, optionally) joined by a dash or `to` with spaces
 * around it, as `2026-09-13 – 2026-10-13`, or by `/` when the format doesn't use slashes.
 */
export function parseRangeText(
  text: string | null | undefined,
  format = DEFAULT_FORMAT,
): [DateTimeValue, DateTimeValue] | null {
  const trimmed = (text ?? '').trim();
  let parts = trimmed.split(/\s+(?:–|—|-|to)\s+/i);
  if (parts.length !== 2 && !format.includes('/')) parts = trimmed.split(/\s*\/\s*/);
  if (parts.length !== 2) return null;

  const start = parseFieldText(parts[0], format);
  const end = parseFieldText(parts[1], format);
  return start && end && compareDateTime(start, end) <= 0 ? [start, end] : null;
}

export function compareDateTime(a: DateTimeValue, b: DateTimeValue): number {
  const byDay = a.date.getTime() - b.date.getTime();
  if (byDay !== 0) return byDay;
  return (a.time ?? '00:00').localeCompare(b.time ?? '00:00');
}

/** The value form: `YYYY-MM-DD`, or `YYYY-MM-DDTHH:mm` with a time. */
export function toValueString(value: DateTimeValue): string {
  return value.time ? `${toIsoDate(value.date)}T${value.time}` : toIsoDate(value.date);
}

/** The field form in a format, or by default `YYYY-MM-DD`, with ` HH:mm` when it has a time. */
export function toFieldText(value: DateTimeValue, format?: string): string {
  return formatWith(value, format ?? fieldFormat(DEFAULT_FORMAT, !!value.time));
}

export const RANGE_SEPARATOR = ' – ';

/** Hour and minute numbers from `HH:mm`. */
export function splitTime(time: string): [number, number] {
  const [hours, minutes] = time.split(':').map(Number);
  return [hours || 0, minutes || 0];
}

export function joinTime(hours: number, minutes: number): string {
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

/** Whether the locale writes times on a 12-hour clock, and its AM and PM words. */
export function clockFor(locale: string): { hour12: boolean; am: string; pm: string } {
  const format = new Intl.DateTimeFormat(locale, { hour: 'numeric', timeZone: 'UTC' });
  const hour12 = !!format.resolvedOptions().hour12;
  const period = (hour: number) =>
    format.formatToParts(new Date(Date.UTC(2023, 0, 1, hour))).find((part) => part.type === 'dayPeriod')?.value;
  return { hour12, am: period(1) ?? 'AM', pm: period(13) ?? 'PM' };
}
