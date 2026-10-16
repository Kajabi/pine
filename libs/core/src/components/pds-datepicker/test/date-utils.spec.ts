import {
  addDays,
  addMonths,
  clampDate,
  isOutOfRange,
  localeFirstDayOfWeek,
  monthWeeks,
  parseIsoDate,
  supportedLocale,
  toIsoDate,
  weekdayColumn,
  weekdayNames,
} from '../date-utils';

const d = (iso: string) => parseIsoDate(iso) as Date;

describe('pds-datepicker date utils', () => {
  describe('parseIsoDate', () => {
    it('parses a YYYY-MM-DD date at UTC midnight', () => {
      expect(parseIsoDate('2026-10-13')?.toISOString()).toBe('2026-10-13T00:00:00.000Z');
    });

    it('trims surrounding whitespace', () => {
      expect(toIsoDate(d(' 2026-10-13 '))).toBe('2026-10-13');
    });

    it.each(['', '2026-1-3', '10/13/2026', '2026-02-30', '2026-13-01', 'not a date'])('rejects %p', (value) => {
      expect(parseIsoDate(value)).toBeNull();
    });

    it('accepts February 29 only in a leap year', () => {
      expect(parseIsoDate('2028-02-29')).not.toBeNull();
      expect(parseIsoDate('2026-02-29')).toBeNull();
    });
  });

  it('adds days across month and year ends', () => {
    expect(toIsoDate(addDays(d('2026-12-31'), 1))).toBe('2027-01-01');
    expect(toIsoDate(addDays(d('2026-03-01'), -1))).toBe('2026-02-28');
  });

  it('keeps the day when adding months, clamped to the shorter month', () => {
    expect(toIsoDate(addMonths(d('2026-01-31'), 1))).toBe('2026-02-28');
    expect(toIsoDate(addMonths(d('2028-01-31'), 1))).toBe('2028-02-29');
    expect(toIsoDate(addMonths(d('2026-10-13'), -12))).toBe('2025-10-13');
  });

  it('clamps and range-checks against optional bounds', () => {
    const min = d('2026-10-05');
    const max = d('2026-11-20');
    expect(toIsoDate(clampDate(d('2026-10-01'), min, max))).toBe('2026-10-05');
    expect(toIsoDate(clampDate(d('2026-12-01'), min, max))).toBe('2026-11-20');
    expect(toIsoDate(clampDate(d('2026-10-13'), null, null))).toBe('2026-10-13');
    expect(isOutOfRange(d('2026-10-04'), min, max)).toBe(true);
    expect(isOutOfRange(d('2026-10-05'), min, max)).toBe(false);
  });

  it('places a date in its weekday column for the first day of the week', () => {
    // 2026-10-13 is a Tuesday.
    expect(weekdayColumn(d('2026-10-13'), 0)).toBe(2);
    expect(weekdayColumn(d('2026-10-13'), 1)).toBe(1);
  });

  it('lays out a month in full weeks with empty cells outside it', () => {
    const weeks = monthWeeks(2026, 9, 0);
    expect(weeks).toHaveLength(5);
    expect(weeks.every((week) => week.length === 7)).toBe(true);
    // October 2026 starts on a Thursday.
    expect(weeks[0].slice(0, 4)).toEqual([null, null, null, null]);
    expect(toIsoDate(weeks[0][4] as Date)).toBe('2026-10-01');
    expect(toIsoDate(weeks[4][6] as Date)).toBe('2026-10-31');
  });

  it('names the weekdays from the first day of the week', () => {
    const names = weekdayNames('en-US', 1);
    expect(names[0]).toEqual({ short: 'Mo', long: 'Monday' });
    expect(names[6]).toEqual({ short: 'Su', long: 'Sunday' });
  });

  it.each([
    ['fr', 'lu ma me je ve sa di'],
    ['de', 'Mo Di Mi Do Fr Sa So'],
    ['es', 'lu ma mi ju vi sá do'],
  ])('shortens %s weekday names to two letters', (locale, expected) => {
    expect(weekdayNames(locale, 1).map((name) => name.short).join(' ')).toBe(expected);
  });

  it('keeps the short form for scripts that are already compact', () => {
    expect(weekdayNames('ja', 0)[1].short).toBe('月');
    expect(weekdayNames('ar', 6)[0].short).toBe(new Intl.DateTimeFormat('ar', { weekday: 'short', timeZone: 'UTC' }).format(new Date(Date.UTC(2023, 0, 7))));
  });

  it('falls back to Sunday when the browser has no week info', () => {
    expect([0, 1, 6]).toContain(localeFirstDayOfWeek('en-US'));
    expect(localeFirstDayOfWeek('not a locale!')).toBe(0);
  });

  it('falls back to en-US for a locale the browser does not support', () => {
    expect(supportedLocale('fr')).toBe('fr');
    expect(supportedLocale('not a locale!')).toBe('en-US');
    expect(supportedLocale(undefined)).toBe('en-US');
  });
});
