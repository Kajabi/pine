# sage-switch



<!-- Auto Generated Below -->


## Properties

| Property                   | Attribute        | Description                                                                                      | Type                    | Default      |
| -------------------------- | ---------------- | ------------------------------------------------------------------------------------------------ | ----------------------- | ------------ |
| `checked`                  | `checked`        | Determines the input 'checked' state                                                             | `boolean`               | `false`      |
| `componentId` _(required)_ | `component-id`   | Identifies this input with a unique string, and associates the input with its label              | `string`                | `undefined`  |
| `disabled`                 | `disabled`       | Determines the input 'disabled' state, preventing user interaction                               | `boolean`               | `false`      |
| `errorMessage`             | `error-message`  | Displays message text describing an invalid state                                                | `string`                | `undefined`  |
| `helperMessage`            | `helper-message` | Displays help text for additional description of an input                                        | `string`                | `undefined`  |
| `invalid`                  | `invalid`        | Determines the input 'invalid' state, signifying an error is present                             | `boolean`               | `false`      |
| `label` _(required)_       | `label`          | Displays text to describe the input                                                              | `string`                | `undefined`  |
| `name`                     | `name`           | Identifies form data and unifies a group of radio inputs for toggling a single property/value    | `string`                | `undefined`  |
| `required`                 | `required`       | Determines the 'required' state of the input                                                     | `boolean`               | `false`      |
| `type`                     | `type`           | Specifies the underlying input element type                                                      | `"checkbox" \| "radio"` | `'checkbox'` |
| `value`                    | `value`          | Provides input with a string submitted in form data, and can be used to distinguish radio inputs | `string`                | `undefined`  |


## Events

| Event              | Description                    | Type                      |
| ------------------ | ------------------------------ | ------------------------- |
| `sageSwitchChange` | Emits an event on input change | `CustomEvent<InputEvent>` |


----------------------------------------------


