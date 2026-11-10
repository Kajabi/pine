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

// Each restore that writes something counts. A real strip costs one, but a script that undoes the
// restore as soon as it lands (from a MutationObserver) keeps both going forever, all in
// microtasks, so the page never renders or takes input. More writes than this before the next task
// means that kind of fight. A script that undoes it from a timer or animation frame gets a fresh
// budget each task; the page stays responsive then, so that fight isn't capped.
const MAX_RESTORES_PER_TASK = 5;

// Callbacks waiting for the next task, all run by one message. A MessageChannel message isn't slowed
// down like a timer is in a background tab (or frozen by test fake timers); a timer is the fallback
// where it's missing. One message for all of them, so a morph that strips many hosts doesn't open a
// channel for each.
const nextTaskCallbacks = new Set<() => void>();

const runNextTaskCallbacks = () => {
  const callbacks = Array.from(nextTaskCallbacks);
  nextTaskCallbacks.clear();
  callbacks.forEach((callback) => callback());
};

const onNextTask = (callback: () => void) => {
  nextTaskCallbacks.add(callback);
  if (nextTaskCallbacks.size > 1) return;
  if (typeof MessageChannel === 'undefined') {
    setTimeout(runNextTaskCallbacks);
    return;
  }
  const channel = new MessageChannel();
  channel.port1.onmessage = () => {
    channel.port1.close();
    runNextTaskCallbacks();
  };
  channel.port2.postMessage(null);
};

/**
 * The restore kind for a host's own classes, styles and attributes, shared by a component's own
 * host restore and `keepPineHydrated`: one fight on a host's classes stops both, and warns once.
 */
export const HOST_RESTORE = 'host';

/**
 * Remembers the Stencil classes an element has had, and returns all of them. A restore can't read
 * them from the latest mutation alone: after a script's last strip they're gone from its old value
 * too, and the next change would restore nothing.
 */
export const stencilClassesOf = (seen: Set<string>, el: Element, oldValue: string | null) => {
  [...classNamesOf(oldValue ?? ''), ...Array.from(el.classList)]
    .filter((name) => isStencilClass(el, name))
    .forEach((name) => seen.add(name));
  return Array.from(seen);
};

// What each element has already been warned about, by kind of restore. A host with its own restore
// is also watched for its Stencil classes, so one fight on its classes stops both and needs one
// warning; a fight over a trigger's ARIA is a different kind, and warns on its own. On the global
// object, like `OBSERVER` below, so two copies of Pine on a page share it.
const WARNED = Symbol.for('@pine-ds/core/restoreWarnings');
const warnedKinds = (): WeakMap<Element, Set<string>> => {
  const store = globalThis as typeof globalThis & { [WARNED]?: WeakMap<Element, Set<string>> };
  return (store[WARNED] ??= new WeakMap());
};

/** Whether `el` was already warned about for `kind`; records it if not. */
const alreadyWarned = (el: Element, kind: string) => {
  const kinds = warnedKinds().get(el) ?? new Set<string>();
  warnedKinds().set(el, kinds);
  if (kinds.has(kind)) return true;
  kinds.add(kind);
  return false;
};

/**
 * Wraps a restore callback, which returns whether it wrote anything, so that it writes at most
 * `MAX_RESTORES_PER_TASK` times before the next task (until the message posted after its first write
 * runs). Past that, another script is undoing every restore as soon as it lands, so it stops and
 * lets that script win rather than hang the page. What that script left stays until something
 * changes the element again: the count resets on the next task, so a later change is restored, but
 * nothing is restored on its own. The first give-up warns, logging `el` so it can be found in
 * devtools; later ones, and other restores of the same `kind` giving up on the same element, are
 * silent.
 * @param restore - Puts back what something removed; returns `true` if it wrote anything
 * @param warning - What the console warning says was given up
 * @param el - The element being restored, logged with the warning
 * @param kind - What's being restored; one warning per element for each kind
 */
export const limitRestores = <A extends unknown[]>(
  restore: (...args: A) => boolean,
  warning: string,
  el?: Element,
  kind: string = warning,
): ((...args: A) => void) => {
  let writes = 0;
  let warned = false;

  return (...args: A) => {
    if (writes >= MAX_RESTORES_PER_TASK) {
      if (!warned) {
        warned = true;
        if (el && alreadyWarned(el, kind)) return;
        // The warning as an argument, not the format string: it carries the tag name, which the HTML
        // parser lets contain `%`.
        console.warn('%s', warning, el);
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
 * appears (from a `MutationObserver`, say) wins after a few rounds, and the component logs a console
 * warning. The component then stays hidden, as that script left it, until its class changes again.
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

  // One capped restore per element, so a script fighting one component doesn't stop the others,
  // and the Stencil classes each one has had.
  const restores = new WeakMap<Element, (names: string[]) => void>();
  const seen = new WeakMap<Element, Set<string>>();
  const restoreFor = (el: Element) => {
    let restore = restores.get(el);
    if (!restore) {
      restore = limitRestores(
        (names: string[]) => {
          const missing = names.filter((name) => !el.classList.contains(name));
          if (missing.length > 0) el.classList.add(...missing);
          return missing.length > 0;
        },
        `${el.localName}: stopped putting back its hydrated and scope classes, as another script keeps removing them.`,
        el,
        HOST_RESTORE,
      );
      restores.set(el, restore);
    }
    return restore;
  };

  const observer = new MutationObserver((records) => {
    records.forEach(({ target, oldValue }) => {
      const el = target as Element;
      if (!el.localName.startsWith('pds-')) return;
      // No old value is a `class` being added. Stencil's first `hydrated` arrives that way, which
      // needs nothing; for an element already seen, it's the class coming back after a removal.
      if (oldValue == null && !seen.has(el)) return;
      if (!seen.has(el)) seen.set(el, new Set());
      const names = stencilClassesOf(seen.get(el)!, el, oldValue);
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
