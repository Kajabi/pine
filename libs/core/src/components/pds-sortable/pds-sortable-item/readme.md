# pds-sortable-item



<!-- Auto Generated Below -->


## Properties

| Property        | Attribute        | Description                                                                                                                                                                                                           | Type      | Default     |
| --------------- | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ----------- |
| `componentId`   | `component-id`   | A unique identifier for this component instance. Does not set the host element's `id` attribute — set `id` directly if you need one.                                                                                  | `string`  | `undefined` |
| `enableActions` | `enable-actions` | Determines whether `sortable-item-actions` slot should be enabled.                                                                                                                                                    | `boolean` | `false`     |
| `itemLabel`     | `item-label`     | Name of the item in its reorder handle's label and in the reorder announcements. Pass a translated string to localize it; defaults to the item's text content.                                                        | `string`  | `undefined` |
| `showHandle`    | `show-handle`    | Determines whether the reorder handle is shown. The handle itself renders whenever the list is reorderable, regardless of this prop; without it, the handle is visually hidden but still reachable from the keyboard. | `boolean` | `false`     |


## Slots

| Slot                      | Description                                                                                                                             |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `"sortable-item-actions"` | Content is placed within the `pds-sortable-item__actions` element as children. This slot is only rendered when `enable-actions` is set. |


## Dependencies

### Depends on

- pds-icon

### Graph
```mermaid
graph TD;
  pds-sortable-item --> pds-icon
  style pds-sortable-item fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------


