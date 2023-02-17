# sage-tabs



<!-- Auto Generated Below -->


## Properties

| Property          | Attribute          | Description                                                                                      | Type      | Default     |
| ----------------- | ------------------ | ------------------------------------------------------------------------------------------------ | --------- | ----------- |
| `activeTab`       | `active-tab`       | Keeps track of the activeTab, this property is passed in by parent component                     | `string`  | `undefined` |
| `parentComponent` | `parent-component` | Keeps track of the parentComponent unique id, this property is passed in by parent component     | `string`  | `undefined` |
| `selected`        | `selected`         | Keeps track of if the tabpanel is selected, this property is computed on `componentWillUpdate()` | `boolean` | `false`     |
| `tab`             | `tab`              | Sets the related tab name, this name must match a `sage-tabpanel`'s tab property, required       | `string`  | `undefined` |
| `variant`         | `variant`          | Keeps track of if the expected tab variant, this property is passed in by parent component       | `string`  | `undefined` |


## Events

| Event      | Description                                                                    | Type                  |
| ---------- | ------------------------------------------------------------------------------ | --------------------- |
| `tabClick` | Emits an event upon tab click for `sage-tab` and `sage-tabpanel` to listen for | `CustomEvent<object>` |


----------------------------------------------


