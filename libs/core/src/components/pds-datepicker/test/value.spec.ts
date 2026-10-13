import { toIsoDate } from '../date-utils';
import { clockFor, joinTime, parseDateTime, parseRangeText, splitTime, toFieldText, toValueString } from '../value';

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
});
