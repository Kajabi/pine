# mock-pds-modal



<!-- Auto Generated Below -->


## Overview

Mock PdsModal component for testing purposes
This component mimics the real PdsModal but without using the Popover API

## Properties

| Property          | Attribute          | Description                                                                    | Type                                   | Default     |
| ----------------- | ------------------ | ------------------------------------------------------------------------------ | -------------------------------------- | ----------- |
| `backdropDismiss` | `backdrop-dismiss` | Whether the modal can be dismissed by clicking the backdrop or pressing Escape | `boolean`                              | `true`      |
| `componentId`     | `component-id`     | The ID of the modal component                                                  | `string`                               | `undefined` |
| `open`            | `open`             | Whether the modal is open                                                      | `boolean`                              | `false`     |
| `scrollable`      | `scrollable`       | Whether the modal content should be scrollable                                 | `boolean`                              | `true`      |
| `size`            | `size`             | The size of the modal                                                          | `"fullscreen" \| "lg" \| "md" \| "sm"` | `'md'`      |


## Events

| Event                   | Description                                | Type                |
| ----------------------- | ------------------------------------------ | ------------------- |
| `pdsModalBackdropClick` | Event emitted when the backdrop is clicked | `CustomEvent<void>` |
| `pdsModalClose`         | Event emitted when the modal is closed     | `CustomEvent<void>` |
| `pdsModalOpen`          | Event emitted when the modal is opened     | `CustomEvent<void>` |


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


