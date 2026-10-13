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

/**
 * Parses a typed range: two dates (with times, optionally) joined by `/`, a dash or `to` with
 * spaces around it, as `2026-09-13 – 2026-10-13`.
 */
export function parseRangeText(text: string | null | undefined): [DateTimeValue, DateTimeValue] | null {
  const parts = (text ?? '').trim().split(/\s+(?:–|—|-|to)\s+|\s*\/\s*/i);
  if (parts.length !== 2) return null;

  const start = parseDateTime(parts[0]);
  const end = parseDateTime(parts[1]);
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

/** The field form: `YYYY-MM-DD`, or `YYYY-MM-DD HH:mm` with a time. */
export function toFieldText(value: DateTimeValue): string {
  return value.time ? `${toIsoDate(value.date)} ${value.time}` : toIsoDate(value.date);
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
