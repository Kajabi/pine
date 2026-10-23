# pds-property



<!-- Auto Generated Below -->


## Properties

| Property      | Attribute      | Description                                                                                                                          | Type     | Default     |
| ------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------ | -------- | ----------- |
| `componentId` | `component-id` | A unique identifier for this component instance. Does not set the host element's `id` attribute — set `id` directly if you need one. | `string` | `undefined` |
| `icon`        | `icon`         | The name of the icon to display before the property text.                                                                            | `string` | `'star'`    |


## Slots

| Slot          | Description                |
| ------------- | -------------------------- |
| `"(default)"` | The property text content. |


## Dependencies

### Depends on

- [pds-box](../pds-box)
- pds-icon

### Graph
```mermaid
graph TD;
  pds-property --> pds-box
  pds-property --> pds-icon
  style pds-property fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------


