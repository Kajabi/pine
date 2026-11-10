// This helper function is similar to Element.closest(),
// however it also traverses shadow DOM boundaries.
export const closest = (selector: string, el: Element | Document) => {
  return (
    el &&
    (('closest' in el && el.closest(selector)) ||
      closest(selector, (el.getRootNode() as unknown as ShadowRoot).host))
  )
}

/** Whether `node` is `ancestor` or inside it, crossing shadow roots, which `Node.contains` doesn't. */
export const containsComposed = (ancestor: Node | null | undefined, node: Node | null | undefined): boolean => {
  for (let current = node; current; current = current instanceof ShadowRoot ? current.host : current.parentNode) {
    if (current === ancestor) return true;
  }
  return false;
};
