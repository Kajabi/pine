# pds-modal



<!-- Auto Generated Below -->


## Properties

| Property               | Attribute                 | Description                                                           | Type                                   | Default     |
| ---------------------- | ------------------------- | --------------------------------------------------------------------- | -------------------------------------- | ----------- |
| `closeOnBackdropClick` | `close-on-backdrop-click` | Whether the modal can be closed by clicking the backdrop              | `boolean`                              | `true`      |
| `closeOnEsc`           | `close-on-esc`            | Whether the modal can be closed by pressing the escape key            | `boolean`                              | `true`      |
| `componentId`          | `component-id`            | A unique identifier used for the underlying component `id` attribute. | `string`                               | `undefined` |
| `open`                 | `open`                    | Whether the modal is open                                             | `boolean`                              | `false`     |
| `size`                 | `size`                    | The size of the modal                                                 | `"fullscreen" \| "lg" \| "md" \| "sm"` | `'md'`      |


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


