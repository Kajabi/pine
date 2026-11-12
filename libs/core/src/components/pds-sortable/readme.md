# pds-sortable



<!-- Auto Generated Below -->


## Properties

| Property                   | Attribute                | Description                                                                                                                                                                            | Type                | Default                                                                                                                        |
| -------------------------- | ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `border`                   | `border`                 | Determines whether `sortable` should have a border.                                                                                                                                    | `boolean`           | `false`                                                                                                                        |
| `componentId` _(required)_ | `component-id`           | A unique identifier used for the sortable container `id` attribute.                                                                                                                    | `string`            | `undefined`                                                                                                                    |
| `disabled`                 | `disabled`               | Determines whether or not the sortable is disabled.                                                                                                                                    | `boolean`           | `false`                                                                                                                        |
| `dividers`                 | `dividers`               | Determines whether `sortable` items should be divided with border.                                                                                                                     | `boolean`           | `false`                                                                                                                        |
| `handleLabel`              | `handle-label`           | Accessible label for each item's reorder handle, the button the keyboard reorders with. Pass a translated string to localize it; `{item}` is interpolated.                             | `string`            | `'Reorder {item}'`                                                                                                             |
| `handleType`               | `handle-type`            | Determines the grabbable area for the `pds-sortable-item`.                                                                                                                             | `"handle" \| "row"` | `'row'`                                                                                                                        |
| `itemDroppedLabel`         | `item-dropped-label`     | Screen-reader announcement when a picked-up item is dropped. Pass a translated string to localize it; `{item}`, `{position}` and `{total}` are interpolated.                           | `string`            | `'{item}, dropped at position {position} of {total}'`                                                                          |
| `itemMovedLabel`           | `item-moved-label`       | Screen-reader announcement when a picked-up item is moved. Pass a translated string to localize it; `{item}`, `{position}` and `{total}` are interpolated.                             | `string`            | `'{item}, moved to position {position} of {total}'`                                                                            |
| `itemPickedUpLabel`        | `item-picked-up-label`   | Screen-reader announcement when an item is picked up from the keyboard. Pass a translated string to localize it; `{item}`, `{position}` and `{total}` are interpolated.                | `string`            | `'{item}, picked up. Position {position} of {total}. Press the arrow keys to move, Space or Enter to drop, Escape to cancel.'` |
| `reorderCanceledLabel`     | `reorder-canceled-label` | Screen-reader announcement when a keyboard reorder is canceled and the item goes back. Pass a translated string to localize it; `{item}`, `{position}` and `{total}` are interpolated. | `string`            | `'Reorder canceled. {item} returned to position {position} of {total}'`                                                        |


## Events

| Event                  | Description                                                                                                                                                                                                                                                             | Type                         |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| `pdsSortableItemMoved` | Event emitted when a sortable item is moved, by dragging or from the keyboard. A keyboard move carries the same fields as a drag (`item`, `from`, `to`, `oldIndex`, `newIndex`, `oldDraggableIndex`, `newDraggableIndex`), with the `KeyboardEvent` as `originalEvent`. | `CustomEvent<SortableEvent>` |


----------------------------------------------


