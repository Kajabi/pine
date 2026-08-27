# pds-modal



<!-- Auto Generated Below -->


## Properties

| Property          | Attribute           | Description                                                                                                                                                                                                                                                                                                                                                                                                                  | Type                                   | Default     |
| ----------------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- | ----------- |
| `backdropDismiss` | `backdrop-dismiss`  | Whether the modal can be dismissed by clicking the backdrop                                                                                                                                                                                                                                                                                                                                                                  | `boolean`                              | `true`      |
| `componentId`     | `component-id`      | A unique identifier used for the underlying component `id` attribute.                                                                                                                                                                                                                                                                                                                                                        | `string`                               | `undefined` |
| `disableTopLayer` | `disable-top-layer` | When `true`, the modal opens as a non-modal dialog (`dialog.show()`) in the normal stacking context instead of the browser top layer (`dialog.showModal()`). This lets overlays rendered elsewhere in the DOM — e.g. file pickers, rich-text editor menus — display above the modal via `z-index`, which is impossible while the modal sits in the top layer. Note that the rest of the page is not made inert in this mode. | `boolean`                              | `false`     |
| `open`            | `open`              | Whether the modal is open                                                                                                                                                                                                                                                                                                                                                                                                    | `boolean`                              | `false`     |
| `scrollable`      | `scrollable`        | Whether the modal content should be scrollable                                                                                                                                                                                                                                                                                                                                                                               | `boolean`                              | `true`      |
| `size`            | `size`              | The size of the modal                                                                                                                                                                                                                                                                                                                                                                                                        | `"fullscreen" \| "lg" \| "md" \| "sm"` | `'md'`      |


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


