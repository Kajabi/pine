# pds-sortable



<!-- Auto Generated Below -->


## Properties

| Property                   | Attribute      | Description                                                         | Type                | Default     |
| -------------------------- | -------------- | ------------------------------------------------------------------- | ------------------- | ----------- |
| `border`                   | `border`       | Determines whether `sortable` should have a border.                 | `boolean`           | `false`     |
| `componentId` _(required)_ | `component-id` | A unique identifier used for the sortable container `id` attribute. | `string`            | `undefined` |
| `dividers`                 | `dividers`     | Deternines whether `sortable` items should be divided with border.  | `boolean`           | `false`     |
| `handleType`               | `handle-type`  | Determines the grabbable area for the `pds-sortable-item`.          | `"handle" \| "row"` | `'row'`     |


## Events

| Event                  | Description                                  | Type                         |
| ---------------------- | -------------------------------------------- | ---------------------------- |
| `pdsSortableItemMoved` | Event emitted when a sortable item is moved. | `CustomEvent<SortableEvent>` |


----------------------------------------------


