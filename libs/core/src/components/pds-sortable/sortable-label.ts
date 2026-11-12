/**
 * The name a sortable item goes by in its handle's label and in reorder announcements: its
 * `item-label`, or else its own text, leaving out the handle and the actions.
 * @param item - A `pds-sortable-item`
 * @returns The item's name, with whitespace collapsed
 */
export const sortableItemLabel = (item: HTMLElement): string => {
  const { itemLabel } = item as HTMLPdsSortableItemElement;
  if (itemLabel) return itemLabel;

  return Array.from(item.childNodes)
    .filter(
      (node) =>
        !(node instanceof Element) ||
        !node.matches('.pds-sortable-item__handle, .pds-sortable-item__actions, [slot="sortable-item-actions"]'),
    )
    .map((node) => node.textContent ?? '')
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
};
