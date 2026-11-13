# pds-copytext



<!-- Auto Generated Below -->


## Properties

| Property             | Attribute      | Description                                                                                                                                                    | Type      | Default     |
| -------------------- | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ----------- |
| `border`             | `border`       | Determines whether `copytext` should have a visible border.                                                                                                    | `boolean` | `true`      |
| `componentId`        | `component-id` | A unique identifier used for the underlying component `id` attribute.                                                                                          | `string`  | `undefined` |
| `fullWidth`          | `full-width`   | Determines whether `copytext` should expand to the full width of its container.                                                                                | `boolean` | `false`     |
| `truncate`           | `truncate`     | Determines whether the `value` should truncate and display with an ellipsis. When text overflows, a tooltip showing the full value will appear on hover/focus. | `boolean` | `false`     |
| `value` _(required)_ | `value`        | The string displayed that is also copied to the clipboard upon interaction.                                                                                    | `string`  | `undefined` |


## Events

| Event              | Description                                                                                                                                                                                                                                                                             | Type                  |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| `pdsCopyTextClick` | Emitted after a click, once the copy to the clipboard succeeds or fails. `detail` is `Copied to clipboard` on success, or `Error writing text to clipboard: ` followed by the error on failure. Not emitted when `navigator.clipboard` is undefined, as it is outside a secure context. | `CustomEvent<string>` |


## Dependencies

### Depends on

- [pds-button](../pds-button)
- pds-icon

### Graph
```mermaid
graph TD;
  pds-copytext --> pds-button
  pds-copytext --> pds-icon
  pds-button --> pds-icon
  pds-button --> pds-loader
  style pds-copytext fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------


