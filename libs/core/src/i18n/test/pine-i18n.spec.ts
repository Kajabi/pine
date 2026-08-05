import { PineI18n } from '../pine-i18n';

describe('PineI18n', () => {
  afterEach(() => {
    PineI18n.reset();
  });

  it('returns the English default when no catalog is set', () => {
    expect(PineI18n.get('pds-alert.dismiss')).toBe('Dismiss alert');
  });

  it('returns the id itself for an unknown key (never blank)', () => {
    expect(PineI18n.get('pds-nope.missing')).toBe('pds-nope.missing');
  });

  it('interpolates {tokens}', () => {
    expect(PineI18n.get('pds-textarea.charCount', { current: 12, max: 200 })).toBe(
      '12 of 200 characters',
    );
  });

  it('leaves unknown {tokens} literal', () => {
    expect(PineI18n.get('pds-textarea.charCount', { current: 3 })).toBe('3 of {max} characters');
  });

  it('prefers the active-locale catalog over the default', () => {
    PineI18n.set('es', { 'pds-alert.dismiss': 'Descartar alerta' });
    PineI18n.setLocale('es');
    expect(PineI18n.get('pds-alert.dismiss')).toBe('Descartar alerta');
  });

  it('falls back to the English default for keys missing from the active locale', () => {
    PineI18n.set('es', { 'pds-alert.dismiss': 'Descartar alerta' });
    PineI18n.setLocale('es');
    expect(PineI18n.get('pds-toast.dismiss')).toBe('Dismiss message');
  });

  it('notifies subscribers on set and setLocale, and stops after unsubscribe', () => {
    let ticks = 0;
    const unsubscribe = PineI18n.subscribe(() => {
      ticks++;
    });
    PineI18n.set('es', { x: 'y' });
    PineI18n.setLocale('es');
    unsubscribe();
    PineI18n.setLocale('en');
    expect(ticks).toBe(2);
  });

  describe('plural (Intl.PluralRules)', () => {
    it('selects the English one/other forms', () => {
      expect(PineI18n.plural('pds-multiselect.itemCount', 1)).toBe('1 item');
      expect(PineI18n.plural('pds-multiselect.itemCount', 2)).toBe('2 items');
      expect(PineI18n.plural('pds-multiselect.itemCount', 0)).toBe('0 items');
    });

    it('uses locale-specific CLDR categories (Polish one/few/many)', () => {
      // Polish has 4 plural categories; Intl.PluralRules('pl') picks:
      //   1 -> one, 2 -> few, 5 -> many. Simple {token} could never do this;
      // ICU MessageFormat is unnecessary because Intl.PluralRules is built in.
      PineI18n.set('pl', {
        'pds-multiselect.itemCount.one': '{count} element',
        'pds-multiselect.itemCount.few': '{count} elementy',
        'pds-multiselect.itemCount.many': '{count} elementów',
        'pds-multiselect.itemCount.other': '{count} elementu',
      });
      PineI18n.setLocale('pl');
      expect(PineI18n.plural('pds-multiselect.itemCount', 1)).toBe('1 element');
      expect(PineI18n.plural('pds-multiselect.itemCount', 2)).toBe('2 elementy');
      expect(PineI18n.plural('pds-multiselect.itemCount', 5)).toBe('5 elementów');
    });

    it('falls back to the "other" form when the selected category is absent', () => {
      // es select(1) === 'one', but the catalog only provides 'other'.
      PineI18n.set('es', { 'pds-multiselect.itemCount.other': '{count} elementos' });
      PineI18n.setLocale('es');
      expect(PineI18n.plural('pds-multiselect.itemCount', 1)).toBe('1 elementos');
    });
  });
});
