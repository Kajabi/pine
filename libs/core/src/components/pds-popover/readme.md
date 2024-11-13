# pds-popover



<!-- Auto Generated Below -->


## Properties

| Property      | Attribute      | Description                                                           | Type                                                                                                                                                                 | Default     |
| ------------- | -------------- | --------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `componentId` | `component-id` | A unique identifier used for the underlying component `id` attribute. | `string`                                                                                                                                                             | `undefined` |
| `hasArrow`    | `has-arrow`    | Determines whether or not the popover has an arrow                    | `boolean`                                                                                                                                                            | `true`      |
| `placement`   | `placement`    | Determines the preferred position of the popover                      | `"bottom" \| "bottom-end" \| "bottom-start" \| "left" \| "left-end" \| "left-start" \| "right" \| "right-end" \| "right-start" \| "top" \| "top-end" \| "top-start"` | `'right'`   |


## Events

| Event            | Description                       | Type               |
| ---------------- | --------------------------------- | ------------------ |
| `pdsPopoverHide` | Emitted after a popover is closed | `CustomEvent<any>` |
| `pdsPopoverShow` | Emitted after a popover is shown  | `CustomEvent<any>` |


## Slots

| Slot          | Description                  |
| ------------- | ---------------------------- |
| `"(default)"` | The popover's target element |
| `"content"`   | HTML content for the popover |


----------------------------------------------


