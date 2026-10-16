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

// Each restore that writes something counts. A real strip costs one, but a script that keeps
// undoing what's restored keeps both going forever, all in microtasks, so the page never renders
// or takes input. More writes than this before the next task means a fight.
const MAX_RESTORES_PER_TASK = 5;

// Runs `callback` on the next task. A MessageChannel message isn't slowed down like a timer is in a
// background tab (or frozen by test fake timers); a timer is the fallback where it's missing.
const onNextTask = (callback: () => void) => {
  if (typeof MessageChannel === 'undefined') {
    setTimeout(callback);
    return;
  }
  const channel = new MessageChannel();
  channel.port1.onmessage = () => {
    channel.port1.close();
    callback();
  };
  channel.port2.postMessage(null);
};

/**
 * Wraps a restore callback, which returns whether it wrote anything, so that it writes at most
 * `MAX_RESTORES_PER_TASK` times before the next task. Past that, another script is undoing every
 * restore, so it stops and lets that script win rather than hang the page, and warns the first time,
 * logging `el` so it can be found in devtools. The count resets on the next task, so a later strip is
 * still restored.
 * @param restore - Puts back what something removed; returns `true` if it wrote anything
 * @param warning - What the console warning says was given up
 * @param el - The element being restored, logged with the warning
 */
export const limitRestores = <A extends unknown[]>(
  restore: (...args: A) => boolean,
  warning: string,
  el?: Element,
): ((...args: A) => void) => {
  let writes = 0;
  let warned = false;

  return (...args: A) => {
    if (writes >= MAX_RESTORES_PER_TASK) {
      if (!warned) {
        warned = true;
        console.warn(warning, el);
      }
      return;
    }

    if (!restore(...args)) return;
    if (writes === 0) onNextTask(() => (writes = 0));
    writes += 1;
  };
};

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
 * A script that removes `hydrated` on purpose sees it come back. One that removes it every time it
 * appears wins after a few rounds, and the component logs a console warning.
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

  // One capped restore per element, so a script fighting one component doesn't stop the others.
  const restores = new WeakMap<Element, (names: string[]) => void>();
  const restoreFor = (el: Element) => {
    let restore = restores.get(el);
    if (!restore) {
      restore = limitRestores(
        (names: string[]) => {
          const missing = names.filter((name) => !el.classList.contains(name));
          if (missing.length > 0) el.classList.add(...missing);
          return missing.length > 0;
        },
        `${el.localName}: stopped putting back its hydrated class, as another script keeps removing it.`,
        el,
      );
      restores.set(el, restore);
    }
    return restore;
  };

  const observer = new MutationObserver((records) => {
    records.forEach(({ target, oldValue }) => {
      const el = target as Element;
      if (oldValue == null || !el.localName.startsWith('pds-')) return;
      const names = classNamesOf(oldValue).filter((name) => isStencilClass(el, name));
      if (names.length > 0) restoreFor(el)(names);
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
