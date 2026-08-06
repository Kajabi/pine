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
 *
 * Two limitations of DOM-`lang` locale resolution, both inherent to inferring
 * locale from the DOM rather than being told it:
 *
 * 1. Not reactive. `resolveLocale` is read during render; Stencil has no
 *    reactive dependency on a DOM attribute, so changing `lang` at runtime
 *    (`document.documentElement.lang = 'pl'`) does NOT re-render mounted
 *    components — the plural form stays stale until unrelated state forces a
 *    render. Fine when locale changes via full-page navigation; a consumer that
 *    switches locale client-side should pass the already-formatted/pluralized
 *    string as the prop instead.
 * 2. Does not cross shadow boundaries. `el.closest('[lang]')` stops at the host's
 *    shadow root. A Pine component nested inside another custom element whose
 *    `lang` sits on that outer host will not see it and falls back to
 *    `document.documentElement.lang`. Set `lang` on (or above) the Pine element
 *    in the same tree, or pass a pre-formatted string, when that matters.
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
  // Prefer the selected category, then the required `other`, then `one`; never
  // return empty. `||` (not `??`) so an empty-string form is skipped too, not
  // treated as present — a bare `{count}` still shows the number rather than
  // leaving the trigger with no accessible name.
  const template = forms[category] || forms.other || forms.one || '{count}';
  return formatMessage(template, { count, ...vars });
}
