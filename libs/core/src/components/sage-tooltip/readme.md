# my-component



<!-- Auto Generated Below -->


## Properties

| Property    | Attribute    | Description                                                        | Type                                                                                                                                                                 | Default     |
| ----------- | ------------ | ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `content`   | `content`    | Content for the tooltip. If HTML is required, use the content slot | `""`                                                                                                                                                                 | `undefined` |
| `hasArrow`  | `has-arrow`  | Determines whether or not the tooltip have an arrow                | `boolean`                                                                                                                                                            | `undefined` |
| `isVisible` | `is-visible` | Determines whether or not the tooltip is visible                   | `boolean`                                                                                                                                                            | `false`     |
| `placement` | `placement`  | Determines the preferred position of the tooltip                   | `"bottom" \| "bottom-end" \| "bottom-start" \| "left" \| "left-end" \| "left-start" \| "right" \| "right-end" \| "right-start" \| "top" \| "top-end" \| "top-start"` | `'top'`     |


## Events

| Event      | Description                       | Type               |
| ---------- | --------------------------------- | ------------------ |
| `sageHide` | Emitted after a tooltip is closed | `CustomEvent<any>` |
| `sageShow` | Emitted after a tooltip is shown  | `CustomEvent<any>` |


## Methods

### `hideTooltip() => Promise<void>`



#### Returns

Type: `Promise<void>`



### `showTooltip() => Promise<void>`



#### Returns

Type: `Promise<void>`




## Slots

| Slot        | Description                  |
| ----------- | ---------------------------- |
|             | The tooltip's target element |
| `"content"` | Content inside the tooltip   |


## Shadow Parts

| Part        | Description |
| ----------- | ----------- |
| `"arrow"`   |             |
| `"content"` |             |


----------------------------------------------


