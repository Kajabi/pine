export type Attributes = { [key: string]: any };

/**
 * Sets each attribute whose current value differs, and leaves the rest alone. A `MutationObserver`
 * that calls this to restore attributes sees its own writes once and then settles, so it can't loop.
 * @param el - Element to write to
 * @param attributes - Attribute names and the values they should have
 */
export const setAttributesIfChanged = (el: Element, attributes: Record<string, string>) => {
  Object.entries(attributes).forEach(([name, value]) => {
    if (el.getAttribute(name) !== value) el.setAttribute(name, value);
  });
};

/**
 * The classes and style properties a component renders onto its own host.
 */
export type HostStyling = { classes: string[]; styles: Record<string, string> };

// Classes Stencil itself puts on a host: its default `hydratedFlag` (Pine doesn't change it), and a
// scoped component's scope classes (`sc-pds-sortable-h`, `sc-pds-sortable-s`), which its CSS needs.
const isStencilClass = (name: string) => name === 'hydrated' || /^sc-.+-[hs]$/.test(name);

/**
 * Splits a rendered class string into its class names.
 */
export const classNamesOf = (classes: string) => classes.split(/\s+/).filter(Boolean);

/**
 * Puts back any of `expected`'s classes or style properties that are missing from `el`. It only
 * adds what's missing, never rewrites a value that's there, because browsers normalize some style
 * values (`flex: 1` reads back as `1 1 0%`): comparing values would rewrite them forever.
 * @param el - Host element
 * @param expected - Classes and style properties the component rendered
 */
export const restoreHostStyling = (el: HTMLElement, { classes, styles }: HostStyling) => {
  const missing = classes.filter((name) => !el.classList.contains(name));
  if (missing.length > 0) el.classList.add(...missing);

  Object.entries(styles).forEach(([name, value]) => {
    if (value && el.style.getPropertyValue(name) === '') el.style.setProperty(name, value);
  });
};

/**
 * Watches a host-only component's own `class` and `style` attributes and puts back what it rendered
 * when something strips them. A DOM morph does: it makes the host match the server's HTML, which
 * carries the component's attributes but not the classes and styles it wrote, and Stencil won't
 * write them again because it diffs against its previous render, not the live DOM.
 *
 * It also means a script that removes one of these classes or styles on purpose sees it come back:
 * change them through the component's props instead.
 * @param el - Host element
 * @param expected - Reads what the component last rendered
 * @returns The observer, to disconnect when the component is removed; `null` without MutationObserver
 */
export const keepHostStyling = (el: HTMLElement, expected: () => HostStyling) => {
  if (typeof MutationObserver === 'undefined') return null;

  const observer = new MutationObserver((records) => {
    const styling = expected();
    // A strip takes Stencil's own classes too: without `hydrated` Stencil hides the component, and
    // without its scope classes a scoped component's CSS stops matching. Put back only the ones that
    // were there, so this never runs ahead of Stencil.
    const stencilClasses = records
      .filter((record) => record.attributeName === 'class' && record.oldValue != null)
      .flatMap((record) => classNamesOf(record.oldValue).filter(isStencilClass));
    restoreHostStyling(el, { ...styling, classes: [...styling.classes, ...stencilClasses] });
  });
  observer.observe(el, { attributes: true, attributeFilter: ['class', 'style'], attributeOldValue: true });
  return observer;
};

/**
 * Inherit attributes from the host element
 * @param el - Host element
 * @param attributes - Array of attributes to inherit
 */
export const inheritAttributes = (el: Element, attributes: string[] = []) => {
  const attributeObject: Attributes = {};

  attributes.forEach((attr) => {
    if (el.hasAttribute(attr)) {
      const value = el.getAttribute(attr);

      if ( value !== null) {
        attributeObject[attr] = el.getAttribute(attr);
      }
      el.removeAttribute(attr);
    }
  });

  return attributeObject;
}

/**
 * List of available ARIA attributes + `role`.
 * Removed deprecated attributes.
 * https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes
 */
const ariaAttributes = [
  'role',
  'aria-activedescendant',
  'aria-atomic',
  'aria-autocomplete',
  'aria-braillelabel',
  'aria-brailleroledescription',
  'aria-busy',
  'aria-checked',
  'aria-colcount',
  'aria-colindex',
  'aria-colindextext',
  'aria-colspan',
  'aria-controls',
  'aria-current',
  'aria-describedby',
  'aria-description',
  'aria-details',
  'aria-disabled',
  'aria-errormessage',
  'aria-expanded',
  'aria-flowto',
  'aria-haspopup',
  'aria-hidden',
  'aria-invalid',
  'aria-keyshortcuts',
  'aria-label',
  'aria-labelledby',
  'aria-level',
  'aria-live',
  'aria-multiline',
  'aria-multiselectable',
  'aria-orientation',
  'aria-owns',
  'aria-placeholder',
  'aria-posinset',
  'aria-pressed',
  'aria-readonly',
  'aria-relevant',
  'aria-required',
  'aria-roledescription',
  'aria-rowcount',
  'aria-rowindex',
  'aria-rowindextext',
  'aria-rowspan',
  'aria-selected',
  'aria-setsize',
  'aria-sort',
  'aria-valuemax',
  'aria-valuemin',
  'aria-valuenow',
  'aria-valuetext',
];


 export const inheritAriaAttributes = (el: Element, ignoreList?: string[]) => {
  let attributesToInherit = ariaAttributes;
  if (ignoreList && ignoreList.length > 0) {
    attributesToInherit = ariaAttributes.filter(attr => !ignoreList.includes(attr));
  }

  return inheritAttributes(el, attributesToInherit);
 }
