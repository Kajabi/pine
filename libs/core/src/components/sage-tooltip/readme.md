# my-component



<!-- Auto Generated Below -->


## Properties

| Property      | Attribute      | Description                                                        | Type                                                                                                                                                                 | Default     |
| ------------- | -------------- | ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `componentId` | `component-id` | Id used to reference the component                                 | `""`                                                                                                                                                                 | `undefined` |
| `content`     | `content`      | Content for the tooltip. If HTML is required, use the content slot | `""`                                                                                                                                                                 | `undefined` |
| `disabled`    | `disabled`     | Determines whether or not the tooltip is disabled                  | `boolean`                                                                                                                                                            | `false`     |
| `hasArrow`    | `has-arrow`    | Determines whether or not the tooltip have an arrow                | `boolean`                                                                                                                                                            | `undefined` |
| `htmlContent` | `html-content` | Enable this option when using the content slot                     | `boolean`                                                                                                                                                            | `undefined` |
| `opened`      | `opened`       | Determines whether or not the tooltip is visible                   | `boolean`                                                                                                                                                            | `false`     |
| `placement`   | `placement`    | Determines the preferred position of the tooltip                   | `"bottom" \| "bottom-end" \| "bottom-start" \| "left" \| "left-end" \| "left-start" \| "right" \| "right-end" \| "right-start" \| "top" \| "top-end" \| "top-start"` | `undefined` |


## Events

| Event             | Description                       | Type               |
| ----------------- | --------------------------------- | ------------------ |
| `sageTooltipHide` | Emitted after a tooltip is closed | `CustomEvent<any>` |
| `sageTooltipShow` | Emitted after a tooltip is shown  | `CustomEvent<any>` |


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


## CSS Custom Properties

| Name                            | Description                     |
| ------------------------------- | ------------------------------- |
| `--arrow-offset`                | arrow offset position           |
| `--arrow-pointing-down`         | shape for downward facing arrow |
| `--arrow-pointing-to-the-left`  | shape for left facing arrow     |
| `--arrow-pointing-to-the-right` | shape for right facing arrow    |
| `--arrow-pointing-up`           | shape for upward facing arrow   |
| `--arrow-size`                  | width and height of the arrow   |
| `--background`                  | Background of the tooltip       |
| `--color`                       | Text color of the tooltip       |
| `--overlay-border-radius`       | overlay border-radius           |
| `--overlay-font-size`           | overlay font-size               |
| `--overlay-line-height`         | overlay line-height             |
| `--overlay-padding`             | overlay padding                 |


----------------------------------------------


