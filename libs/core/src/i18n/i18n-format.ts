export type I18nVars = Record<string, string | number>;
export type PluralForms = Partial<Record<Intl.LDMLPluralRule, string>>;

/**
 * i18n formatting helpers for Pine components.
 *
 * Pine stays string-agnostic: user-facing text is supplied by the consumer as
 * props (English-defaulted). These helpers only handle the two things a prop
 * value can't express on its own — interpolating live component state into a
 * translated template, and picking the right plural form. No stored strings, no
 * locale registry; the locale is read from the DOM (`lang`), the web-standard
 * signal a consumer already sets.
 */

/** Replace `{token}` placeholders with `vars`; unknown tokens stay literal. */
export function formatMessage(template: string, vars?: I18nVars): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_match, key) =>
    key in vars ? String(vars[key]) : `{${key}}`,
  );
}

/** Nearest `[lang]` ancestor, then `<html lang>`, then `'en'`. */
export function resolveLocale(el?: Element | null): string {
  const fromEl =
    el && typeof el.closest === 'function' ? el.closest('[lang]')?.getAttribute('lang') : null;
  const fromDoc = typeof document !== 'undefined' ? document.documentElement.lang : '';
  return fromEl || fromDoc || 'en';
}

/**
 * Pick the CLDR plural form for `count` in the element's locale (via the
 * platform `Intl.PluralRules`) and interpolate `{count}`. `forms` come from the
 * caller — component props, English-defaulted — and fall back to `other`.
 */
export function pluralize(
  el: Element | null,
  count: number,
  forms: PluralForms,
  vars?: I18nVars,
): string {
  let category: Intl.LDMLPluralRule = 'other';
  try {
    category = new Intl.PluralRules(resolveLocale(el)).select(count);
  } catch {
    /* invalid locale tag → fall back to 'other' */
  }
  const template = forms[category] ?? forms.other ?? '';
  return formatMessage(template, { count, ...vars });
}
