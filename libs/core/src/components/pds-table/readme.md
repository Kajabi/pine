# pds-table



<!-- Auto Generated Below -->


## Properties

| Property                   | Attribute                | Description                                                                                                                                   | Type              | Default     |
| -------------------------- | ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | ----------- |
| `compact`                  | `compact`                | Determines if the table displays with reduced table cell padding.                                                                             | `boolean`         | `undefined` |
| `componentId` _(required)_ | `component-id`           | A unique identifier used for the table `id` attribute.                                                                                        | `string`          | `undefined` |
| `defaultSortColumn`        | `default-sort-column`    | The name of the column to sort by on initial load. Must match the text content of a sortable column header.                                   | `string`          | `undefined` |
| `defaultSortDirection`     | `default-sort-direction` | The direction to sort the default column on initial load. Only applies if `defaultSortColumn` is set.                                         | `"asc" \| "desc"` | `'asc'`     |
| `disableSelectAll`         | `disable-select-all`     | Hides the select-all checkbox in the table header while keeping individual row checkboxes functional. Only applies when `selectable` is true. | `boolean`         | `false`     |
| `fixedColumn`              | `fixed-column`           | Determines if the should display a fixed first column.                                                                                        | `boolean`         | `undefined` |
| `responsive`               | `responsive`             | Enables the table to be responsive by horizontally scrolling on smaller screens.                                                              | `boolean`         | `undefined` |
| `rowDividers`              | `row-dividers`           | Adds divider borders between table rows. The last row will not have a bottom border.                                                          | `boolean`         | `false`     |
| `selectable`               | `selectable`             | Determines if the table displays checkboxes for selectable rows.                                                                              | `boolean`         | `undefined` |


## Events

| Event               | Description                                                                                 | Type                                    |
| ------------------- | ------------------------------------------------------------------------------------------- | --------------------------------------- |
| `pdsTableSelectAll` | Event that is emitted when the select all checkbox is clicked, carrying the selected value. | `CustomEvent<{ isSelected: boolean; }>` |


## Shadow Parts

| Part                     | Description |
| ------------------------ | ----------- |
| `"responsive-container"` |             |
| `"responsive-table"`     |             |
| `"responsive-wrapper"`   |             |
| `"scroll-shadow-left"`   |             |
| `"scroll-shadow-right"`  |             |
| `"table"`                |             |
| `"table-inner"`          |             |


----------------------------------------------


