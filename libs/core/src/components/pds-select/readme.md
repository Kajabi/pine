# pds-select



<!-- Auto Generated Below -->


## Properties

| Property                   | Attribute        | Description                                                                                                                                                       | Type                 | Default     |
| -------------------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- | ----------- |
| `autocomplete`             | `autocomplete`   | Specifies if and how the browser provides `autocomplete` assistance for the field.                                                                                | `string`             | `undefined` |
| `componentId` _(required)_ | `component-id`   | A unique identifier used for the underlying component `id` attribute.                                                                                             | `string`             | `undefined` |
| `disabled`                 | `disabled`       | Indicates whether or not the select field is disabled.                                                                                                            | `boolean`            | `false`     |
| `errorMessage`             | `error-message`  | Displays error message text describing an invalid state.                                                                                                          | `string`             | `undefined` |
| `helperMessage`            | `helper-message` | Displays helper message text below select.                                                                                                                        | `string`             | `undefined` |
| `hideLabel`                | `hide-label`     | Visually hides the label text for instances where only the checkbox should be displayed. Label remains accessible to assistive technology such as screen readers. | `boolean`            | `undefined` |
| `invalid`                  | `invalid`        | Determines whether or not the select is invalid.                                                                                                                  | `boolean`            | `undefined` |
| `label`                    | `label`          | Text to be displayed as the select label.                                                                                                                         | `string`             | `undefined` |
| `multiple`                 | `multiple`       | Indicates whether multiple options can be selected.                                                                                                               | `boolean`            | `false`     |
| `name` _(required)_        | `name`           | Specifies the name. Submitted with the form name/value pair.                                                                                                      | `string`             | `undefined` |
| `required`                 | `required`       | Indicates whether or not the select field is required.                                                                                                            | `boolean`            | `false`     |
| `value`                    | `value`          | The value(s) of the selected option(s).                                                                                                                           | `string \| string[]` | `undefined` |


## Events

| Event             | Description                           | Type                      |
| ----------------- | ------------------------------------- | ------------------------- |
| `pdsSelectChange` | Emitted when a keyboard input occurs. | `CustomEvent<InputEvent>` |


## Shadow Parts

| Part       | Description |
| ---------- | ----------- |
| `"select"` |             |


## Dependencies

### Depends on

- pds-icon

### Graph
```mermaid
graph TD;
  pds-select --> pds-icon
  style pds-select fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------


