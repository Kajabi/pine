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
