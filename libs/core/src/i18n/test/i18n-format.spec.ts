import { formatMessage, pluralize, resolveLocale } from '../i18n-format';

describe('i18n-format', () => {
  describe('formatMessage', () => {
    it('interpolates {tokens}', () => {
      expect(formatMessage('{current} of {max} characters', { current: 12, max: 200 })).toBe(
        '12 of 200 characters',
      );
    });
    it('leaves unknown {tokens} literal', () => {
      expect(formatMessage('{current} of {max} characters', { current: 3 })).toBe(
        '3 of {max} characters',
      );
    });
    it('returns the template unchanged when no vars are given', () => {
      expect(formatMessage('Dismiss alert')).toBe('Dismiss alert');
    });
  });

  describe('resolveLocale', () => {
    afterEach(() => {
      document.documentElement.removeAttribute('lang');
    });
    it('falls back to "en" with no lang set', () => {
      expect(resolveLocale(null)).toBe('en');
    });
    it('reads <html lang> when no nearer ancestor sets it', () => {
      document.documentElement.lang = 'es';
      expect(resolveLocale(null)).toBe('es');
    });
    it('prefers the nearest [lang] ancestor over <html lang>', () => {
      document.documentElement.lang = 'es';
      const host = document.createElement('div');
      host.setAttribute('lang', 'pl');
      const child = document.createElement('span');
      host.appendChild(child);
      expect(resolveLocale(child)).toBe('pl');
    });
  });

  describe('pluralize (Intl.PluralRules)', () => {
    afterEach(() => {
      document.documentElement.removeAttribute('lang');
    });
    const forms = { one: '{count} item', other: '{count} items' };

    it('picks English one / other', () => {
      expect(pluralize(null, 1, forms)).toBe('1 item');
      expect(pluralize(null, 2, forms)).toBe('2 items');
      expect(pluralize(null, 0, forms)).toBe('0 items');
    });

    it('uses locale-specific CLDR categories (Polish one / few / many)', () => {
      document.documentElement.lang = 'pl';
      const pl = {
        one: '{count} element',
        few: '{count} elementy',
        many: '{count} elementów',
        other: '{count} elementu',
      };
      expect(pluralize(null, 1, pl)).toBe('1 element');
      expect(pluralize(null, 2, pl)).toBe('2 elementy'); // few
      expect(pluralize(null, 5, pl)).toBe('5 elementów'); // many
    });

    it('falls back to the "other" form when the selected category is absent', () => {
      expect(pluralize(null, 1, { other: '{count} items' })).toBe('1 items');
    });
  });
});
