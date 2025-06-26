export type Attributes = { [key: string]: any };

/**
 * Inherit attributes from the host element
 * @param el - Host element
 * @param attributes - Array of attributes to inherit
 */
export const inheritAttributes = (el: HTMLElement, attributes: string[] = []) => {
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


 export const inheritAriaAttributes = (el: HTMLElement, ignoreList?: string[]) => {
  let attributesToInherit = ariaAttributes;
  if (ignoreList && ignoreList.length > 0) {
    attributesToInherit = ariaAttributes.filter(attr => !ignoreList.includes(attr));
  }

  return inheritAttributes(el, attributesToInherit);
 }

/**
 * Collects all attributes from the host element except those that are ARIA attributes, known Stencil props, or in an optional ignore list.
 * @param el - Host element
 * @param knownProps - Array of prop names to exclude (Stencil props)
 * @param ignoreList - Additional attribute names to ignore
 */
export const inheritNonStencilAttributes = (
  el: HTMLElement,
  knownProps: string[] = [],
  ignoreList: string[] = []
): Attributes => {
  const attributeObject: Attributes = {};
  const ariaSet = new Set(ariaAttributes);
  const knownSet = new Set(knownProps.map(p => p.toLowerCase()));
  const ignoreSet = new Set(ignoreList.map(p => p.toLowerCase()));

  Array.from(el.attributes).forEach(attr => {
    const name = attr.name.toLowerCase();
    if (!ariaSet.has(name) && !knownSet.has(name) && !ignoreSet.has(name)) {
      attributeObject[attr.name] = attr.value;
    }
  });
  return attributeObject;
};

/**
 * Collects all attributes from the host element except those that are ARIA attributes, properties on the instance, or in an optional ignore list.
 * @param el - Host element
 * @param instance - The Stencil component instance (usually `this`)
 * @param ignoreList - Additional attribute names to ignore
 */
export const inheritNonStencilAttributesAuto = (
  el: HTMLElement,
  instance: any,
  ignoreList: string[] = []
): Attributes => {
  const attributeObject: Attributes = {};
  const ariaSet = new Set(ariaAttributes);
  const ignoreSet = new Set(ignoreList.map(p => p.toLowerCase()));

  // Get all property names from the instance (including props)
  const propNames = new Set(Object.getOwnPropertyNames(instance).map(p => p.toLowerCase()));

  Array.from(el.attributes).forEach(attr => {
    const name = attr.name.toLowerCase();
    if (!ariaSet.has(name) && !propNames.has(name) && !ignoreSet.has(name)) {
      attributeObject[attr.name] = attr.value;
    }
  });
  return attributeObject;
};
