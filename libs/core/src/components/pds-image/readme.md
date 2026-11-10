# pds-image



<!-- Auto Generated Below -->


## Properties

| Property      | Attribute      | Description                                                                                                                                                                                                                                                                                                                   | Type                                                                                         | Default     |
| ------------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ----------- |
| `alt`         | `alt`          | The image's alt tag. If none is provided, it will default to an empty string, which is desired for decorative images.                                                                                                                                                                                                         | `string`                                                                                     | `''`        |
| `componentId` | `component-id` | A unique identifier used for the underlying component `id` attribute.                                                                                                                                                                                                                                                         | `string`                                                                                     | `undefined` |
| `fit`         | `fit`          | Determines how the image fills the shape set by `ratio`. Has no effect if `ratio` is not set.                                                                                                                                                                                                                                 | `"contain" \| "cover" \| "fill" \| "none" \| "scale-down"`                                   | `'cover'`   |
| `height`      | `height`       | The height of the image in pixels. `height: auto` lets the loaded image's own proportions decide its rendered height, so unlike `width` this does not reserve space before the image loads.                                                                                                                                   | `number`                                                                                     | `undefined` |
| `loading`     | `loading`      | Indicates how the browser should load the image.                                                                                                                                                                                                                                                                              | `"eager" \| "lazy"`                                                                          | `'eager'`   |
| `ratio`       | `ratio`        | The aspect ratio the image is sized to, cropping whatever overflows the shape. A preset (`square` 1/1, `landscape` 4/3, `wide` 16/9, `portrait` 3/4, `tall` 9/16) or any custom CSS ratio, such as `21 / 9`. Use this, not `height` and `width`, to crop: those only reserve space, and only `width` reliably does even that. | `"landscape" \| "portrait" \| "square" \| "tall" \| "wide" \| string & Record<never, never>` | `undefined` |
| `sizes`       | `sizes`        | Determines the intended display size of an image within certain breakpoints. Has no effect if `srcset` is not set or value has no width descriptor.                                                                                                                                                                           | `string`                                                                                     | `undefined` |
| `src`         | `src`          | The image's source.                                                                                                                                                                                                                                                                                                           | `string`                                                                                     | `undefined` |
| `srcset`      | `srcset`       | A set of image sources for the browser to use for responsiveness.                                                                                                                                                                                                                                                             | `string`                                                                                     | `undefined` |
| `width`       | `width`        | The width of the image in pixels. Setting this will devote space in the layout to prevent layout shifts when the image is loaded.                                                                                                                                                                                             | `number`                                                                                     | `undefined` |


## CSS Custom Properties

| Name                       | Description                                              |
| -------------------------- | -------------------------------------------------------- |
| `--dimension-aspect-ratio` | The image's aspect ratio.                                |
| `--dimension-object-fit`   | How the image fills the shape its aspect ratio gives it. |


----------------------------------------------


