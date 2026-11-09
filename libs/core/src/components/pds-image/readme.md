# pds-image



<!-- Auto Generated Below -->


## Properties

| Property      | Attribute      | Description                                                                                                                                                                    | Type                                                       | Default     |
| ------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------- | ----------- |
| `alt`         | `alt`          | The image's alt tag. If none is provided, it will default to an empty string, which is desired for decorative images.                                                          | `string`                                                   | `''`        |
| `componentId` | `component-id` | A unique identifier used for the underlying component `id` attribute.                                                                                                          | `string`                                                   | `undefined` |
| `fit`         | `fit`          | Determines how the image fills the shape set by `ratio`. Has no effect if `ratio` is not set.                                                                                  | `"contain" \| "cover" \| "fill" \| "none" \| "scale-down"` | `'cover'`   |
| `height`      | `height`       | The height of the image in pixels. Setting this will devote space in the layout to prevent layout shifts when the image is loaded.                                             | `number`                                                   | `undefined` |
| `loading`     | `loading`      | Indicates how the browser should load the image.                                                                                                                               | `"eager" \| "lazy"`                                        | `'eager'`   |
| `ratio`       | `ratio`        | The aspect ratio the image is sized to, cropping whatever overflows the shape. Value can be preset or custom. Takes precedence over the ratio implied by `height` and `width`. | `string`                                                   | `undefined` |
| `sizes`       | `sizes`        | Determines the intended display size of an image within certain breakpoints. Has no effect if `srcset` is not set or value has no width descriptor.                            | `string`                                                   | `undefined` |
| `src`         | `src`          | The image's source.                                                                                                                                                            | `string`                                                   | `undefined` |
| `srcset`      | `srcset`       | A set of image sources for the browser to use for responsiveness.                                                                                                              | `string`                                                   | `undefined` |
| `width`       | `width`        | The width of the image in pixels. Setting this will devote space in the layout to prevent layout shifts when the image is loaded.                                              | `number`                                                   | `undefined` |


## CSS Custom Properties

| Name                       | Description               |
| -------------------------- | ------------------------- |
| `--dimension-aspect-ratio` | The image's aspect ratio. |


----------------------------------------------


