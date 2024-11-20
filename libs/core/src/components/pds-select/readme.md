# pds-select



<!-- Auto Generated Below -->


## Properties

| Property                   | Attribute        | Description                                                                        | Type      | Default     |
| -------------------------- | ---------------- | ---------------------------------------------------------------------------------- | --------- | ----------- |
| `autocomplete`             | `autocomplete`   | Specifies if and how the browser provides `autocomplete` assistance for the field. | `string`  | `undefined` |
| `componentId` _(required)_ | `component-id`   | A unique identifier used for the underlying component `id` attribute.              | `string`  | `undefined` |
| `disabled`                 | `disabled`       | Indicates whether or not the select field is disabled.                             | `boolean` | `undefined` |
| `errorMessage`             | `error-message`  | Specifies the error message and provides an error-themed treatment to the field.   | `string`  | `undefined` |
| `helperMessage`            | `helper-message` | Displays a message or hint below the input field.                                  | `string`  | `undefined` |
| `label`                    | `label`          | Text to be displayed as the select label.                                          | `string`  | `undefined` |
| `name` _(required)_        | `name`           | Specifies the name. Submitted with the form name/value pair.                       | `string`  | `undefined` |
| `required`                 | `required`       | Indicates whether or not the select field is required.                             | `boolean` | `undefined` |
| `value`                    | `value`          | The value of the select field.                                                     | `string`  | `undefined` |


## Events

| Event       | Description                             | Type                      |
| ----------- | --------------------------------------- | ------------------------- |
| `pdsSelect` | Emitted when a keyboard input occurred. | `CustomEvent<InputEvent>` |


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


