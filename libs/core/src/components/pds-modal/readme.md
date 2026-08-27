# pds-modal



<!-- Auto Generated Below -->


## Properties

| Property          | Attribute           | Description                                                                                                                                                                                                                                                                                                                          | Type                                   | Default     |
| ----------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------- | ----------- |
| `backdropDismiss` | `backdrop-dismiss`  | Whether the modal can be dismissed by clicking the backdrop                                                                                                                                                                                                                                                                          | `boolean`                              | `true`      |
| `componentId`     | `component-id`      | A unique identifier used for the underlying component `id` attribute.                                                                                                                                                                                                                                                                | `string`                               | `undefined` |
| `disableTopLayer` | `disable-top-layer` | Whether the modal opens outside the browser top layer as a non-modal dialog. When `true` it opens with `dialog.show()` instead of `dialog.showModal()`, so overlays rendered elsewhere in the DOM (file pickers, editor menus) can display above it via `z-index`. The page is not made inert and focus is not trapped in this mode. | `boolean`                              | `false`     |
| `open`            | `open`              | Whether the modal is open                                                                                                                                                                                                                                                                                                            | `boolean`                              | `false`     |
| `scrollable`      | `scrollable`        | Whether the modal content should be scrollable                                                                                                                                                                                                                                                                                       | `boolean`                              | `true`      |
| `size`            | `size`              | The size of the modal                                                                                                                                                                                                                                                                                                                | `"fullscreen" \| "lg" \| "md" \| "sm"` | `'md'`      |


## Events

| Event           | Description                      | Type                |
| --------------- | -------------------------------- | ------------------- |
| `pdsModalClose` | Emitted when the modal is closed | `CustomEvent<void>` |
| `pdsModalOpen`  | Emitted when the modal is opened | `CustomEvent<void>` |


## Methods

### `hideModal() => Promise<void>`

Closes the modal

#### Returns

Type: `Promise<void>`



### `showModal() => Promise<void>`

Opens the modal

#### Returns

Type: `Promise<void>`




## Shadow Parts

| Part      | Description |
| --------- | ----------- |
| `"modal"` |             |


----------------------------------------------


