# pds-filter



<!-- Auto Generated Below -->


## Overview

A single filter in `pds-filters`: a trigger button that opens a popover holding the filter controls.
The `clear` variant has no popover and emits `pdsFilterClear` instead.

## Properties

| Property                   | Attribute      | Description                                                                                                                                                                     | Type                                           | Default     |
| -------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- | ----------- |
| `componentId` _(required)_ | `component-id` | A unique identifier for this component instance, used to build its internal popover's `id`. Does not set the host element's `id` attribute — set `id` directly if you need one. | `string`                                       | `undefined` |
| `icon`                     | `icon`         | The name of the icon to display in the trigger button. For 'clear' variant, this is ignored as it always shows trash icon.                                                      | `string`                                       | `undefined` |
| `text`                     | `text`         | The text content displayed in the trigger button. When text overflows, a tooltip showing the full text will appear on hover/focus.                                              | `string`                                       | `undefined` |
| `variant`                  | `variant`      | The variant style of the filter trigger.                                                                                                                                        | `"clear" \| "default" \| "more" \| "selected"` | `'default'` |


## Events

| Event            | Description                                                                                                                                                                                                                                                                      | Type                                     |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| `pdsFilterClear` | Emitted when the clear variant is clicked, or pressed with Enter or Space. `detail` is the filter's `componentId` and `text`. It doesn't change any filter itself.                                                                                                               | `CustomEvent<PdsFilterClearEventDetail>` |
| `pdsFilterClose` | Emitted when the filter popover is closed: from the trigger, `hideFilter()`, Escape, a click outside it, or another filter opening. `detail` is the filter's `componentId`, `variant` and `text`. Escape emits it twice, except in Firefox. The `clear` variant doesn't emit it. | `CustomEvent<PdsFilterCloseEventDetail>` |
| `pdsFilterOpen`  | Emitted when the filter popover is opened, from the trigger or `showFilter()`. `detail` is the filter's `componentId`, `variant` and `text`. The `clear` variant doesn't emit it.                                                                                                | `CustomEvent<PdsFilterOpenEventDetail>`  |


## Methods

### `hideFilter() => Promise<void>`

Closes the filter popover programmatically.
Note: Clear variant does not support popover functionality.

#### Returns

Type: `Promise<void>`



### `showFilter() => Promise<void>`

Opens the filter popover programmatically.
Note: Clear variant does not support popover functionality.

#### Returns

Type: `Promise<void>`




## Slots

| Slot          | Description                                                     |
| ------------- | --------------------------------------------------------------- |
| `"(default)"` | Popover content that will be displayed when the filter is open. |


## Shadow Parts

| Part               | Description                                       |
| ------------------ | ------------------------------------------------- |
| `"button"`         | Exposes the trigger button element for styling.   |
| `"button-content"` | Exposes the button content container for styling. |
| `"button-text"`    | Exposes the button text for styling.              |
| `"icon"`           | Exposes the icon component for styling.           |
| `"popover"`        | Exposes the popover container for styling.        |


## Dependencies

### Depends on

- pds-icon

### Graph
```mermaid
graph TD;
  pds-filter --> pds-icon
  style pds-filter fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------


