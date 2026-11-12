# pds-table-head-cell



<!-- Auto Generated Below -->


## Properties

| Property    | Attribute    | Description                                                                                                                                                                                                                                                   | Type                                        | Default     |
| ----------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- | ----------- |
| `cellAlign` | `cell-align` | Sets the text alignment within the head cell.                                                                                                                                                                                                                 | `"center" \| "end" \| "justify" \| "start"` | `undefined` |
| `sortable`  | `sortable`   | Determines whether the table column is sortable when set to `true`.                                                                                                                                                                                           | `boolean`                                   | `undefined` |
| `width`     | `width`      | Sets the width of the column. Accepts any CSS length (e.g. '148px', '12rem', '20%'). When the table's `tableLayout` is `fixed`, the column keeps this width whatever its content. Otherwise the column is at least this wide and can grow to fit its content. | `string`                                    | `undefined` |


## Events

| Event          | Description                                                                                                                                     | Type                                                  |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| `pdsTableSort` | Event emitted to signal that a table column header has been sorted, providing information about the sorted column's name and sorting direction. | `CustomEvent<{ column: string; direction: string; }>` |


## Methods

### `clearActiveSort() => Promise<void>`

Clears the active sort state from this column.
Used internally when another column becomes active.

#### Returns

Type: `Promise<void>`



### `setActiveSort(direction: "asc" | "desc") => Promise<void>`

Programmatically sets this column as the active sort column with the specified direction.
Used by pds-table to apply a default sort on initial load.

#### Parameters

| Name        | Type              | Description                                     |
| ----------- | ----------------- | ----------------------------------------------- |
| `direction` | `"desc" \| "asc"` | - The sort direction to apply ('asc' or 'desc') |

#### Returns

Type: `Promise<void>`




## Shadow Parts

| Part          | Description                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `"head-cell"` | Set on the `pds-table-head-cell` element itself, so `::part(head-cell)` matches it only from a shadow root that contains it. Style `pds-table-head-cell` directly instead. In a `selectable` table, the select-all cell sits in `pds-table-head`'s shadow root: it has the `checkbox-cell` part when first rendered and `head-cell` after any re-render, so target both with `pds-table-head::part(checkbox-cell), pds-table-head::part(head-cell)`. |
| `"sort-icon"` | Exposes the sort direction icon for styling. Appears only on a `sortable` column while it's the active sort.                                                                                                                                                                                                                                                                                                                                         |


## Dependencies

### Used by

 - [pds-table-head](../pds-table-head)

### Depends on

- pds-icon

### Graph
```mermaid
graph TD;
  pds-table-head-cell --> pds-icon
  pds-table-head --> pds-table-head-cell
  style pds-table-head-cell fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------


