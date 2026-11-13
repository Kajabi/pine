# pds-accordion



<!-- Auto Generated Below -->


## Properties

| Property      | Attribute      | Description                                                                                                                            | Type      | Default     |
| ------------- | -------------- | -------------------------------------------------------------------------------------------------------------------------------------- | --------- | ----------- |
| `componentId` | `component-id` | A unique identifier for this component instance. Does not set the host element's `id` attribute — set `id` directly if you need one.   | `string`  | `undefined` |
| `isOpen`      | `open`         | Determines whether the accordion is open. Set with the `open` attribute, which is added and removed as the accordion opens and closes. | `boolean` | `false`     |


## Events

| Event                | Description                                                                                                                                                                                                         | Type                   |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| `pdsAccordionToggle` | Emitted when the accordion opens or closes, carrying the new open state. Also emits when programmatically setting the `isOpen` property or the `open` attribute. Not emitted for the state the accordion starts in. | `CustomEvent<boolean>` |


## Slots

| Slot          | Description                       |
| ------------- | --------------------------------- |
| `"(default)"` | Accordion body content.           |
| `"label"`     | Accordion trigger button content. |


## Shadow Parts

| Part                 | Description                      |
| -------------------- | -------------------------------- |
| `"accordion-body"`   | Accordion body styles.           |
| `"accordion-button"` | Accordion button/trigger styles. |
| `"accordion-icon"`   | Accordion icon styles.           |


## Dependencies

### Depends on

- pds-icon

### Graph
```mermaid
graph TD;
  pds-accordion --> pds-icon
  style pds-accordion fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------


