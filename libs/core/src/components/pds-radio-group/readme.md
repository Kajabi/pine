# pds-radio-group



<!-- Auto Generated Below -->


## Properties

| Property        | Attribute        | Description                                                                                                                                             | Type                | Default     |
| --------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- | ----------- |
| `componentId`   | `component-id`   | A unique identifier used for the underlying component `id` attribute.                                                                                   | `string`            | `undefined` |
| `direction`     | `direction`      | Layout direction for the radio group.                                                                                                                   | `"column" \| "row"` | `'column'`  |
| `disabled`      | `disabled`       | Determines whether or not the radio group is disabled.                                                                                                  | `boolean`           | `false`     |
| `errorMessage`  | `error-message`  | Displays an error message below the radio group. It's part of the group's accessible description, with or without `invalid`.                            | `string`            | `undefined` |
| `gap`           | `gap`            | Spacing between radio items. Accepts t-shirt sizes (none, xxs, xs, sm, md, lg, xl, xxl) or core spacing tokens (025, 050, 100, etc.).                   | `string`            | `'xs'`      |
| `groupLabel`    | `group-label`    | Text to be displayed as the radio group label. It also names the group, unless you set `aria-label` or `aria-labelledby` on it.                         | `string`            | `undefined` |
| `helperMessage` | `helper-message` | Displays a message or hint below the radio group.                                                                                                       | `string`            | `undefined` |
| `invalid`       | `invalid`        | Determines whether or not the radio group is invalid.                                                                                                   | `boolean`           | `false`     |
| `name`          | `name`           | String used for radio `name` attribute. Applied to all child radios. Required for proper radio group behavior (mutual exclusivity and form submission). | `string`            | `undefined` |
| `required`      | `required`       | Determines whether or not the radio group is required.                                                                                                  | `boolean`           | `false`     |


## Events

| Event                 | Description                                                                                     | Type                                       |
| --------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------ |
| `pdsRadioGroupChange` | Emitted when the user checks a radio in the group, with that radio's `value` and `componentId`. | `CustomEvent<RadioGroupChangeEventDetail>` |


## Slots

| Slot          | Description                |
| ------------- | -------------------------- |
| `"(default)"` | Child pds-radio components |


## Dependencies

### Depends on

- pds-icon

### Graph
```mermaid
graph TD;
  pds-radio-group --> pds-icon
  style pds-radio-group fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------


