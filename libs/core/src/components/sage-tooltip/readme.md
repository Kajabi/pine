# my-component



<!-- Auto Generated Below -->


## Properties

| Property      | Attribute      | Description                                                        | Type                                                                                                                                                                 | Default     |
| ------------- | -------------- | ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `componentId` | `component-id` | Id used to reference the component                                 | `""`                                                                                                                                                                 | `undefined` |
| `content`     | `content`      | Content for the tooltip. If HTML is required, use the content slot | `""`                                                                                                                                                                 | `undefined` |
| `customWidth` | `custom-width` | If populated, this will be the tooltip content's width             | `number`                                                                                                                                                             | `undefined` |
| `disabled`    | `disabled`     | Determines whether or not the tooltip have an arrow                | `boolean`                                                                                                                                                            | `false`     |
| `hasArrow`    | `has-arrow`    | Determines whether or not the tooltip have an arrow                | `boolean`                                                                                                                                                            | `undefined` |
| `htmlContent` | `html-content` | Enable this option when using the content slot                     | `boolean`                                                                                                                                                            | `undefined` |
| `opened`      | `opened`       | Determines whether or not the tooltip is visible                   | `boolean`                                                                                                                                                            | `false`     |
| `placement`   | `placement`    | Determines the preferred position of the tooltip                   | `"bottom" \| "bottom-end" \| "bottom-start" \| "left" \| "left-end" \| "left-start" \| "right" \| "right-end" \| "right-start" \| "top" \| "top-end" \| "top-start"` | `'top'`     |


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

| Slot          | Description                  |
| ------------- | ---------------------------- |
| `"(default)"` | The tooltip's target element |
| `"content"`   | HTML content for the tooltip |


## Shadow Parts

| Part        | Description                                |
| ----------- | ------------------------------------------ |
| `"arrow"`   | The arrow attached to the tooltip content. |
| `"content"` | The tooltip content.                       |
| `"trigger"` | The tooltip trigger.                       |


----------------------------------------------


