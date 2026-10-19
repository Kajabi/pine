# pds-divider



<!-- Auto Generated Below -->


## Properties

| Property      | Attribute      | Description                                                                                                                          | Type                                                     | Default     |
| ------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------- | ----------- |
| `componentId` | `component-id` | A unique identifier for this component instance. Does not set the host element's `id` attribute — set `id` directly if you need one. | `string`                                                 | `undefined` |
| `label`       | `label`        | Text to be displayed as the divider label, centered between two lines. Ignored when `vertical` is `true`.                            | `string`                                                 | `undefined` |
| `offset`      | `offset`       | Adds offset margin/padding to expand the width (horizontal) or the height (vertical) of divider.                                     | `"lg" \| "md" \| "sm" \| "xl" \| "xs" \| "xxl" \| "xxs"` | `undefined` |
| `vertical`    | `vertical`     | Sets divider to display vertically.                                                                                                  | `boolean`                                                | `false`     |


## Shadow Parts

| Part      | Description                                                                                                             |
| --------- | ----------------------------------------------------------------------------------------------------------------------- |
| `"label"` | Exposes the label text for styling, such as a custom color. Appears only when `label` is set and `vertical` is `false`. |


----------------------------------------------


