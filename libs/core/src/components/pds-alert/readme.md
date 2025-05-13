# pds-alert



<!-- Auto Generated Below -->


## Properties

| Property      | Attribute      | Description                                                                                                    | Type                                                        | Default     |
| ------------- | -------------- | -------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- | ----------- |
| `componentId` | `component-id` | A unique identifier used for the underlying component `id` attribute.                                          | `string`                                                    | `undefined` |
| `description` | `description`  | Text displayed as the description of the alert.                                                                | `string`                                                    | `undefined` |
| `dismissible` | `dismissible`  | If true, shows the close button. If false, the close button is hidden.                                         | `boolean`                                                   | `false`     |
| `heading`     | `heading`      | Text displayed as the heading of the alert.                                                                    | `string`                                                    | `undefined` |
| `small`       | `small`        | If true, the alert is displayed in a smaller size and description text is truncated. Heading is not displayed. | `boolean`                                                   | `false`     |
| `variant`     | `variant`      | Sets the style variant of the alert.                                                                           | `"danger" \| "default" \| "info" \| "success" \| "warning"` | `'default'` |


## Events

| Event                | Description                                     | Type                |
| -------------------- | ----------------------------------------------- | ------------------- |
| `pdsAlertCloseClick` | Event emitted when the close button is clicked. | `CustomEvent<void>` |


## Slots

| Slot        | Description             |
| ----------- | ----------------------- |
| `"actions"` | Slot for alert actions. |


## Dependencies

### Depends on

- [pds-box](../pds-box)
- pds-icon
- [pds-text](../pds-text)

### Graph
```mermaid
graph TD;
  pds-alert --> pds-box
  pds-alert --> pds-icon
  pds-alert --> pds-text
  style pds-alert fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------


