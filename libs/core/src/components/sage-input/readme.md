# sage-input



<!-- Auto Generated Below -->


## Properties

| Property      | Attribute     | Description                                                                                                  | Type      | Default     |
| ------------- | ------------- | ------------------------------------------------------------------------------------------------------------ | --------- | ----------- |
| `disabled`    | `disabled`    | Indicates whether or not the input field is disabled                                                         | `boolean` | `undefined` |
| `errorText`   | `error-text`  | Specifies the error text and provides an error-themed treatment to the field                                 | `string`  | `undefined` |
| `hint`        | `hint`        | Displays a hint or description of the input field                                                            | `string`  | `undefined` |
| `id`          | `id`          | A unique identifier for the input field                                                                      | `string`  | `undefined` |
| `invalid`     | `invalid`     | Indicates whether or not the input field is invalid or throws an error                                       | `boolean` | `undefined` |
| `label`       | `label`       | Text to be displayed as the form label                                                                       | `string`  | `undefined` |
| `name`        | `name`        | Specifies the name. Submitted with the form name/value pair                                                  | `string`  | `undefined` |
| `placeholder` | `placeholder` | Specifies a short hint that describes the expected value of the input field                                  | `string`  | `undefined` |
| `readonly`    | `readonly`    | Indicates whether or not the input field is readonly                                                         | `boolean` | `undefined` |
| `required`    | `required`    | Indicates whether or not the input field is required                                                         | `boolean` | `undefined` |
| `type`        | `type`        | Determines the type of control that will be displayed `'email'`, `'number'`, `'password'`, `'tel'`, `'text'` | `string`  | `'text'`    |
| `value`       | `value`       | The value of the input "text"                                                                                | `string`  | `undefined` |


## Events

| Event     | Description                            | Type                      |
| --------- | -------------------------------------- | ------------------------- |
| `onInput` | Emitted when a keyboard input occurred | `CustomEvent<InputEvent>` |


## Slots

| Slot | Description                                        |
| ---- | -------------------------------------------------- |
|      | Content is placed between the opening closing tags |


## CSS Custom Properties

| Name                     | Description                                   |
| ------------------------ | --------------------------------------------- |
| `--background`           | Background of the input                       |
| `--background-disabled`  | Background color of a disabled input          |
| `--border-color-default` | Border color of the input text                |
| `--color`                | Color of the input text                       |
| `--color-error`          | Color of the input text when error is present |
| `--color-hover`          | Border color of the input text when hovered   |
| `--field-font-size`      | Font size of the field text                   |
| `--field-font-weight`    | Font weight of the field text                 |
| `--field-line-height`    | Line height of the field text                 |
| `--field-padding-block`  | Block padding for the field text              |
| `--field-padding-inline` | Inline padding for the field text             |
| `--hint-font-size`       | Font size of the hint text                    |
| `--hint-font-weight`     | Font weight of the hint text                  |
| `--hint-line-height`     | Line height of the hint text                  |
| `--hint-margin-top`      | Bottom margin of the hint                     |
| `--label-font-size`      | Font size of the label text                   |
| `--label-font-weight`    | Font weight of the label text                 |
| `--label-line-height`    | Line height of the label text                 |
| `--label-margin-bottom`  | Bottom margin of the label                    |


----------------------------------------------


