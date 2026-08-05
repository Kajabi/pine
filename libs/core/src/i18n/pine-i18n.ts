import { DEFAULT_STRINGS } from './defaults';

export type PineLocale = string;
export type PineCatalog = Record<string, string>;
export type PineI18nVars = Record<string, string | number>;

const catalogs: Map<PineLocale, PineCatalog> = new Map();
let activeLocale: PineLocale = 'en';
const listeners: Set<() => void> = new Set();

function notify(): void {
  listeners.forEach((fn) => fn());
}

/** Replace `{token}` placeholders; unknown tokens are left literal. */
function interpolate(template: string, vars?: PineI18nVars): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_match, key) =>
    key in vars ? String(vars[key]) : `{${key}}`,
  );
}

/**
 * Global i18n registry for Pine's baked, non-slottable strings (aria-labels,
 * live-region announcements, placeholder defaults). Framework-agnostic — a
 * consumer wires its own translations in once (e.g. from i18next):
 *
 *   PineI18n.set('es', { 'pds-alert.dismiss': 'Descartar alerta', ... });
 *   PineI18n.setLocale('es');
 *
 * Components resolve with `prop ?? PineI18n.get(id)`, so precedence is:
 *   per-instance prop  >  active-locale catalog  >  English default  >  the id.
 * Because English defaults ship inline, first paint is always populated (no FOUC).
 */
export const PineI18n = {
  /** Merge translations for a locale (idempotent, additive per key). */
  set(locale: PineLocale, catalog: PineCatalog): void {
    catalogs.set(locale, { ...(catalogs.get(locale) ?? {}), ...catalog });
    notify();
  },

  /** Switch the active locale; re-renders subscribed components. */
  setLocale(locale: PineLocale): void {
    activeLocale = locale;
    notify();
  },

  get locale(): PineLocale {
    return activeLocale;
  },

  /**
   * Resolve a string id for the active locale, with `{token}` interpolation.
   * Falls back: active-locale catalog -> English default -> the id itself
   * (never returns empty).
   */
  get(id: string, vars?: PineI18nVars): string {
    const template = catalogs.get(activeLocale)?.[id] ?? DEFAULT_STRINGS[id] ?? id;
    return interpolate(template, vars);
  },

  /**
   * Pluralized resolve. Uses the platform `Intl.PluralRules` to pick the CLDR
   * category (`one`, `other`, `few`, …) for `count` in the active locale, then
   * resolves `${id}.${category}`, falling back to `${id}.other`. `count` is
   * auto-injected as an interpolation var.
   *
   * Zero-dependency and correct for every locale's plural rules without ICU
   * MessageFormat — the component owns *which* form, the catalog owns the text.
   */
  plural(id: string, count: number, vars?: PineI18nVars): string {
    let category = 'other';
    try {
      category = new Intl.PluralRules(activeLocale).select(count);
    } catch {
      /* invalid locale tag → fall back to 'other' */
    }
    // Fallback order keeps the result in-language before switching to English:
    // locale[category] -> locale.other -> default[category] -> default.other -> id.
    const forLocale = catalogs.get(activeLocale);
    const template =
      forLocale?.[`${id}.${category}`] ??
      forLocale?.[`${id}.other`] ??
      DEFAULT_STRINGS[`${id}.${category}`] ??
      DEFAULT_STRINGS[`${id}.other`] ??
      `${id}.other`;
    return interpolate(template, { count, ...vars });
  },

  /** Subscribe to locale/catalog changes; returns an unsubscribe fn. */
  subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  /** Test helper — clears registered catalogs and resets locale to 'en'. */
  reset(): void {
    catalogs.clear();
    activeLocale = 'en';
  },
};
