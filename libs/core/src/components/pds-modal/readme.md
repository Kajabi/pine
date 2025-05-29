# pds-modal



<!-- Auto Generated Below -->


## Properties

| Property               | Attribute                | Description                                                           | Type                                   | Default     |
| ---------------------- | ------------------------ | --------------------------------------------------------------------- | -------------------------------------- | ----------- |
| `componentId`          | `component-id`           | A unique identifier used for the underlying component `id` attribute. | `string`                               | `undefined` |
| `disableBackdropClick` | `disable-backdrop-click` | Whether clicking the backdrop to close the modal is disabled          | `boolean`                              | `false`     |
| `open`                 | `open`                   | Whether the modal is open                                             | `boolean`                              | `false`     |
| `size`                 | `size`                   | The size of the modal                                                 | `"fullscreen" \| "lg" \| "md" \| "sm"` | `'md'`      |


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




----------------------------------------------


