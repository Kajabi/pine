/**
 * Whether a class is one Stencil itself puts on a host: its default `hydratedFlag` (Pine doesn't
 * change it), or a scoped component's own scope classes (`sc-pds-radio`, `sc-pds-radio-h`,
 * `sc-pds-radio-s`), which its CSS needs. Only the host's own: another `sc-` class may be a
 * consumer's (styled-components ids).
 * @param el - Host element
 * @param name - Class name
 */
export const isStencilClass = (el: Element, name: string) => {
  const scope = `sc-${el.localName}`;
  return name === 'hydrated' || name === scope || name === `${scope}-h` || name === `${scope}-s`;
};

/**
 * The class names in a rendered `class` value: a string, or Stencil's `{ name: boolean }` form.
 */
export const classNamesOf = (classes: string | Record<string, boolean>) =>
  typeof classes === 'string'
    ? classes.split(/\s+/).filter(Boolean)
    : Object.keys(classes).filter((name) => classes[name]);

// On the global object, not in this module, so a page with two copies of Pine (the CDN build and a
// bundled `@pine-ds/react`) still has one observer.
const OBSERVER = Symbol.for('@pine-ds/core/keepPineHydrated');

/**
 * Puts Stencil's own classes back on any Pine component that loses them. Stencil hides a component
 * until it has `hydrated`, so a DOM morph that strips a host's `class` makes it vanish, and nothing
 * rewrites it. One observer on the whole document covers every component, including the ones with no
 * host restore of their own. It only restores classes the element had, so it never runs ahead of
 * Stencil. It can't see inside shadow roots, which a morph doesn't reach either.
 *
 * A script that removes `hydrated` on purpose sees it come back, and one that removes it every time it
 * appears never settles: don't strip Pine's classes from a `MutationObserver`.
 *
 * Pine's global script calls this, so the CDN and `dist` builds get it on load. The custom-elements
 * build (`@pine-ds/core/components/*`, `@pine-ds/react`) has no global script: call it once yourself.
 * Calling it again does nothing, and without `MutationObserver` (server rendering) neither does the
 * first call.
 */
export const keepPineHydrated = () => {
  if (typeof MutationObserver === 'undefined' || typeof document === 'undefined') return;
  const store = globalThis as typeof globalThis & { [OBSERVER]?: MutationObserver };
  if (store[OBSERVER]) return;

  const observer = new MutationObserver((records) => {
    records.forEach(({ target, oldValue }) => {
      const el = target as Element;
      if (oldValue == null || !el.localName.startsWith('pds-')) return;
      const missing = classNamesOf(oldValue).filter(
        (name) => isStencilClass(el, name) && !el.classList.contains(name),
      );
      if (missing.length > 0) el.classList.add(...missing);
    });
  });
  // The document rather than its root element, so replacing `<html>` doesn't end the watch.
  observer.observe(document, {
    subtree: true,
    attributes: true,
    attributeFilter: ['class'],
    attributeOldValue: true,
  });
  store[OBSERVER] = observer;
};
