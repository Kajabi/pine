# pds-modal



<!-- Auto Generated Below -->


## Properties

| Property      | Attribute      | Description                                                           | Type      | Default     |
| ------------- | -------------- | --------------------------------------------------------------------- | --------- | ----------- |
| `closeOnEsc`  | `close-on-esc` | Whether the modal can be closed by pressing the escape key            | `boolean` | `true`      |
| `componentId` | `component-id` | A unique identifier used for the underlying component `id` attribute. | `string`  | `undefined` |
| `heading`     | `heading`      | The title of the modal                                                | `string`  | `undefined` |
| `open`        | `open`         | Whether the modal is open                                             | `boolean` | `false`     |


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


