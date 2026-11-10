# pds-popover



<!-- Auto Generated Below -->


## Properties

| Property              | Attribute               | Description                                                                                                                                                                                                                            | Type                                                                                                                                                                 | Default     |
| --------------------- | ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `componentId`         | `component-id`          | A unique identifier used for the underlying component `id` attribute.                                                                                                                                                                  | `string`                                                                                                                                                             | `undefined` |
| `maxWidth`            | `max-width`             | Sets the maximum width of the popover content                                                                                                                                                                                          | `number`                                                                                                                                                             | `352`       |
| `openOn`              | `open-on`               | Determines how the popover opens. With `hover`, it also opens when the pointer rests on the trigger and closes when the pointer leaves, until a click on the trigger keeps it open. Enter or Space on the trigger opens it either way. | `"click" \| "hover"`                                                                                                                                                 | `'click'`   |
| `padding`             | `padding`               | Sets the padding of the popover content                                                                                                                                                                                                | `"md" \| "none" \| "sm" \| "xs"`                                                                                                                                     | `'md'`      |
| `placement`           | `placement`             | Determines the preferred position of the popover                                                                                                                                                                                       | `"bottom" \| "bottom-end" \| "bottom-start" \| "left" \| "left-end" \| "left-start" \| "right" \| "right-end" \| "right-start" \| "top" \| "top-end" \| "top-start"` | `'right'`   |
| `popoverTargetAction` | `popover-target-action` | Determines the action that triggers the popover. For manual popovers, the consumer is responsible for toggling this value.                                                                                                             | `"hide" \| "show" \| "toggle"`                                                                                                                                       | `'show'`    |
| `popoverType`         | `popover-type`          | Determines the type of popover. Auto popovers can be "light dismissed" by clicking outside of the popover. Manual popovers require the consumer to handle the visibility of the popover.                                               | `"auto" \| "manual"`                                                                                                                                                 | `'auto'`    |


## Events

| Event             | Description                        | Type                                 |
| ----------------- | ---------------------------------- | ------------------------------------ |
| `pdsPopoverClose` | Emitted when the popover is closed | `CustomEvent<PdsPopoverEventDetail>` |
| `pdsPopoverOpen`  | Emitted when the popover is opened | `CustomEvent<PdsPopoverEventDetail>` |


## Methods

### `hide() => Promise<void>`

Closes the popover programmatically

#### Returns

Type: `Promise<void>`



### `show() => Promise<void>`

Opens the popover programmatically

#### Returns

Type: `Promise<void>`



### `toggle() => Promise<void>`

Toggles the popover open/closed state programmatically

#### Returns

Type: `Promise<void>`




## Slots

| Slot          | Description                               |
| ------------- | ----------------------------------------- |
| `"(default)"` | The content to display inside the popover |
| `"trigger"`   | The trigger element for the popover       |


----------------------------------------------


