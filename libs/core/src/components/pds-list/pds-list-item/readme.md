# pds-list-item



<!-- Auto Generated Below -->


## Properties

| Property      | Attribute      | Description                                                                                                                                                              | Type                                         | Default     |
| ------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------- | ----------- |
| `componentId` | `component-id` | A unique identifier used for the underlying component `id` attribute.                                                                                                    | `string`                                     | `undefined` |
| `href`        | `href`         | If provided, renders the title as an anchor (`<a>`) to this URL, and the whole item becomes its click target. Content in the `trailing` slot stays separately clickable. | `string`                                     | `undefined` |
| `target`      | `target`       | Specifies where to open the linked document when href is provided. Only applies when href is set.                                                                        | `"_blank" \| "_parent" \| "_self" \| "_top"` | `undefined` |


## Slots

| Slot            | Description                                                                                                 |
| --------------- | ----------------------------------------------------------------------------------------------------------- |
| `"(default)"`   | The item's title. Long titles truncate to one line.                                                         |
| `"description"` | Secondary text below the title, such as a date, file size or type. Truncates to one line.                   |
| `"leading"`     | Content before the title, such as an icon, thumbnail, avatar or checkbox.                                   |
| `"trailing"`    | Content after the title, such as a chip, buttons or a dropdown menu. It stays clickable when `href` is set. |


## Shadow Parts

| Part     | Description                                                                 |
| -------- | --------------------------------------------------------------------------- |
| `"item"` | The row that lays out the leading, title, description and trailing content. |
| `"link"` | The anchor wrapping the title when `href` is set.                           |


----------------------------------------------


