import { toIsoDate } from '../date-utils';
import {
  clockFor,
  fieldFormat,
  formatWith,
  joinTime,
  parseDateTime,
  parseFieldText,
  parseRangeText,
  parseWith,
  splitTime,
  toFieldText,
  toValueString,
} from '../value';

const text = (value: ReturnType<typeof parseDateTime>) => value && `${toIsoDate(value.date)} ${value.time ?? '-'}`;

describe('pds-datepicker values', () => {
  describe('parseDateTime', () => {
    it.each([
      ['2026-10-13', '2026-10-13 -'],
      ['2026-10-13T14:30', '2026-10-13 14:30'],
      [' 2026-10-13 09:05 ', '2026-10-13 09:05'],
    ])('parses %p', (input, expected) => {
      expect(text(parseDateTime(input))).toBe(expected);
    });

    it.each(['', '2026-10-13T24:00', '2026-10-13 12:60', '2026-02-30', '2026-10-13T9:00'])('rejects %p', (input) => {
      expect(parseDateTime(input)).toBeNull();
    });
  });

  describe('parseRangeText', () => {
    it.each([
      '2026-09-13 – 2026-10-13',
      '2026-09-13 - 2026-10-13',
      '2026-09-13 to 2026-10-13',
      '2026-09-13/2026-10-13',
      '2026-09-13 — 2026-10-13',
    ])('parses %p', (input) => {
      const range = parseRangeText(input);
      expect(range?.map((part) => toIsoDate(part.date))).toEqual(['2026-09-13', '2026-10-13']);
    });

    it('parses times on both ends', () => {
      const range = parseRangeText('2026-10-13 14:00 – 2026-10-14 22:00');
      expect(range?.map(toValueString)).toEqual(['2026-10-13T14:00', '2026-10-14T22:00']);
    });

    it.each(['2026-09-13', '2026-10-13 – 2026-09-13', '2026-10-13 14:00 – 2026-10-13 09:00', 'a – b'])(
      'rejects %p',
      (input) => {
        expect(parseRangeText(input)).toBeNull();
      },
    );
  });

  it('writes the value and field forms', () => {
    const value = parseDateTime('2026-10-13T14:30');
    expect(value && toValueString(value)).toBe('2026-10-13T14:30');
    expect(value && toFieldText(value)).toBe('2026-10-13 14:30');
  });

  it('splits and joins times', () => {
    expect(splitTime('07:05')).toEqual([7, 5]);
    expect(joinTime(7, 5)).toBe('07:05');
  });

  it('reads the clock from the locale', () => {
    expect(clockFor('en-US')).toEqual({ hour12: true, am: 'AM', pm: 'PM' });
    expect(clockFor('fr').hour12).toBe(false);
  });

  describe('formats', () => {
    const value = parseDateTime('2026-01-05T15:07') as NonNullable<ReturnType<typeof parseDateTime>>;

    it.each([
      ['YYYY-MM-DD', '2026-01-05'],
      ['MM/DD/YYYY', '01/05/2026'],
      ['M/D/YYYY', '1/5/2026'],
      ['DD.MM.YYYY HH:mm', '05.01.2026 15:07'],
      ['D/M/YYYY h:mm A', '5/1/2026 3:07 PM'],
      ['YYYY-MM-DD hh:mm a', '2026-01-05 03:07 pm'],
    ])('writes %s', (format, expected) => {
      expect(formatWith(value, format)).toBe(expected);
    });

    it.each([
      ['01/05/2026', 'MM/DD/YYYY', '2026-01-05'],
      ['1/5/2026', 'MM/DD/YYYY', '2026-01-05'],
      [' 5.1.2026 ', 'DD.MM.YYYY', '2026-01-05'],
      ['5/1/2026 3:07 pm', 'D/M/YYYY h:mm A', '2026-01-05T15:07'],
      ['5/1/2026 12:00 AM', 'D/M/YYYY h:mm A', '2026-01-05T00:00'],
      ['05.01.2026   15:07', 'DD.MM.YYYY HH:mm', '2026-01-05T15:07'],
    ])('reads %p as %s', (text, format, expected) => {
      const read = parseWith(text, format);
      expect(read && toValueString(read)).toBe(expected);
    });

    it.each([
      ['13/05/2026', 'MM/DD/YYYY'],
      ['02/30/2026', 'MM/DD/YYYY'],
      ['2026-01-05', 'MM/DD/YYYY'],
      ['5/1/2026 13:00 PM', 'D/M/YYYY h:mm A'],
      ['5/1/2026 24:00', 'D/M/YYYY HH:mm'],
    ])('rejects %p as %s', (text, format) => {
      expect(parseWith(text, format)).toBeNull();
    });

    it('falls back to ISO for typed text', () => {
      expect(toValueString(parseFieldText('2026-01-05', 'MM/DD/YYYY') as NonNullable<ReturnType<typeof parseDateTime>>)).toBe('2026-01-05');
    });

    it('adds a time on the clock the time picker uses', () => {
      expect(fieldFormat('MM/DD/YYYY', false)).toBe('MM/DD/YYYY');
      expect(fieldFormat('MM/DD/YYYY', true, true)).toBe('MM/DD/YYYY h:mm A');
      expect(fieldFormat('', true, false)).toBe('YYYY-MM-DD HH:mm');
      expect(fieldFormat('D.M.YYYY HH:mm', true, true)).toBe('D.M.YYYY HH:mm');
    });

    it('splits a typed range by dash or to, and by slash only when the format has none', () => {
      expect(parseRangeText('1/2/2026 - 1/9/2026', 'M/D/YYYY')?.map(toValueString)).toEqual(['2026-01-02', '2026-01-09']);
      expect(parseRangeText('1/2/2026/1/9/2026', 'M/D/YYYY')).toBeNull();
      expect(parseRangeText('2026-01-02/2026-01-09')?.map(toValueString)).toEqual(['2026-01-02', '2026-01-09']);
    });
  });

  describe('review: format edge cases', () => {
    const value = parseDateTime('2026-01-05T15:07') as NonNullable<ReturnType<typeof parseDateTime>>;

    it('writes and reads month names in the locale and in English', () => {
      expect(formatWith(value, 'MMM D, YYYY')).toBe('Jan 5, 2026');
      expect(formatWith(value, 'D MMMM YYYY', 'fr')).toBe('5 janvier 2026');
      expect(toValueString(parseWith('jan 5, 2026', 'MMM D, YYYY') as typeof value)).toBe('2026-01-05');
      expect(toValueString(parseWith('5 janvier 2026', 'D MMMM YYYY', 'fr') as typeof value)).toBe('2026-01-05');
      expect(toValueString(parseWith('5 January 2026', 'D MMMM YYYY', 'fr') as typeof value)).toBe('2026-01-05');
    });

    it('keeps bracketed text literal', () => {
      expect(formatWith(value, '[Date:] D/M/YYYY')).toBe('Date: 5/1/2026');
      expect(toValueString(parseWith('Date: 5/1/2026', '[Date:] D/M/YYYY') as typeof value)).toBe('2026-01-05');
    });

    it('writes and reads AM/PM in the locale', () => {
      const ko = formatWith(value, 'YYYY-MM-DD h:mm A', 'ko');
      expect(ko).not.toContain('PM');
      expect(toValueString(parseWith(ko, 'YYYY-MM-DD h:mm A', 'ko') as typeof value)).toBe('2026-01-05T15:07');
      // English is still accepted.
      expect(toValueString(parseWith('2026-01-05 3:07 PM', 'YYYY-MM-DD h:mm A', 'ko') as typeof value)).toBe(
        '2026-01-05T15:07',
      );
    });

    it('adds AM/PM to a 12-hour format without it', () => {
      expect(fieldFormat('D/M/YYYY h:mm', false)).toBe('D/M/YYYY h:mm A');
      expect(fieldFormat('[h] D/M/YYYY', false)).toBe('[h] D/M/YYYY');
    });

    it('reads a range in a format that has a spaced dash', () => {
      const format = 'D - M - YYYY';
      const range = parseRangeText('1 - 2 - 2026 – 3 - 4 - 2026', format);
      expect(range?.map(toValueString)).toEqual(['2026-02-01', '2026-04-03']);
      expect(parseRangeText('1 - 2 - 2026 to 3 - 4 - 2026', format)?.map(toValueString)).toEqual(['2026-02-01', '2026-04-03']);
    });
  });
});
