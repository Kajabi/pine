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

  // Text and rendered elements only: comments (such as a server's template annotations) and
  // script, style and template contents aren't part of the name.
  return Array.from(item.childNodes)
    .filter((node) =>
      node.nodeType === TEXT_NODE ||
      (node.nodeType === ELEMENT_NODE &&
        !(node as Element).matches(
          '.pds-sortable-item__handle, .pds-sortable-item__actions, [slot="sortable-item-actions"], script, style, template',
        )),
    )
    .map((node) => node.textContent ?? '')
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
};
