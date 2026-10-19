# pds-sortable



<!-- Auto Generated Below -->


## Properties

| Property                   | Attribute      | Description                                                                                                                          | Type                | Default     |
| -------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ------------------- | ----------- |
| `border`                   | `border`       | Determines whether `sortable` should have a border.                                                                                  | `boolean`           | `false`     |
| `componentId` _(required)_ | `component-id` | A unique identifier for this component instance. Does not set the host element's `id` attribute — set `id` directly if you need one. | `string`            | `undefined` |
| `disabled`                 | `disabled`     | Determines whether or not the sortable is disabled.                                                                                  | `boolean`           | `false`     |
| `dividers`                 | `dividers`     | Determines whether `sortable` items should be divided with border.                                                                   | `boolean`           | `false`     |
| `handleType`               | `handle-type`  | Determines the grabbable area for the `pds-sortable-item`.                                                                           | `"handle" \| "row"` | `'row'`     |


## Events

| Event                  | Description                                  | Type                         |
| ---------------------- | -------------------------------------------- | ---------------------------- |
| `pdsSortableItemMoved` | Event emitted when a sortable item is moved. | `CustomEvent<SortableEvent>` |


----------------------------------------------


