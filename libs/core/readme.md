# @pine-ds/core

Pine's web components, the `pds-*` custom elements, and `pine-core.css`, the stylesheet that defines Pine's design tokens. In React, use [`@pine-ds/react`](https://www.npmjs.com/package/@pine-ds/react), which wraps these components.

## Load from the CDN

Add these tags to `<head>`:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@pine-ds/core@[VERSION]/dist/pine-core/pine-core.css" />
<script type="module" src="https://cdn.jsdelivr.net/npm/@pine-ds/core@[VERSION]/dist/pine-core/pine-core.esm.js"></script>
<script nomodule src="https://cdn.jsdelivr.net/npm/@pine-ds/core@[VERSION]/dist/pine-core/pine-core.js"></script>
```

Replace `[VERSION]` with an exact version, such as `4.11.0`, not `latest`. See [Consumer guidance](https://github.com/Kajabi/pine/blob/main/VERSIONING.md#consumer-guidance) for how to pin versions.

Then use the components like any HTML tag:

```html
<pds-button variant="accent">Get started</pds-button>
```

## Install from npm

```bash
npm install @pine-ds/core
```

Import each component you use from the custom-elements build, and register it. Keep the `.js` at the end of the path. Registering a component also registers the components it renders.

```js
import { defineCustomElement as definePdsButton } from '@pine-ds/core/components/pds-button.js';

definePdsButton();
```

The package doesn't export `pine-core.css`, so you can't import it. Add the stylesheet `<link>` tag above, with `[VERSION]` set to the installed version (`npm ls @pine-ds/core` prints it), or serve a copy of `node_modules/@pine-ds/core/dist/pine-core/pine-core.css`.

[Getting Started](https://pine-design-system.netlify.app/?path=/docs/introduction-getting-started--docs) covers icons, dark mode and keeping components visible through a DOM morph.

## Links

- [Storybook](https://pine-design-system.netlify.app/): every component, with examples
- [Versioning and deprecation policy](https://github.com/Kajabi/pine/blob/main/VERSIONING.md)
- [Changelog](https://github.com/Kajabi/pine/blob/main/CHANGELOG.md)
- [Source](https://github.com/Kajabi/pine)
