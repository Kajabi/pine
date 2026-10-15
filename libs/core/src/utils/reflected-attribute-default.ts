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
 * Wire up from a `@Watch` on the prop and reassign the prop to the result, so
 * the reflected attribute is written back along with the restored default.
 */
export function restoreReflectedDefault<T>(el: Element, attr: string, value: T, defaultValue: T): T {
  return el.hasAttribute(attr) ? value : defaultValue;
}
