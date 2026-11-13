const ELEMENT_NODE = 1;
const TEXT_NODE = 3;

/**
 * The name a sortable item goes by in its handle's label and in reorder announcements: its
 * `item-label`, or else its own text, leaving out the handle and the actions.
 * @param item - A `pds-sortable-item`
 * @returns The item's name, with whitespace collapsed
 */
export const sortableItemLabel = (item: HTMLElement): string => {
  const { itemLabel } = item as HTMLPdsSortableItemElement;
  if (itemLabel) return itemLabel;

  // Only the first text-bearing child, not every one of them joined: a row with a status chip or
  // an actions menu outside the `sortable-item-actions` slot would otherwise read that text into
  // the name too (e.g. "Reorder Newsletter Default Edit Archive Duplicate"). The main content is
  // conventionally the first child, so this still gets a real multi-line label (the first child
  // can itself wrap several lines of text) without pulling in siblings meant to be set dressing.
  for (const node of Array.from(item.childNodes)) {
    // Comments (such as a server's template annotations) and script, style and template contents
    // aren't part of the name.
    if (
      node.nodeType === ELEMENT_NODE &&
      (node as Element).matches(
        '.pds-sortable-item__handle, .pds-sortable-item__actions, [slot="sortable-item-actions"], script, style, template',
      )
    ) {
      continue;
    }
    if (node.nodeType !== TEXT_NODE && node.nodeType !== ELEMENT_NODE) continue;

    const text = (node.textContent ?? '').replace(/\s+/g, ' ').trim();
    if (text) return text;
  }

  return '';
};
