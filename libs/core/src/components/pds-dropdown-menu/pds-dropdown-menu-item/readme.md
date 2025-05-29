# pds-dropdown-item



<!-- Auto Generated Below -->


## Properties

| Property      | Attribute      | Description                                                                              | Type      | Default     |
| ------------- | -------------- | ---------------------------------------------------------------------------------------- | --------- | ----------- |
| `componentId` | `component-id` | A unique identifier used for the underlying component `id` attribute.                    | `string`  | `undefined` |
| `disabled`    | `disabled`     | It determines whether or not the dropdown-item is disabled.                              | `boolean` | `false`     |
| `href`        | `href`         | If provided, renders the dropdown-item as an anchor (`<a>`) element instead of a button. | `string`  | `undefined` |


## Events

| Event      | Description                                | Type                                                                                         |
| ---------- | ------------------------------------------ | -------------------------------------------------------------------------------------------- |
| `pdsClick` | Emitted when the dropdown-item is clicked. | `CustomEvent<{ itemIndex: number; item: HTMLPdsDropdownMenuItemElement; content: string; }>` |


## Methods

### `clickItem() => Promise<void>`

Trigger the click event

#### Returns

Type: `Promise<void>`




----------------------------------------------


