# pds-multiselect

A multiselect component that allows users to select multiple options from a searchable dropdown list. Selected items are displayed as removable chips in a Select2-style pillbox interface.

## Features

- **Pillbox UI**: Selected items appear as removable chips inside the input container
- **Typeahead Search**: Filter options as you type
- **Checkbox Options**: Clear selection state with real checkboxes in the dropdown
- **Async Support**: Fetch options from a URL endpoint or manage data externally
- **Infinite Scroll**: Automatic pagination when scrolling to the bottom
- **Keyboard Navigation**: Full keyboard support for accessibility
- **Form Integration**: Works with native forms and FormData

<!-- Auto Generated Below -->


## Properties

| Property                   | Attribute        | Description                                                                                | Type                                   | Default       |
| -------------------------- | ---------------- | ------------------------------------------------------------------------------------------ | -------------------------------------- | ------------- |
| `asyncMethod`              | `async-method`   | HTTP method for async requests.                                                            | `"GET" \| "POST"`                      | `'GET'`       |
| `asyncUrl`                 | `async-url`      | URL endpoint for async data fetching.                                                      | `string`                               | `undefined`   |
| `componentId` _(required)_ | `component-id`   | A unique identifier used for the underlying component `id` attribute.                      | `string`                               | `undefined`   |
| `createUrl`                | `create-url`     | URL endpoint for creating new options. When set, shows "Add" option when no matches found. | `string`                               | `undefined`   |
| `debounce`                 | `debounce`       | Debounce delay in milliseconds for search/fetch.                                           | `number`                               | `300`         |
| `disabled`                 | `disabled`       | Determines whether the multiselect is disabled.                                            | `boolean`                              | `false`       |
| `errorMessage`             | `error-message`  | Error message to display.                                                                  | `string`                               | `undefined`   |
| `formatResult`             | --               | Function to format async results. Receives raw API response item.                          | `(item: unknown) => MultiselectOption` | `undefined`   |
| `helperMessage`            | `helper-message` | Helper message to display below the input.                                                 | `string`                               | `undefined`   |
| `hideLabel`                | `hide-label`     | Visually hides the label but keeps it accessible.                                          | `boolean`                              | `false`       |
| `invalid`                  | `invalid`        | If true, the multiselect is in an invalid state.                                           | `boolean`                              | `undefined`   |
| `label`                    | `label`          | Text to be displayed as the multiselect label.                                             | `string`                               | `undefined`   |
| `loading`                  | `loading`        | Whether the component is currently loading async options.                                  | `boolean`                              | `false`       |
| `maxHeight`                | `max-height`     | Maximum height of the dropdown before scrolling.                                           | `string`                               | `'300px'`     |
| `maxSelections`            | `max-selections` | Maximum number of selections allowed.                                                      | `number`                               | `undefined`   |
| `minWidth`                 | `min-width`      | Minimum width of the dropdown panel.                                                       | `string`                               | `'250px'`     |
| `name`                     | `name`           | Specifies the name. Submitted with the form as part of a name/value pair.                  | `string`                               | `undefined`   |
| `options`                  | --               | Options provided externally (for consumer-managed async).                                  | `MultiselectOption[]`                  | `undefined`   |
| `panelWidth`               | `panel-width`    | Width of the dropdown panel. Defaults to the trigger width.                                | `string`                               | `undefined`   |
| `placeholder`              | `placeholder`    | Placeholder text for the input field.                                                      | `string`                               | `'Select...'` |
| `required`                 | `required`       | If true, the multiselect is required.                                                      | `boolean`                              | `false`       |
| `triggerWidth`             | `trigger-width`  | Width of the trigger button (and reference for dropdown positioning).                      | `string`                               | `'100%'`      |
| `value`                    | --               | Array of selected option values.                                                           | `string[]`                             | `[]`          |


## Events

| Event                       | Description                                           | Type                                             |
| --------------------------- | ----------------------------------------------------- | ------------------------------------------------ |
| `pdsMultiselectChange`      | Emitted when selection changes.                       | `CustomEvent<MultiselectChangeEventDetail>`      |
| `pdsMultiselectCreate`      | Emitted when a new option is created.                 | `CustomEvent<MultiselectCreateEventDetail>`      |
| `pdsMultiselectLoadOptions` | Emitted to request more options (pagination).         | `CustomEvent<MultiselectLoadOptionsEventDetail>` |
| `pdsMultiselectSearch`      | Emitted on search input (for consumer-managed async). | `CustomEvent<MultiselectSearchEventDetail>`      |


## Methods

### `setFocus() => Promise<void>`

Sets focus on the trigger button.

#### Returns

Type: `Promise<void>`




## Slots

| Slot          | Description                                      |
| ------------- | ------------------------------------------------ |
| `"(default)"` | Static option elements for the multiselect       |
| `"empty"`     | Custom empty state message when no options match |
| `"loading"`   | Custom loading indicator                         |


## Dependencies

### Depends on

- pds-icon
- [pds-loader](../pds-loader)
- [pds-checkbox](../pds-checkbox)

### Graph
```mermaid
graph TD;
  pds-multiselect --> pds-icon
  pds-multiselect --> pds-loader
  pds-multiselect --> pds-checkbox
  pds-checkbox --> pds-icon
  style pds-multiselect fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------


