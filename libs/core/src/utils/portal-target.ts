/**
 * The native `<dialog>` or open `popover` (as pds-filter's) an element sits in, so a popup portaled
 * there shares its top layer and a click in it isn't outside it; otherwise `document.body`.
 * `closest()` stops at shadow boundaries and misses one that only wraps slotted content, so this
 * walks assigned slots and shadow hosts, as pds-combobox does.
 */
export function findPortalTarget(from: HTMLElement): HTMLElement {
  const seen = new Set<Node>();
  let current: Node | null = from;

  while (current && !seen.has(current)) {
    seen.add(current);

    if (current.nodeType === Node.ELEMENT_NODE && isTopLayerHost(current as Element)) {
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

function isTopLayerHost(el: Element): boolean {
  // Only an open dialog: inside a closed one, the popup would be hidden with it.
  if (el.localName === 'dialog') return (el as HTMLDialogElement).open;
  if (!el.hasAttribute('popover')) return false;
  try {
    return el.matches(':popover-open');
  } catch {
    // A browser without the Popover API: no top layer to share.
    return false;
  }
}
