/**
 * Date-only helpers for pds-datepicker. Dates are `YYYY-MM-DD` strings and all arithmetic runs in
 * UTC, so a date never shifts by a day with the viewer's time zone or a daylight-saving change.
 */

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

/** Parses a `YYYY-MM-DD` string to a UTC `Date`, or `null` when it isn't a real calendar date. */
export function parseIsoDate(value: string | null | undefined): Date | null {
  const match = ISO_DATE.exec((value ?? '').trim());
  if (!match) return null;

  const [, year, month, day] = match.map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  // Rejects dates like 2026-02-30, which Date.UTC would roll into March.
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day ? date : null;
}

export function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Today in the viewer's time zone, as a UTC date. */
export function today(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
}

export function addDays(date: Date, days: number): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + days));
}

/** Moves by whole months, keeping the day where it exists (Jan 31 + 1 month is Feb 28 or 29). */
export function addMonths(date: Date, months: number): Date {
  const first = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + months, 1));
  const lastDay = daysInMonth(first.getUTCFullYear(), first.getUTCMonth());
  return new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth(), Math.min(date.getUTCDate(), lastDay)));
}

export function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
}

export function isSameDay(a: Date | null, b: Date | null): boolean {
  return !!a && !!b && a.getTime() === b.getTime();
}

/** Clamps a date into the `[min, max]` range; either bound may be missing. */
export function clampDate(date: Date, min: Date | null, max: Date | null): Date {
  if (min && date < min) return min;
  if (max && date > max) return max;
  return date;
}

export function isOutOfRange(date: Date, min: Date | null, max: Date | null): boolean {
  return (!!min && date < min) || (!!max && date > max);
}

/** The column (0–6) a date falls in, for a week starting on `firstDayOfWeek` (0 = Sunday). */
export function weekdayColumn(date: Date, firstDayOfWeek: number): number {
  return (date.getUTCDay() - firstDayOfWeek + 7) % 7;
}

/**
 * The month's weeks, each seven cells long. Days from the neighbouring months are `null`, so the
 * grid only offers dates in the month on view.
 */
export function monthWeeks(year: number, month: number, firstDayOfWeek: number): (Date | null)[][] {
  const first = new Date(Date.UTC(year, month, 1));
  const cells: (Date | null)[] = Array(weekdayColumn(first, firstDayOfWeek)).fill(null);
  for (let day = 1; day <= daysInMonth(year, month); day++) {
    cells.push(new Date(Date.UTC(year, month, day)));
  }
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: (Date | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

/**
 * The locale's first day of the week (0 = Sunday), from `Intl.Locale` week info where the browser
 * has it. Falls back to Sunday.
 */
export function localeFirstDayOfWeek(locale: string): number {
  type WeekInfoLocale = { getWeekInfo?: () => { firstDay: number }; weekInfo?: { firstDay: number } };
  // Intl.Locale is newer than the library's ES2017 typings.
  const IntlLocale = (Intl as unknown as { Locale?: new (tag: string) => WeekInfoLocale }).Locale;
  if (!IntlLocale) return 0;

  try {
    const intlLocale = new IntlLocale(locale);
    const firstDay = intlLocale.getWeekInfo?.().firstDay ?? intlLocale.weekInfo?.firstDay;
    // Intl numbers the days 1 (Monday) to 7 (Sunday).
    return typeof firstDay === 'number' ? firstDay % 7 : 0;
  } catch {
    return 0;
  }
}

/**
 * Weekday names, starting from `firstDayOfWeek`: a short form for the column heading and the long
 * form for assistive tech. Latin-script names shorten to two letters (Su Mo, lu ma, Mo Di), as the
 * admin date picker does, while the seven stay distinct; other scripts keep the locale's short form,
 * which is already compact.
 */
export function weekdayNames(locale: string, firstDayOfWeek: number): { short: string; long: string }[] {
  const shortFormat = new Intl.DateTimeFormat(locale, { weekday: 'short', timeZone: 'UTC' });
  const longFormat = new Intl.DateTimeFormat(locale, { weekday: 'long', timeZone: 'UTC' });
  // 2023-01-01 was a Sunday.
  const days = Array.from({ length: 7 }, (_, i) => new Date(Date.UTC(2023, 0, 1 + ((firstDayOfWeek + i) % 7))));
  const shorts = days.map((date) => shortFormat.format(date).replace(/\.$/, ''));

  const latin = shorts.every((name) => /^[A-Za-z\u00C0-\u024F]+$/.test(name));
  const twoLetters = shorts.map((name) => name.slice(0, 2));
  const useTwoLetters = latin && new Set(twoLetters.map((name) => name.toLowerCase())).size === 7;

  return days.map((date, i) => ({
    short: useTwoLetters ? twoLetters[i] : shortFormat.format(date),
    long: longFormat.format(date),
  }));
}

/** The locale if the browser supports it, otherwise `en-US`, so a bad tag never throws while rendering. */
export function supportedLocale(locale: string | null | undefined): string {
  try {
    return Intl.DateTimeFormat.supportedLocalesOf(locale || [])[0] ?? 'en-US';
  } catch {
    return 'en-US';
  }
}

/** A formatter for the UTC dates these helpers return. Build it once per render, not per day. */
export function dateFormatter(locale: string, options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  return new Intl.DateTimeFormat(locale, { ...options, timeZone: 'UTC' });
}

export function formatDate(date: Date, locale: string, options: Intl.DateTimeFormatOptions): string {
  return dateFormatter(locale, options).format(date);
}
