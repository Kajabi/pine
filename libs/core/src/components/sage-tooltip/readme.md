# my-component



<!-- Auto Generated Below -->


## Properties

| Property      | Attribute      | Description                                                        | Type                                                                                                                                                                 | Default     |
| ------------- | -------------- | ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `componentId` | `component-id` | Id used to reference the component                                 | `string`                                                                                                                                                             | `undefined` |
| `content`     | `content`      | Content for the tooltip. If HTML is required, use the content slot | `string`                                                                                                                                                             | `undefined` |
| `hasArrow`    | `has-arrow`    | Determines whether or not the tooltip has an arrow                 | `boolean`                                                                                                                                                            | `true`      |
| `htmlContent` | `html-content` | Enable this option when using the content slot                     | `boolean`                                                                                                                                                            | `false`     |
| `opened`      | `opened`       | Determines whether or not the tooltip is visible                   | `boolean`                                                                                                                                                            | `false`     |
| `placement`   | `placement`    | Determines the preferred position of the tooltip                   | `"bottom" \| "bottom-end" \| "bottom-start" \| "left" \| "left-end" \| "left-start" \| "right" \| "right-end" \| "right-start" \| "top" \| "top-end" \| "top-start"` | `'right'`   |


## Events

| Event             | Description                       | Type               |
| ----------------- | --------------------------------- | ------------------ |
| `sageTooltipHide` | Emitted after a tooltip is closed | `CustomEvent<any>` |
| `sageTooltipShow` | Emitted after a tooltip is shown  | `CustomEvent<any>` |


## Methods

### `hideTooltip() => Promise<void>`

Hides the tooltip by disabling the opened property

#### Returns

Type: `Promise<void>`



### `showTooltip() => Promise<void>`

Shows the tooltip by enabling the opened property

#### Returns

Type: `Promise<void>`




## Slots

| Slot          | Description                  |
| ------------- | ---------------------------- |
| `"(default)"` | The tooltip's target element |
| `"content"`   | HTML content for the tooltip |


----------------------------------------------


