# pds-popover



<!-- Auto Generated Below -->


## Properties

| Property              | Attribute               | Description                                                           | Type                                                                                                                                                                 | Default     |
| --------------------- | ----------------------- | --------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `componentId`         | `component-id`          | A unique identifier used for the underlying component `id` attribute. | `string`                                                                                                                                                             | `undefined` |
| `maxWidth`            | `max-width`             | Sets the maximum width of the popover content                         | `string`                                                                                                                                                             | `'352px'`   |
| `placement`           | `placement`             | Determines the preferred position of the popover                      | `"bottom" \| "bottom-end" \| "bottom-start" \| "left" \| "left-end" \| "left-start" \| "right" \| "right-end" \| "right-start" \| "top" \| "top-end" \| "top-start"` | `'right'`   |
| `popoverTargetAction` | `popover-target-action` | Determines the action that triggers the popover                       | `"hide" \| "show"`                                                                                                                                                   | `'show'`    |
| `popoverType`         | `popover-type`          |                                                                       | `"auto" \| "manual"`                                                                                                                                                 | `'auto'`    |
| `text`                | `text`                  | Text that appears on the trigger element                              | `string`                                                                                                                                                             | `undefined` |


## Events

| Event            | Description                        | Type               |
| ---------------- | ---------------------------------- | ------------------ |
| `hidePdsPopover` | Emitted when the popover is hidden | `CustomEvent<any>` |
| `showPdsPopover` | Emitted when the popover is shown  | `CustomEvent<any>` |


## Methods

### `hide() => Promise<void>`

Hides the popover by disabling the active state

#### Returns

Type: `Promise<void>`



### `show() => Promise<void>`

Shows the popover by enabling the active state

#### Returns

Type: `Promise<void>`




----------------------------------------------


