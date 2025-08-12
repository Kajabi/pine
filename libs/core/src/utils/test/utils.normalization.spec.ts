import { normalizeColorValue, setColor } from '../../utils/utils';

describe('color normalization utilities', () => {
  describe('normalizeColorValue', () => {
    it('returns undefined for whitespace-only strings', () => {
      expect(normalizeColorValue('   ')).toBeUndefined();
      expect(normalizeColorValue('\n\t  ')).toBeUndefined();
    });

    it('passes through var(...) values', () => {
      expect(normalizeColorValue('var(--pine-color-accent)')).toBe('var(--pine-color-accent)');
    });

    it('wraps raw --token values with var(...)', () => {
      expect(normalizeColorValue('--pine-color-green-400')).toBe('var(--pine-color-green-400)');
    });

    it('passes through literal colors', () => {
      expect(normalizeColorValue('#fff')).toBe('#fff');
      expect(normalizeColorValue('rgb(255, 255, 255)')).toBe('rgb(255, 255, 255)');
    });

    it('resolves via semanticMap', () => {
      const map = { accent: 'var(--pine-color-text-accent)' };
      expect(normalizeColorValue('accent', { semanticMap: map })).toBe('var(--pine-color-text-accent)');
    });
  });

  describe('setColor', () => {
    it('merges default and custom colors and returns empty object when unresolved', () => {
      const custom = { customOnly: 'var(--pine-color-text-info)' };
      // Unresolvable input (whitespace) returns an empty object
      expect(setColor('   ', custom)).toEqual({});
      // Also handle empty string explicitly
      expect(setColor('', custom)).toEqual({});
      // Custom key resolves
      expect(setColor('customOnly', custom)).toEqual({ '--color': 'var(--pine-color-text-info)' });
      // Default key still resolves when custom is present due to merging
      expect(setColor('accent', custom)).toEqual({ '--color': 'var(--pine-color-text-accent)' });
    });

    it('customColors override defaults on key conflicts and trims input before resolution', () => {
      const custom = { accent: 'var(--pine-color-text-success)' };
      // Custom overrides default 'accent'
      expect(setColor('accent', custom)).toEqual({ '--color': 'var(--pine-color-text-success)' });
      // Input is trimmed before resolution
      expect(setColor('  accent  ', custom)).toEqual({ '--color': 'var(--pine-color-text-success)' });
    });

    it('wraps raw token and passes through var(...)', () => {
      expect(setColor('--pine-color-purple-300')).toEqual({ '--color': 'var(--pine-color-purple-300)' });
      expect(setColor('var(--pine-color-purple-300)')).toEqual({ '--color': 'var(--pine-color-purple-300)' });
    });

    it('passes through literal css colors', () => {
      expect(setColor('#000')).toEqual({ '--color': '#000' });
    });
  });
});
