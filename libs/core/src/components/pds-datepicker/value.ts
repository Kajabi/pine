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

/**
 * A format's parts: `[text]` is literal text, and the tokens are `YYYY`, `MMMM` (month name),
 * `MMM` (short month name), `MM`/`M` (month), `DD`/`D` (day), `HH`/`H` (24-hour), `hh`/`h`
 * (12-hour), `mm` (minutes) and `A`/`a` (AM/PM). Longest tokens first, so `MM` isn't read as two
 * `M`s. Anything else is copied as is.
 */
const FORMAT_PARTS = /\[([^\]]*)\]|YYYY|MMMM|MMM|MM|M|DD|D|HH|H|hh|h|mm|A|a/g;
const HOUR_TOKEN = /HH|H|hh|h/;
const TWELVE_HOUR_TOKEN = /hh|h/;
const PERIOD_TOKEN = /A|a/;

/** Without its `[literal]` parts, to test which tokens a format uses. */
const tokensOnly = (format: string) => format.replace(/\[[^\]]*\]/g, '');

/**
 * The field's format: the date format, with a time added when the time picker is on and it has
 * none, on the same clock as the time picker. A 12-hour format gets AM/PM if it has none, as
 * `1:30` alone can't say which.
 */
export function fieldFormat(format: string | null | undefined, timePicker: boolean, hour12 = false): string {
  const date = format?.trim() || DEFAULT_FORMAT;
  const tokens = tokensOnly(date);
  if (TWELVE_HOUR_TOKEN.test(tokens) && !PERIOD_TOKEN.test(tokens)) return `${date} A`;
  if (!timePicker || HOUR_TOKEN.test(tokens)) return date;
  return `${date} ${hour12 ? 'h:mm A' : 'HH:mm'}`;
}

const pad = (n: number, width = 2) => String(n).padStart(width, '0');

interface LocaleWords {
  months: string[];
  shortMonths: string[];
  am: string;
  pm: string;
}

const wordsCache = new Map<string, LocaleWords>();

/** Month names and AM/PM words in the locale, on the Gregorian calendar. */
function localeWords(locale: string): LocaleWords {
  let words = wordsCache.get(locale);
  if (!words) {
    const month = (style: 'long' | 'short') => {
      const format = new Intl.DateTimeFormat(locale, {
        month: style,
        timeZone: 'UTC',
        calendar: 'gregory',
      } as Intl.DateTimeFormatOptions);
      return Array.from({ length: 12 }, (_, m) => format.format(new Date(Date.UTC(2023, m, 1))));
    };
    const clock = clockFor(locale);
    words = { months: month('long'), shortMonths: month('short'), am: clock.am, pm: clock.pm };
    wordsCache.set(locale, words);
  }
  return words;
}

/** Writes a date in a format of tokens (see `FORMAT_PARTS`), with month names and AM/PM in the locale. */
export function formatWith(value: DateTimeValue, format: string, locale = 'en-US'): string {
  const words = localeWords(locale);
  const [hours, minutes] = splitTime(value.time ?? '00:00');
  const hour12 = hours % 12 || 12;
  const month = value.date.getUTCMonth();
  const period = hours < 12 ? words.am : words.pm;
  const parts: Record<string, string> = {
    YYYY: pad(value.date.getUTCFullYear(), 4),
    MMMM: words.months[month],
    MMM: words.shortMonths[month],
    MM: pad(month + 1),
    M: String(month + 1),
    DD: pad(value.date.getUTCDate()),
    D: String(value.date.getUTCDate()),
    HH: pad(hours),
    H: String(hours),
    hh: pad(hour12),
    h: String(hour12),
    mm: pad(minutes),
    A: period,
    a: period.toLowerCase(),
  };
  return format.replace(FORMAT_PARTS, (token, literal: string | undefined) => literal ?? parts[token]);
}

const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Escapes a format's literal text for a pattern, letting its spaces match any run of spaces. */
const literalPattern = (literal: string) => escapeRegExp(literal).replace(/\s+/g, '\\s*');

const alternatives = (words: string[]) => `(${words.map(escapeRegExp).join('|')})`;

/**
 * Reads typed text in a format of tokens, as written by `formatWith`. Leading zeros are optional,
 * spaces are loose, and month names and AM/PM are matched without regard to case, in the locale or
 * in English. Returns `null` for anything that isn't a real date and time in that format.
 */
