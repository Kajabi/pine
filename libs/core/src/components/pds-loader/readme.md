# pds-loader



<!-- Auto Generated Below -->


## Properties

| Property    | Attribute    | Description                                                                                                                                                                    | Type                    | Default     |
| ----------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------- | ----------- |
| `isLoading` | `is-loading` | If false, the loader will be hidden.                                                                                                                                           | `boolean`               | `true`      |
| `showLabel` | `show-label` | Determines whether the loader should display a label.                                                                                                                          | `boolean`               | `false`     |
| `size`      | `size`       | Sets the size of the spinner loader: `xs` (24px), `sm` (32px), `md` (48px), `lg` (64px), `xl` (80px), or a custom CSS length such as `128px`. The `typing` variant ignores it. | `string`                | `'md'`      |
| `variant`   | `variant`    | Determines the type of loader.                                                                                                                                                 | `"spinner" \| "typing"` | `'spinner'` |


## Slots

| Slot      | Description                                                                       |
| --------- | --------------------------------------------------------------------------------- |
| `"label"` | Label text. Defaults to "Loading...". Text outside this slot isn't shown or read. |


## Shadow Parts

| Part           | Description                                              |
| -------------- | -------------------------------------------------------- |
| `"loader-svg"` | Exposes the spinner SVG element for color customization. |


## Dependencies

### Used by

 - [pds-button](../pds-button)
 - [pds-combobox](../pds-combobox)
 - [pds-multiselect](../pds-multiselect)

### Graph
```mermaid
graph TD;
  pds-button --> pds-loader
  pds-combobox --> pds-loader
  pds-multiselect --> pds-loader
  style pds-loader fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------


