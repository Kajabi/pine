import { parseIsoDate, toIsoDate } from '../date-utils';
import { builtInPresetRange, matchPreset, presetInRange, resolvePresets } from '../presets';
import type { DatepickerPreset } from '../datepicker-interface';

const d = (iso: string) => parseIsoDate(iso) as Date;
const toIsoRange = (start: Date, end: Date) => `${toIsoDate(start)}/${toIsoDate(end)}`;
// A Tuesday in the second month of the fourth quarter.
const NOW = d('2026-11-17');

const range = (key: string) => {
  const result = builtInPresetRange(key, NOW);
  return result && `${toIsoDate(result[0])}/${toIsoDate(result[1])}`;
};

describe('pds-datepicker presets', () => {
  it.each([
    ['today', '2026-11-17/2026-11-17'],
    ['yesterday', '2026-11-16/2026-11-16'],
    ['last-7-days', '2026-11-11/2026-11-17'],
    ['last-30-days', '2026-10-19/2026-11-17'],
    ['last-90-days', '2026-08-20/2026-11-17'],
    ['this-month', '2026-11-01/2026-11-30'],
    ['last-month', '2026-10-01/2026-10-31'],
    ['this-quarter', '2026-10-01/2026-12-31'],
    ['last-quarter', '2026-07-01/2026-09-30'],
    ['this-year', '2026-01-01/2026-12-31'],
    ['last-year', '2025-01-01/2025-12-31'],
    ['year-to-date', '2026-01-01/2026-11-17'],
    ['last-12-months', '2025-11-17/2026-11-17'],
  ])('resolves %s', (key, expected) => {
    expect(range(key)).toBe(expected);
  });

  it('resolves last quarter across a year boundary', () => {
    const [start, end] = builtInPresetRange('last-quarter', d('2026-02-10')) as [Date, Date];
    expect(toIsoRange(start, end)).toBe('2025-10-01/2025-12-31');
  });

  it('has no range for an unknown key', () => {
    expect(builtInPresetRange('next-week', NOW)).toBeNull();
  });

  it('reads a comma-separated list of built-in keys with English labels', () => {
    const presets = resolvePresets(' today, last-7-days ,nope', NOW);
    expect(presets.map((p) => [p.key, p.label])).toEqual([
      ['today', 'Today'],
      ['last-7-days', 'Last 7 days'],
    ]);
  });

  it('relabels built-ins and adds presets of your own', () => {
    const presets = resolvePresets(
      [
        { key: 'today', label: "Aujourd'hui" },
        { key: 'launch', label: 'Launch week', start: '2026-03-02', end: '2026-03-08' },
        { key: 'unlabelled', start: '2026-03-02', end: '2026-03-08' },
        { key: 'backwards', label: 'Backwards', start: '2026-03-08', end: '2026-03-02' },
      ],
      NOW,
    );

    expect(presets.map((p) => p.label)).toEqual(["Aujourd'hui", 'Launch week']);
    expect(toIsoRange(presets[1].start, presets[1].end)).toBe('2026-03-02/2026-03-08');
  });

  it('has no presets when none are given', () => {
    expect(resolvePresets(undefined, NOW)).toEqual([]);
  });

  it('matches a range to the first preset covering it exactly', () => {
    const presets = resolvePresets('today,this-month,year-to-date', NOW);
    expect(matchPreset(presets, d('2026-11-01'), d('2026-11-30'))?.key).toBe('this-month');
    expect(matchPreset(presets, d('2026-01-01'), d('2026-11-17'))?.key).toBe('year-to-date');
    expect(matchPreset(presets, d('2026-11-02'), d('2026-11-17'))).toBeUndefined();
    expect(matchPreset(presets, d('2026-11-17'), null)).toBeUndefined();
  });

  it('checks a preset against min and max', () => {
    const [lastYear] = resolvePresets('last-year', NOW);
    expect(presetInRange(lastYear, d('2025-01-01'), null)).toBe(true);
    expect(presetInRange(lastYear, d('2025-06-01'), null)).toBe(false);
  });

  it('ignores entries with the wrong types, as from untrusted JSON', () => {
    const presets = resolvePresets(
      [
        { key: 'today', label: { $tag$: 'img' } },
        { key: 'mine', label: 'Mine', start: 20260302, end: '2026-03-08' },
        { key: 42, label: 'Number key' },
        null,
      ] as unknown as DatepickerPreset[],
      NOW,
    );

    // A non-string label falls back to the built-in one; bad dates and keys are dropped.
    expect(presets.map((p) => [p.key, p.label])).toEqual([['today', 'Today']]);
  });
});
