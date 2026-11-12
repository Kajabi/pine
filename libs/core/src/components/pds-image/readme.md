# pds-image



<!-- Auto Generated Below -->


## Properties

| Property      | Attribute      | Description                                                                                                                                                                                                                                                                                                                   | Type                                                                                         | Default     |
| ------------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ----------- |
| `alt`         | `alt`          | The image's alt text. Defaults to an empty string, which marks the image as decorative and hides it from screen readers, so set it on any image that carries information.                                                                                                                                                     | `string`                                                                                     | `''`        |
| `componentId` | `component-id` | A unique identifier used for the underlying component `id` attribute.                                                                                                                                                                                                                                                         | `string`                                                                                     | `undefined` |
| `fit`         | `fit`          | Determines how the image fills the shape set by `ratio`. Has no effect if `ratio` is not set.                                                                                                                                                                                                                                 | `"contain" \| "cover" \| "fill" \| "none" \| "scale-down"`                                   | `'cover'`   |
| `height`      | `height`       | The height of the image in pixels. `height: auto` lets the loaded image's own proportions decide its rendered height, so unlike `width` this does not reserve space before the image loads.                                                                                                                                   | `number`                                                                                     | `undefined` |
| `loading`     | `loading`      | Indicates how the browser should load the image.                                                                                                                                                                                                                                                                              | `"eager" \| "lazy"`                                                                          | `'eager'`   |
| `ratio`       | `ratio`        | The aspect ratio the image is sized to, cropping whatever overflows the shape. A preset (`square` 1/1, `landscape` 4/3, `wide` 16/9, `portrait` 3/4, `tall` 9/16) or any custom CSS ratio, such as `21 / 9`. Use this, not `height` and `width`, to crop: those only reserve space, and only `width` reliably does even that. | `"landscape" \| "portrait" \| "square" \| "tall" \| "wide" \| string & Record<never, never>` | `undefined` |
| `sizes`       | `sizes`        | Determines the intended display size of an image within certain breakpoints. Has no effect if `srcset` is not set or value has no width descriptor.                                                                                                                                                                           | `string`                                                                                     | `undefined` |
| `src`         | `src`          | The image's source.                                                                                                                                                                                                                                                                                                           | `string`                                                                                     | `undefined` |
| `srcset`      | `srcset`       | A set of image sources for the browser to use for responsiveness.                                                                                                                                                                                                                                                             | `string`                                                                                     | `undefined` |
| `width`       | `width`        | The width of the image in pixels. This reserves the image's width before it loads, but not its height: to reserve the height too, set `--dimension-aspect-ratio` to the image's own proportions.                                                                                                                              | `number`                                                                                     | `undefined` |


## Events

| Event           | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                          | Type                                 |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| `pdsImageError` | Emitted when the image fails to load, such as for a broken or empty `src`. An image with no `src` or `srcset` at all emits neither event, since it has nothing to load. Emitted again after `src` or `srcset` changes and the new image fails. Bubbles and is composed, so a listener on an ancestor gets every `pds-image`'s events — check `event.target` when more than one is in scope.                                                                          | `CustomEvent<ImageErrorEventDetail>` |
| `pdsImageLoad`  | Emitted when the image loads. Also emitted on first render for an image that finished loading before the component could listen, such as a server-rendered image. Emitted again after `src` or `srcset` changes and the new image loads, or when the browser picks a different `srcset` candidate, such as on a resize. Bubbles and is composed, so a listener on an ancestor gets every `pds-image`'s events — check `event.target` when more than one is in scope. | `CustomEvent<ImageLoadEventDetail>`  |


## CSS Custom Properties

| Name                       | Description                                              |
| -------------------------- | -------------------------------------------------------- |
| `--dimension-aspect-ratio` | The image's aspect ratio.                                |
| `--dimension-object-fit`   | How the image fills the shape its aspect ratio gives it. |


----------------------------------------------


