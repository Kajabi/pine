/**
 * The ARIA attributes that take ID references, and the element-reflection property each is forwarded
 * through. An ID on a host can't reach an element inside its shadow root, so a component that
 * delegates focus forwards the elements the IDs point at instead. A browser without ARIA element
 * reflection gets none of them.
 */
export const ARIA_REFERENCE_PROPERTIES = {
  'aria-controls': 'ariaControlsElements',
  'aria-describedby': 'ariaDescribedByElements',
  'aria-labelledby': 'ariaLabelledByElements',
} as const;

export const ARIA_REFERENCE_ATTRIBUTES = Object.keys(ARIA_REFERENCE_PROPERTIES);

/**
 * Finds an element by ID in the host's tree, then in each shadow root that contains it, so a host
 * inside another component's shadow root still reaches, say, a popover portal on document.body.
 * The closest root wins when an ID repeats.
 */
export const findInAncestorRoots = (host: Element, id: string): HTMLElement | null => {
  let root = host.getRootNode();
  while (root instanceof ShadowRoot) {
    const found = root.getElementById(id);
    if (found) return found;
    root = root.host.getRootNode();
  }
  return root instanceof Document ? root.getElementById(id) : null;
};

/**
 * Points the target's reflected ARIA properties at the elements the host's ID-reference attributes
 * name, or clears them. Run it again whenever the attributes or the referenced elements may have
 * changed: element references don't follow an ID to a node added or replaced later.
 */
export const forwardAriaReferences = (host: Element, target: Element) => {
  Object.entries(ARIA_REFERENCE_PROPERTIES).forEach(([attribute, property]) => {
    if (!(property in target)) return;

    const ids = host.getAttribute(attribute)?.split(/\s+/).filter(Boolean) ?? [];
    const referenced = ids.map((id) => findInAncestorRoots(host, id)).filter((el): el is HTMLElement => el !== null);
    target[property] = referenced.length > 0 ? referenced : null;
  });
};
