# pds-select



<!-- Auto Generated Below -->


## Properties

| Property        | Attribute        | Description                                                              | Type                 | Default     |
| --------------- | ---------------- | ------------------------------------------------------------------------ | -------------------- | ----------- |
| `componentId`   | `component-id`   | A unique identifier for the field                                        | `string`             | `undefined` |
| `disabled`      | `disabled`       | Indicates whether or not the field is disabled                           | `boolean`            | `undefined` |
| `errorMessage`  | `error-message`  | Displays an error message for the field                                  | `string`             | `undefined` |
| `helperMessage` | `helper-message` | Displays a hint or description of the field                              | `string`             | `undefined` |
| `invalid`       | `invalid`        | Indicates whether or not the field is invalid or throws an error         | `boolean`            | `undefined` |
| `label`         | `label`          | Text to be displayed as the label                                        | `string`             | `undefined` |
| `multiple`      | `multiple`       | Enables multiselect                                                      | `boolean`            | `false`     |
| `name`          | `name`           | Specifies the name. Submitted with the form name/value pair              | `string`             | `undefined` |
| `required`      | `required`       | Indicates whether or not the field is required                           | `boolean`            | `undefined` |
| `value`         | `value`          | The value of the selected option. If multiple is true, this is an array. | `string \| string[]` | `undefined` |


## Events

| Event             | Description                            | Type                      |
| ----------------- | -------------------------------------- | ------------------------- |
| `pdsSelectChange` | Emitted when a keyboard input occurred | `CustomEvent<InputEvent>` |


----------------------------------------------