export function parseWith(text: string | null | undefined, format: string, locale = 'en-US'): DateTimeValue | null {
  const words = localeWords(locale);
  const english = localeWords('en-US');
  const periods = [words.am, words.pm, english.am, english.pm];
  const patterns: Record<string, string> = {
    YYYY: '(\\d{4})',
    MMMM: alternatives([...words.months, ...english.months]),
    MMM: alternatives([...words.shortMonths, ...english.shortMonths]),
    MM: '(\\d{1,2})',
    M: '(\\d{1,2})',
    DD: '(\\d{1,2})',
    D: '(\\d{1,2})',
    HH: '(\\d{1,2})',
    H: '(\\d{1,2})',
    hh: '(\\d{1,2})',
    h: '(\\d{1,2})',
    mm: '(\\d{2})',
    A: alternatives(periods),
    a: alternatives(periods),
  };

  const tokens: string[] = [];
  const build = () => {
    tokens.length = 0;
    let pattern = '';
    let last = 0;
    format.replace(FORMAT_PARTS, (token: string, literal: string | undefined, offset: number) => {
      pattern += literalPattern(format.slice(last, offset));
      if (literal !== undefined) {
        pattern += literalPattern(literal);
      } else {
        pattern += patterns[token];
        tokens.push(token);
      }
      last = offset + token.length;
      return token;
    });
    return new RegExp(`^\\s*${pattern}${literalPattern(format.slice(last))}\\s*$`, 'i');
  };

  // Two-digit minutes first, so a format with no separator, as `HHmm`, still reads `930` as 9:30;
  // then one digit, as leading zeros are optional.
  let match = build().exec(text ?? '');
  if (!match) {
    patterns.mm = '(\\d{1,2})';
    match = build().exec(text ?? '');
  }
  if (!match) return null;

  const found = match;
  const read: Record<string, string> = {};
  tokens.forEach((token, i) => (read[token] = found[i + 1]));

  const monthIndex = (name: string | undefined, long: boolean) => {
    if (name === undefined) return undefined;
    const lists = long ? [words.months, english.months] : [words.shortMonths, english.shortMonths];
    for (const list of lists) {
      const index = list.findIndex((candidate) => candidate.toLowerCase() === name.toLowerCase());
      if (index >= 0) return index + 1;
    }
    return undefined;
  };

  const year = Number(read.YYYY);
  const month = monthIndex(read.MMMM, true) ?? monthIndex(read.MMM, false) ?? Number(read.MM ?? read.M);
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
    const pm = period === words.pm.toLowerCase() || period === english.pm.toLowerCase();
    hours = (hours % 12) + (pm ? 12 : 0);
  }
  return hours < 24 && minutes < 60 ? { date, time: joinTime(hours, minutes) } : null;
}

/** Reads one typed date in the format, falling back to ISO, which is always accepted. */
export function parseFieldText(
  text: string | null | undefined,
  format = DEFAULT_FORMAT,
  locale = 'en-US',
): DateTimeValue | null {
  return parseWith(text, format, locale) ?? parseDateTime(text);
}

/**
 * Parses a typed range: two dates (with times, optionally) joined by a dash or `to` with spaces
 * around it, as `2026-09-13 – 2026-10-13`, or by `/` when the format doesn't use slashes. The
 * split is tried at each separator until both halves read as dates, so a format that itself has a
 * spaced dash, as `D - M - YYYY`, still works.
 */
export function parseRangeText(
  text: string | null | undefined,
  format = DEFAULT_FORMAT,
  locale = 'en-US',
): [DateTimeValue, DateTimeValue] | null {
  const trimmed = (text ?? '').trim();
  const separators = new RegExp(
    `${escapeRegExp(RANGE_SEPARATOR)}|\\s+(?:–|—|-|to)\\s+${format.includes('/') ? '' : '|\\s*/\\s*'}`,
    'gi',
  );

  let found: RegExpExecArray | null;
  while ((found = separators.exec(trimmed)) !== null) {
    const start = parseFieldText(trimmed.slice(0, found.index), format, locale);
    const end = parseFieldText(trimmed.slice(found.index + found[0].length), format, locale);
    if (start && end) return compareDateTime(start, end) <= 0 ? [start, end] : null;
  }
  return null;
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
export function toFieldText(value: DateTimeValue, format?: string, locale = 'en-US'): string {
  return formatWith(value, format ?? fieldFormat(DEFAULT_FORMAT, !!value.time), locale);
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
