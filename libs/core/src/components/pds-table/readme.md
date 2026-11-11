# pds-table



<!-- Auto Generated Below -->


## Properties

| Property                   | Attribute                | Description                                                                                                                                                                                                                                                                                                                                                                                                                     | Type                | Default     |
| -------------------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- | ----------- |
| `compact`                  | `compact`                | Determines if the table displays with reduced table cell padding.                                                                                                                                                                                                                                                                                                                                                               | `boolean`           | `undefined` |
| `componentId` _(required)_ | `component-id`           | A unique identifier used for the table `id` attribute.                                                                                                                                                                                                                                                                                                                                                                          | `string`            | `undefined` |
| `defaultSortColumn`        | `default-sort-column`    | The name of the column to sort by on initial load. Must match the text content of a sortable column header.                                                                                                                                                                                                                                                                                                                     | `string`            | `undefined` |
| `defaultSortDirection`     | `default-sort-direction` | The direction to sort the default column on initial load. Only applies if `defaultSortColumn` is set.                                                                                                                                                                                                                                                                                                                           | `"asc" \| "desc"`   | `'asc'`     |
| `disableSelectAll`         | `disable-select-all`     | Hides the select-all checkbox in the table header while keeping individual row checkboxes functional. Only applies when `selectable` is true.                                                                                                                                                                                                                                                                                   | `boolean`           | `false`     |
| `fixedColumn`              | `fixed-column`           | Determines if the table displays a fixed first column.                                                                                                                                                                                                                                                                                                                                                                          | `boolean`           | `undefined` |
| `responsive`               | `responsive`             | Enables the table to be responsive by horizontally scrolling on smaller screens.                                                                                                                                                                                                                                                                                                                                                | `boolean`           | `undefined` |
| `rowDividers`              | `row-dividers`           | Adds divider borders between table rows. The last row will not have a bottom border.                                                                                                                                                                                                                                                                                                                                            | `boolean`           | `false`     |
| `selectable`               | `selectable`             | Determines if the table displays checkboxes for selectable rows.                                                                                                                                                                                                                                                                                                                                                                | `boolean`           | `undefined` |
| `tableLayout`              | `table-layout`           | Sets how the table sizes its columns. With `auto`, each column is sized from its content, so columns can change width when the rows change (for example after a sort). With `fixed`, columns take the `width` set on their `pds-table-head-cell` and ignore their content; columns without a `width` share the remaining space. Content longer than its column overflows, so add `truncate` to cells whose content may not fit. | `"auto" \| "fixed"` | `'auto'`    |


## Events

| Event               | Description                                                                                                                                                                     | Type                                    |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| `pdsTableSelectAll` | Event that is emitted by `pds-table-head` when the select all checkbox is clicked, carrying the selected value. It bubbles through the table; the table doesn't emit it itself. | `CustomEvent<{ isSelected: boolean; }>` |


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


