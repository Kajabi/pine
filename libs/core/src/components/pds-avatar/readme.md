# pds-avatar



<!-- Auto Generated Below -->


## Properties

| Property  | Attribute | Description                                                                                         | Type                                   | Default      |
| --------- | --------- | --------------------------------------------------------------------------------------------------- | -------------------------------------- | ------------ |
| `badge`   | `badge`   | Determines whether the badge is visible or not                                                      | `boolean`                              | `false`      |
| `image`   | `image`   | The src for a custom user image.                                                                    | `string`                               | `undefined`  |
| `size`    | `size`    | Preset sizes for the avatar. If a custom size is desired, use the `--size` custom property instead. | `"lg" \| "md" \| "sm" \| "xl" \| "xs"` | `'md'`       |
| `variant` | `variant` | Determines the variant of avatar. Changes appearance accordingly.                                   | `"admin" \| "customer"`                | `'customer'` |


## CSS Custom Properties

| Name     | Description                                                                      |
| -------- | -------------------------------------------------------------------------------- |
| `--size` | Custom size of avatar. Setting this will *not* override a set `size` prop value. |


## Dependencies

### Depends on

- pds-icon

### Graph
```mermaid
graph TD;
  pds-avatar --> pds-icon
  style pds-avatar fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------


