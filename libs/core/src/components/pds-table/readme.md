# pds-table



<!-- Auto Generated Below -->


## Properties

| Property                   | Attribute      | Description                                                                                                                       | Type      | Default     |
| -------------------------- | -------------- | --------------------------------------------------------------------------------------------------------------------------------- | --------- | ----------- |
| `compact`                  | `compact`      | Determines if the table displays with reduced table cell padding.                                                                 | `boolean` | `undefined` |
| `componentId` _(required)_ | `component-id` | A unique identifier used for the table `id` attribute.                                                                            | `string`  | `undefined` |
| `fixedColumn`              | `fixed-column` | Determines if the should display a fixed first column.                                                                            | `boolean` | `undefined` |
| `fixedHeader`              | `fixed-header` | Determines if the table displays a fixed header that remains visible during vertical scrolling.                                   | `boolean` | `undefined` |
| `maxHeight`                | `max-height`   | Maximum height of the table container. When set, enables vertical scrolling. Accepts CSS height values like "400px", "50vh", etc. | `string`  | `undefined` |
| `responsive`               | `responsive`   | Enables the table to be responsive by horizontally scrolling on smaller screens.                                                  | `boolean` | `undefined` |
| `selectable`               | `selectable`   | Determines if the table displays checkboxes for selectable rows.                                                                  | `boolean` | `undefined` |


## Events

| Event               | Description                                                                                   | Type                                                      |
| ------------------- | --------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| `pdsTableSelect`    | Event that is emitted when the checkbox is clicked, carrying the rowIndex and selected value. | `CustomEvent<{ rowIndex: number; isSelected: boolean; }>` |
| `pdsTableSelectAll` | Event that is emitted when the select all checkbox is clicked, carrying the selected value.   | `CustomEvent<{ isSelected: boolean; }>`                   |


----------------------------------------------


