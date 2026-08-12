# pds-tabs



<!-- Auto Generated Below -->


## Properties

| Property            | Attribute      | Description                                                                                                                                                                                                                                                                                                                                      | Type                                         | Default     |
| ------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------- | ----------- |
| `active`            | `active`       | Marks this tab as the current one in navigation mode (`href` set). Applies the active treatment and `aria-current="page"`. Ignored in panel mode, where the active tab is derived from the parent's `activeTabName`.                                                                                                                             | `boolean`                                    | `false`     |
| `disabled`          | `disabled`     | Determines the tab's disabled state.                                                                                                                                                                                                                                                                                                             | `boolean`                                    | `false`     |
| `href`              | `href`         | Turns the tab into a navigation link to this URL. When set, the tab renders an `<a href>` (marked `aria-current="page"` when `active`) instead of a `role="tab"` button, so each tab is its own page/URL — for tab strips that navigate rather than switch in-page panels. Pairs with `pds-tabs` navigation mode; no `pds-tabpanel`s are needed. | `string`                                     | `undefined` |
| `name` _(required)_ | `name`         | Sets the related tab name, this name must match a `pds-tabpanel`'s tab name property                                                                                                                                                                                                                                                             | `string`                                     | `undefined` |
| `target`            | `target`       | Where to open the linked URL, in navigation mode. Maps to the anchor's `target` attribute.                                                                                                                                                                                                                                                       | `"_blank" \| "_parent" \| "_self" \| "_top"` | `undefined` |
| `turboAction`       | `turbo-action` | Navigation mode: the Turbo visit action. Maps to `data-turbo-action` on the anchor (`advance` gives each tab its own history entry).                                                                                                                                                                                                             | `"advance" \| "replace"`                     | `undefined` |
| `turboFrame`        | `turbo-frame`  | Navigation mode: the Turbo Frame to target. Maps to `data-turbo-frame` on the anchor, so a tab can swap a single frame (e.g. a page body) while leaving the rest of the page in place.                                                                                                                                                           | `string`                                     | `undefined` |


----------------------------------------------


