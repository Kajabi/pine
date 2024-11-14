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


## Methods

### `hide() => Promise<void>`

Hides the popover by disabling the isOpen state

#### Returns

Type: `Promise<void>`



### `show() => Promise<void>`

Shows the popover by enabling the isOpen state

#### Returns

Type: `Promise<void>`




## Slots

| Slot        | Description                  |
| ----------- | ---------------------------- |
| `"content"` | HTML content for the popover |
| `"trigger"` | The popover's target element |


----------------------------------------------


