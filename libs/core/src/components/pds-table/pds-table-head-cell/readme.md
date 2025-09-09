# pds-table-head-cell



<!-- Auto Generated Below -->


## Properties

| Property    | Attribute    | Description                                                         | Type                                        | Default     |
| ----------- | ------------ | ------------------------------------------------------------------- | ------------------------------------------- | ----------- |
| `cellAlign` | `cell-align` | Sets the text alignment within the head cell.                       | `"center" \| "end" \| "justify" \| "start"` | `undefined` |
| `sortable`  | `sortable`   | Determines whether the table column is sortable when set to `true`. | `boolean`                                   | `undefined` |


## Events

| Event          | Description                                                                                                                                     | Type                                                  |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| `pdsTableSort` | Event emitted to signal that a table column header has been sorted, providing information about the sorted column's name and sorting direction. | `CustomEvent<{ column: string; direction: string; }>` |


## Shadow Parts

| Part          | Description |
| ------------- | ----------- |
| `"head-cell"` |             |
| `"sort-icon"` |             |


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


