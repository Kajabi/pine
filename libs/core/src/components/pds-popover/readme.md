# pds-popover



<!-- Auto Generated Below -->


## Properties

| Property      | Attribute      | Description                                                        | Type                                                                                                                                                                 | Default     |
| ------------- | -------------- | ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `componentId` | `component-id` | Id used to reference the component                                 | `string`                                                                                                                                                             | `undefined` |
| `content`     | `content`      | Content for the popover. If HTML is required, use the content slot | `string`                                                                                                                                                             | `undefined` |
| `hasArrow`    | `has-arrow`    | Determines whether or not the popover has an arrow                 | `boolean`                                                                                                                                                            | `true`      |
| `htmlContent` | `html-content` | Enable this option when using the content slot                     | `boolean`                                                                                                                                                            | `false`     |
| `opened`      | `opened`       | Determines whether or not the popover is visible                   | `boolean`                                                                                                                                                            | `false`     |
| `options`     | --             | A list of options for the popover                                  | `string[]`                                                                                                                                                           | `[]`        |
| `placement`   | `placement`    | Determines the preferred position of the popover                   | `"bottom" \| "bottom-end" \| "bottom-start" \| "left" \| "left-end" \| "left-start" \| "right" \| "right-end" \| "right-start" \| "top" \| "top-end" \| "top-start"` | `'right'`   |


## Events

| Event            | Description                       | Type               |
| ---------------- | --------------------------------- | ------------------ |
| `pdsPopoverHide` | Emitted after a popover is closed | `CustomEvent<any>` |
| `pdsPopoverShow` | Emitted after a popover is shown  | `CustomEvent<any>` |


## Methods

### `hidePopover() => Promise<void>`

Hides the popover by disabling the opened property

#### Returns

Type: `Promise<void>`



### `showPopover() => Promise<void>`

Shows the popover by enabling the opened property

#### Returns

Type: `Promise<void>`



### `togglePopover() => Promise<void>`

Toggles the popover visibility on click

#### Returns

Type: `Promise<void>`




## Slots

| Slot          | Description                  |
| ------------- | ---------------------------- |
| `"(default)"` | The popover's target element |
| `"content"`   | HTML content for the popover |


----------------------------------------------


