/**
 * English default strings for Pine components, keyed by a stable id
 * `pds-<component>.<key>`. These render at first paint and are the fallback when
 * a locale/catalog is unset, so a component is never blank and there is no FOUC.
 *
 * Values may contain `{token}` placeholders resolved by PineI18n.get(id, vars).
 *
 * PUBLIC API: once an id ships it must not be removed or renamed without a
 * deprecation window (a consumer's catalog keys off these ids).
 */
export const DEFAULT_STRINGS: Record<string, string> = {
  'pds-alert.dismiss': 'Dismiss alert',
  'pds-toast.dismiss': 'Dismiss message',
  'pds-avatar.trigger': 'Avatar dropdown trigger',
  'pds-multiselect.searchOptions': 'Search options',
  'pds-multiselect.selectedItems': 'Selected items',
  'pds-multiselect.placeholder': 'Select...',
  'pds-multiselect.searchPlaceholder': 'Find...',
  'pds-multiselect.itemRemoved': '{item} removed',
  // Pluralized via PineI18n.plural + Intl.PluralRules — one form per CLDR category.
  'pds-multiselect.itemCount.one': '{count} item',
  'pds-multiselect.itemCount.other': '{count} items',
  'pds-textarea.charCount': '{current} of {max} characters',
};
