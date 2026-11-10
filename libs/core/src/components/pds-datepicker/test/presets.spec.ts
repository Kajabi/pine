import { parseIsoDate, toIsoDate } from '../date-utils';
import { builtInPresetRange, matchPreset, offsetPresetRange, presetInRange, resolvePresets } from '../presets';
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

  it('treats a blank label as no label, so no preset renders as an empty button', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    const presets = resolvePresets(
      [
        { key: 'yesterday', label: '' },
        { key: 'blank-label-key', label: '   ', startOffset: -2 },
      ],
      NOW,
    );
    warn.mockRestore();

    // A built-in falls back to its own label; a key of your own has none to fall back to.
    expect(presets.map((p) => [p.key, p.label])).toEqual([['yesterday', 'Yesterday']]);
  });

  describe('a preset of your own, relative to today', () => {
    const offsets = (preset: Partial<DatepickerPreset>) => {
      const result = offsetPresetRange({ key: 'mine', ...preset } as DatepickerPreset, NOW);
      return result && toIsoRange(result[0], result[1]);
    };

    it('counts whole days from today, and leaves the offset you omit at today', () => {
      expect(offsets({ startOffset: -1 })).toBe('2026-11-16/2026-11-17');
      expect(offsets({ startOffset: -1, endOffset: -1 })).toBe('2026-11-16/2026-11-16');
      expect(offsets({ startOffset: 0, endOffset: 0 })).toBe('2026-11-17/2026-11-17');
      expect(offsets({ endOffset: 7 })).toBe('2026-11-17/2026-11-24');
    });

    it('reads a null offset, as JSON often writes a missing one, as today', () => {
      expect(offsets({ startOffset: -13, endOffset: null as unknown as number })).toBe('2026-11-04/2026-11-17');
      expect(offsets({ startOffset: null as unknown as number, endOffset: 7 })).toBe('2026-11-17/2026-11-24');
      expect(offsets({ startOffset: null as unknown as number, endOffset: null as unknown as number })).toBeNull();
    });

    it('has no range when the offsets run backwards or are not whole numbers', () => {
      // A lone negative endOffset runs from today back to an earlier day, so there is no range.
      expect(offsets({ endOffset: -1 })).toBeNull();
      expect(offsets({ startOffset: 0, endOffset: -1 })).toBeNull();
      expect(offsets({ startOffset: -1.5 })).toBeNull();
      expect(offsets({ startOffset: NaN })).toBeNull();
      expect(offsets({ startOffset: '-1' as unknown as number })).toBeNull();
      expect(offsets({})).toBeNull();
    });

    it('stays relative to today, as a built-in does', () => {
      const mine: DatepickerPreset[] = [{ key: 'last-24-hours', label: 'Last 24 hours', startOffset: -1 }];

      const [onThe17th] = resolvePresets(mine, d('2026-11-17'));
      const [onThe18th] = resolvePresets(mine, d('2026-11-18'));

      expect(toIsoRange(onThe17th.start, onThe17th.end)).toBe('2026-11-16/2026-11-17');
      expect(toIsoRange(onThe18th.start, onThe18th.end)).toBe('2026-11-17/2026-11-18');
    });

    it('is still matched by its own range the next day, so the change event keeps carrying its key', () => {
      const mine: DatepickerPreset[] = [{ key: 'last-24-hours', label: 'Last 24 hours', startOffset: -1 }];

      // What the panel lists on the 18th, matched against the range picked on the 18th.
      const next = resolvePresets(mine, d('2026-11-18'));
      expect(matchPreset(next, d('2026-11-17'), d('2026-11-18'))?.key).toBe('last-24-hours');
      // The range the same preset covered a day earlier no longer matches, as a built-in's would not.
      expect(matchPreset(next, d('2026-11-16'), d('2026-11-17'))).toBeUndefined();
    });

    it('leaves a preset on fixed days where it is, whatever day it is read on', () => {
      const pinned: DatepickerPreset[] = [{ key: 'launch', label: 'Launch week', start: '2026-03-02', end: '2026-03-08' }];

      for (const day of ['2026-11-17', '2026-11-18']) {
        const [preset] = resolvePresets(pinned, d(day));
        expect(toIsoRange(preset.start, preset.end)).toBe('2026-03-02/2026-03-08');
      }
    });

    it('takes fixed days over offsets, and offsets over a built-in range', () => {
      const [bothGiven] = resolvePresets([{ key: 'mine', label: 'Mine', start: '2026-03-02', end: '2026-03-08', startOffset: -1 }], NOW);
      expect(toIsoRange(bothGiven.start, bothGiven.end)).toBe('2026-03-02/2026-03-08');

      // Offsets on a built-in key override the range that key would have had.
      const [overridden] = resolvePresets([{ key: 'last-7-days', startOffset: -7 }], NOW);
      expect(toIsoRange(overridden.start, overridden.end)).toBe('2026-11-10/2026-11-17');
      expect(overridden.label).toBe('Last 7 days');
    });
  });

  describe('warning about a preset it cannot list', () => {
    let warn: jest.SpyInstance;

    beforeEach(() => {
      warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    });

    afterEach(() => {
      warn.mockRestore();
    });

    it('names a key it cannot resolve to a range', () => {
      resolvePresets([{ key: 'unresolvable-key', label: 'Mine' }], NOW);

      expect(warn).toHaveBeenCalledTimes(1);
      expect(warn.mock.calls[0][0]).toContain('"unresolvable-key"');
      expect(warn.mock.calls[0][0]).toContain('startOffset');
    });

    it('names a key of your own that has a range but no label', () => {
      resolvePresets([{ key: 'unlabelled-key', startOffset: -1 }], NOW);

      expect(warn).toHaveBeenCalledTimes(1);
      expect(warn.mock.calls[0][0]).toContain('"unlabelled-key"');
      expect(warn.mock.calls[0][0]).toContain('no label');
    });

    it('says it once, however many times the list is read', () => {
      const presets: DatepickerPreset[] = [{ key: 'repeated-key', label: 'Mine' }];
      resolvePresets(presets, NOW);
      resolvePresets(presets, NOW);
      resolvePresets(presets, d('2026-11-18'));

      expect(warn).toHaveBeenCalledTimes(1);
    });
  });
});
