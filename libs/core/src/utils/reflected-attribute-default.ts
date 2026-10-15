/**
 * Restores a reflected prop's default when its attribute is removed.
 *
 * A reflected `@Prop` with a default writes that default onto the host as an
 * attribute even when the author leaves it out. Removing the attribute doesn't
 * restore the default: Stencil's `attributeChangedCallback` sets the prop to
 * `null` (or `false` for a boolean), even when its default is `true`. A Turbo
 * morph hits this whenever the author relied on the default, since the
 * server's HTML never carries the attribute Pine wrote.
 *
 * A boolean prop's "removed" value (`false`) is indistinguishable from an
 * explicit `false` by value alone, so this checks the host's actual attribute
 * instead of the watched value: present, trust the parsed value; absent,
 * fall back to the default.
 *
 * Falling back also writes the default back onto the host. Stencil won't: it
 * diffs a reflected attribute against the previous render, not the live DOM,
 * so when the removed attribute held the default (`'lg'` → `null` → `'lg'`)
 * the values match and it skips the write. Left absent, the attribute would
 * make every later property write (`avatar.size = 'xs'`, a React update, or
 * `copytext.border = false`) fall back to the default too.
 *
 * Wire up from a `@Watch` on the prop and reassign the prop to the result.
 *
 * `attr` is the HTML attribute name, not the prop name — pass the kebab-case
 * form (e.g. `'is-loading'`) for a camelCase prop. They're the same string
 * for every current caller (`size`, `variant`, `placement`, `border`), but
 * `hasAttribute` would silently always return `false` for a multi-word prop
 * if the prop name were passed instead.
 */
export function restoreReflectedDefault<T>(el: Element, attr: string, value: T, defaultValue: T): T {
  if (el.hasAttribute(attr)) return value;

  if (defaultValue !== false && defaultValue != null) {
    el.setAttribute(attr, defaultValue === true ? '' : String(defaultValue));
  }
  return defaultValue;
}
