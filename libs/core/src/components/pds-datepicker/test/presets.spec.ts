import { parseIsoDate, toIsoDate } from '../date-utils';
import { builtInPresetRange, matchPreset, parseIsoRange, presetInRange, resolvePresets, toIsoRange } from '../presets';

const d = (iso: string) => parseIsoDate(iso) as Date;
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
    ['last-7-days', '2026-11-10/2026-11-17'],
    ['last-30-days', '2026-10-18/2026-11-17'],
    ['last-90-days', '2026-08-19/2026-11-17'],
    ['this-month', '2026-11-01/2026-11-17'],
    ['last-month', '2026-10-01/2026-10-31'],
    ['this-quarter', '2026-10-01/2026-11-17'],
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
    expect(matchPreset(presets, d('2026-11-01'), d('2026-11-17'))?.key).toBe('this-month');
    expect(matchPreset(presets, d('2026-11-02'), d('2026-11-17'))).toBeUndefined();
    expect(matchPreset(presets, d('2026-11-17'), null)).toBeUndefined();
  });

  it('checks a preset against min and max', () => {
    const [lastYear] = resolvePresets('last-year', NOW);
    expect(presetInRange(lastYear, d('2025-01-01'), null)).toBe(true);
    expect(presetInRange(lastYear, d('2025-06-01'), null)).toBe(false);
  });

  describe('parseIsoRange', () => {
    it('parses a start/end range', () => {
      const [start, end] = parseIsoRange('2026-09-13/2026-10-13') as [Date, Date];
      expect(toIsoRange(start, end)).toBe('2026-09-13/2026-10-13');
    });

    it.each(['', '2026-09-13', '2026-10-13/2026-09-13', '2026-09-13/2026-02-30', 'a/b/c'])('rejects %p', (value) => {
      expect(parseIsoRange(value)).toBeNull();
    });
  });
});
