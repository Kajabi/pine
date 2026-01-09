# pds-table



<!-- Auto Generated Below -->


## Properties

| Property                   | Attribute      | Description                                                                          | Type      | Default     |
| -------------------------- | -------------- | ------------------------------------------------------------------------------------ | --------- | ----------- |
| `compact`                  | `compact`      | Determines if the table displays with reduced table cell padding.                    | `boolean` | `undefined` |
| `componentId` _(required)_ | `component-id` | A unique identifier used for the table `id` attribute.                               | `string`  | `undefined` |
| `fixedColumn`              | `fixed-column` | Determines if the should display a fixed first column.                               | `boolean` | `undefined` |
| `responsive`               | `responsive`   | Enables the table to be responsive by horizontally scrolling on smaller screens.     | `boolean` | `undefined` |
| `rowDividers`              | `row-dividers` | Adds divider borders between table rows. The last row will not have a bottom border. | `boolean` | `undefined` |
| `selectable`               | `selectable`   | Determines if the table displays checkboxes for selectable rows.                     | `boolean` | `undefined` |


## Events

| Event               | Description                                                                                   | Type                                                      |
| ------------------- | --------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| `pdsTableSelect`    | Event that is emitted when the checkbox is clicked, carrying the rowIndex and selected value. | `CustomEvent<{ rowIndex: number; isSelected: boolean; }>` |
| `pdsTableSelectAll` | Event that is emitted when the select all checkbox is clicked, carrying the selected value.   | `CustomEvent<{ isSelected: boolean; }>`                   |


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


