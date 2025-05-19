# pds-banner



<!-- Auto Generated Below -->


## Properties

| Property      | Attribute      | Description                                                           | Type                                                | Default     |
| ------------- | -------------- | --------------------------------------------------------------------- | --------------------------------------------------- | ----------- |
| `componentId` | `component-id` | A unique identifier used for the underlying component `id` attribute. | `string`                                            | `undefined` |
| `variant`     | `variant`      | Determines the banner variant.                                        | `"danger" \| "default" \| "secondary" \| "warning"` | `'default'` |


## Events

| Event                | Description                              | Type                  |
| -------------------- | ---------------------------------------- | --------------------- |
| `pdsBannerActivated` | Event emitted when a banner is activated | `CustomEvent<string>` |
| `pdsToggle`          |                                          | `CustomEvent<any>`    |


## Dependencies

### Depends on

- [pds-box](../pds-box)
- pds-icon
- [pds-text](../pds-text)

### Graph
```mermaid
graph TD;
  pds-banner --> pds-box
  pds-banner --> pds-icon
  pds-banner --> pds-text
  style pds-banner fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------


