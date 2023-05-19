# sage-textarea



<!-- Auto Generated Below -->


## Properties

| Property       | Attribute       | Description                                                                                         | Type      | Default            |
| -------------- | --------------- | --------------------------------------------------------------------------------------------------- | --------- | ------------------ |
| `componentId`  | `component-id`  | A unique identifier for the textarea                                                                | `string`  | `undefined`        |
| `disabled`     | `disabled`      | Indicates whether or not the textarea is disabled                                                   | `boolean` | `false`            |
| `errorMessage` | `error-message` | Specifies the error text and provides an error-themed treatment to the field                        | `string`  | `undefined`        |
| `hintMessage`  | `hint-message`  | Displays a hint or description of the textarea                                                      | `string`  | `undefined`        |
| `invalid`      | `invalid`       | Indicates whether or not the textarea is invalid or throws an error                                 | `boolean` | `false`            |
| `label`        | `label`         | Text to be displayed as the textarea label                                                          | `string`  | `undefined`        |
| `name`         | `name`          | Specifies the name, submitted with the form name/value pair. This value will mirror the componentId | `string`  | `this.componentId` |
| `placeholder`  | `placeholder`   | Specifies a short hint that describes the expected value of the textarea                            | `string`  | `undefined`        |
| `readonly`     | `readonly`      | Indicates whether or not the textarea is readonly                                                   | `boolean` | `false`            |
| `required`     | `required`      | Indicates whether or not the textarea is required                                                   | `boolean` | `false`            |
| `rows`         | `rows`          | Sets number of rows of text visible without needing to scroll in the textarea                       | `number`  | `undefined`        |
| `value`        | `value`         | The value of the textarea                                                                           | `string`  | `undefined`        |


## Events

| Event                | Description                                              | Type                                     |
| -------------------- | -------------------------------------------------------- | ---------------------------------------- |
| `sageTextareaChange` | Event emitted whenever the value of the textarea changes | `CustomEvent<TextareaChangeEventDetail>` |


----------------------------------------------


