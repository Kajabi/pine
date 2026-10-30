/**
 * The native `<dialog>` or open `popover` (as pds-filter's) an element sits in, so a popup portaled
 * there shares its top layer and a click in it isn't outside it; otherwise `document.body`.
 * `closest()` stops at shadow boundaries and misses one that only wraps slotted content, so this
 * walks assigned slots and shadow hosts, as pds-combobox does. `isHost` picks which ancestor counts.
 */
export function findPortalTarget(from: HTMLElement, isHost: (el: Element) => boolean = isOpenDialogOrPopover): HTMLElement {
  const seen = new Set<Node>();
  let current: Node | null = from;

  while (current && !seen.has(current)) {
    seen.add(current);

    if (current.nodeType === Node.ELEMENT_NODE && isHost(current as Element)) {
      return current as HTMLElement;
    }

    const assigned = current.nodeType === Node.ELEMENT_NODE ? (current as HTMLElement).assignedSlot : null;
    if (assigned) {
      current = assigned;
      continue;
    }

    const parent: Node | null = current.parentNode;
    current = parent instanceof ShadowRoot ? parent.host : parent;
  }

  return document.body;
}

/**
 * A modal dialog or open popover, which paints in the top layer above anything in the body, that
 * sits in the document itself: the document's stylesheets don't reach into a shadow root.
 */
export function isTopLayerInDocument(el: Element): boolean {
  if (el.getRootNode() !== el.ownerDocument) return false;
  return matchesSafely(el, ':modal') || matchesSafely(el, ':popover-open');
}

function isOpenDialogOrPopover(el: Element): boolean {
  // Only an open dialog: inside a closed one, the popup would be hidden with it.
  if (el.localName === 'dialog') return (el as HTMLDialogElement).open;
  return el.hasAttribute('popover') && matchesSafely(el, ':popover-open');
}

function matchesSafely(el: Element, selector: string): boolean {
  try {
    return el.matches(selector);
  } catch {
    // A browser without the selector (no Popover API, or no :modal): no top layer to share.
    return false;
  }
}
