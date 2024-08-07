# pds-table



<!-- Auto Generated Below -->


## Properties

| Property                   | Attribute      | Description                                                                          | Type      | Default     |
| -------------------------- | -------------- | ------------------------------------------------------------------------------------ | --------- | ----------- |
| `compact`                  | `compact`      | Determines if table displays compact which reduces the spacing of table cells.       | `boolean` | `undefined` |
| `componentId` _(required)_ | `component-id` | A unique identifier used for the table `id` attribute.                               | `string`  | `undefined` |
| `fixedColumn`              | `fixed-column` | Determines if table displays fixed column which fixes the first column of the table. | `boolean` | `undefined` |
| `responsive`               | `responsive`   | Enables the table to be responsive by horizontally scrolling on smaller screens.     | `boolean` | `undefined` |
| `selectable`               | `selectable`   | Determines if table displays checkboxes for selectable rows.                         | `boolean` | `undefined` |


## Events

| Event               | Description                                                                                   | Type                                                      |
| ------------------- | --------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| `pdsTableSelect`    | Event that is emitted when the checkbox is clicked, carrying the rowIndex and selected value. | `CustomEvent<{ rowIndex: number; isSelected: boolean; }>` |
| `pdsTableSelectAll` | Event that is emitted when the select all checkbox is clicked, carrying the selected value.   | `CustomEvent<{ isSelected: boolean; }>`                   |


----------------------------------------------


