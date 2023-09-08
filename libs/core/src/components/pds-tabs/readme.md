# pds-tabs



<!-- Auto Generated Below -->


## Properties

| Property                     | Attribute         | Description                                                                          | Type                                      | Default     |
| ---------------------------- | ----------------- | ------------------------------------------------------------------------------------ | ----------------------------------------- | ----------- |
| `activeTabName` _(required)_ | `active-tab-name` | Sets the starting active tab name and maintains the name as the component re-renders | `string`                                  | `undefined` |
| `componentId` _(required)_   | `component-id`    | A unique identifier used for the underlying component `id` attribute.                | `string`                                  | `undefined` |
| `tablistLabel` _(required)_  | `tablist-label`   | Sets the aria-label attached to the tablist element                                  | `string`                                  | `undefined` |
| `variant` _(required)_       | `variant`         | Sets tabs variant styles as outlined in Figma documentation                          | `"availability" \| "filter" \| "primary"` | `undefined` |


## Slots

| Slot          | Description                                                                    |
| ------------- | ------------------------------------------------------------------------------ |
| `"tabpanels"` | Content is placed directly after the `div[role="tablist"]` element as siblings |
| `"tabs"`      | Content is placed within the `div[role="tablist"]` element as children         |


## CSS Custom Properties

| Name                 | Description                    |
| -------------------- | ------------------------------ |
| `--panel-margin-top` | Optional margin-top for panels |
| `--panel-padding`    | Optional padding for panels    |


----------------------------------------------


