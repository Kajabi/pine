# pds-tabs



<!-- Auto Generated Below -->


## Properties

| Property                    | Attribute         | Description                                                                                                                                                                                                                                                                                          | Type                                                | Default     |
| --------------------------- | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- | ----------- |
| `activeTabName`             | `active-tab-name` | Sets the starting active tab name and maintains the name as the component re-renders. Panel mode only — in navigation mode (`nav`) the active tab is set per-tab via `active`, so this is not required there.                                                                                        | `string`                                            | `undefined` |
| `componentId` _(required)_  | `component-id`    | A unique identifier used for the underlying component `id` attribute.                                                                                                                                                                                                                                | `string`                                            | `undefined` |
| `divider`                   | `divider`         | Adds a divider rule beneath the tab list.                                                                                                                                                                                                                                                            | `boolean`                                           | `false`     |
| `nav`                       | `nav`             | Renders the tab strip as navigation instead of an in-page panel switcher: each `pds-tab` becomes an `<a href>` inside a `<nav>` landmark (with `aria-current` on the `active` tab) rather than a `role="tab"` button over a `pds-tabpanel`. Give every `pds-tab` an `href` and omit `pds-tabpanel`s. | `boolean`                                           | `false`     |
| `stretch`                   | `stretch`         | Stretches the component so the active tab panel fills the remaining height. Requires the component to have a constrained height (e.g. a flex parent).                                                                                                                                                | `boolean`                                           | `false`     |
| `tablistLabel` _(required)_ | `tablist-label`   | Sets the aria-label attached to the tablist element                                                                                                                                                                                                                                                  | `string`                                            | `undefined` |
| `variant` _(required)_      | `variant`         | Sets tabs variant styles as outlined in Figma documentation                                                                                                                                                                                                                                          | `"availability" \| "filter" \| "pill" \| "primary"` | `undefined` |


## Slots

| Slot          | Description                                                                    |
| ------------- | ------------------------------------------------------------------------------ |
| `"tabpanels"` | Content is placed directly after the `div[role="tablist"]` element as siblings |
| `"tabs"`      | Content is placed within the `div[role="tablist"]` element as children         |


## Shadow Parts

| Part         | Description                                                               |
| ------------ | ------------------------------------------------------------------------- |
| `"tab-list"` | Exposes the container element that holds all the tab buttons for styling. |


## CSS Custom Properties

| Name                                | Description                    |
| ----------------------------------- | ------------------------------ |
| `--tabs-dimension-panel-margin-top` | Optional margin-top for panels |
| `--tabs-dimension-panel-padding`    | Optional padding for panels    |


----------------------------------------------


