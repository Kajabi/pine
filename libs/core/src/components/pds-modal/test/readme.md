# mock-pds-modal



<!-- Auto Generated Below -->


## Overview

Mock PdsModal component for testing purposes
This component mimics the real PdsModal but without using the Popover API

## Properties

| Property               | Attribute                 | Description                                                  | Type                                   | Default     |
| ---------------------- | ------------------------- | ------------------------------------------------------------ | -------------------------------------- | ----------- |
| `closeOnBackdropClick` | `close-on-backdrop-click` | Whether the modal should close when clicking on the backdrop | `boolean`                              | `true`      |
| `componentId`          | `component-id`            | The ID of the modal component                                | `string`                               | `undefined` |
| `open`                 | `open`                    | Whether the modal is open                                    | `boolean`                              | `false`     |
| `scrollable`           | `scrollable`              | Whether the modal content is scrollable                      | `boolean`                              | `false`     |
| `size`                 | `size`                    | The size of the modal                                        | `"fullscreen" \| "lg" \| "md" \| "sm"` | `'md'`      |


## Events

| Event                   | Description                                | Type               |
| ----------------------- | ------------------------------------------ | ------------------ |
| `pdsModalBackdropClick` | Event emitted when the backdrop is clicked | `CustomEvent<any>` |
| `pdsModalClose`         | Event emitted when the modal is closed     | `CustomEvent<any>` |
| `pdsModalOpen`          | Event emitted when the modal is opened     | `CustomEvent<any>` |


## Methods

### `hideModal() => Promise<void>`

Hides the modal

#### Returns

Type: `Promise<void>`



### `showModal() => Promise<void>`

Shows the modal

#### Returns

Type: `Promise<void>`




----------------------------------------------


