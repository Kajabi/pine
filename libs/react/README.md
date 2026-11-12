# @pine-ds/react

React components for Pine. Each `Pds*` component wraps the matching `pds-*` web component from `@pine-ds/core`, and registers it when you import it. React 18 is a peer dependency.

## Install

```bash
npm install @pine-ds/react
```

## Load the stylesheet

`@pine-ds/react` doesn't load `pine-core.css`, the stylesheet that defines Pine's design tokens and loads the Inter font, and the stylesheet can't be imported from the package. Without it, components render with no Pine colors, in the browser's default font. Add this tag to your page's `<head>`, with `[VERSION]` set to the `@pine-ds/core` version in your lockfile (`npm ls @pine-ds/core` prints it):

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@pine-ds/core@[VERSION]/dist/pine-core/pine-core.css" />
```

Or have your build copy `node_modules/@pine-ds/core/dist/pine-core/pine-core.css` into the files your app serves, and link to that copy.

## Use the components

Props are camelCase. Each Pine event is a prop named `on` plus the event name, such as `onPdsClick` for `pdsClick`.

```jsx
import { PdsButton, PdsCopytext } from '@pine-ds/react';

export function Example() {
  return (
    <>
      <PdsCopytext value="Copy this text" fullWidth />
      <PdsButton variant="primary" onPdsClick={() => console.log('Saved')}>
        Save
      </PdsButton>
    </>
  );
}
```

## Icons

Import icons from `@pine-ds/icons/icons` and pass them to `PdsIcon`'s `icon` prop, which bundles the SVG with your app. Setting `name` on `PdsIcon` instead logs a console warning.

```jsx
import { add } from '@pine-ds/icons/icons';
import { PdsButton, PdsIcon } from '@pine-ds/react';

<PdsButton><PdsIcon slot="start" icon={add} />Add item</PdsButton>
```

## TypeScript

Today, TypeScript checks `Pds*` props only when your `tsconfig.json` sets `"moduleResolution": "node"`. With `"bundler"`, the prop types don't resolve, so TypeScript can't check the props. With `"node16"` or `"nodenext"`, TypeScript reports that `@pine-ds/react` has no exported `Pds*` components.

## DOM morphs

This package doesn't run Pine's global script. If a DOM morph on your page can remove the `hydrated` class from Pine components, call `keepPineHydrated()` once at startup to put it back:

```js
import { keepPineHydrated } from '@pine-ds/core/components/index.js';

keepPineHydrated();
```

## Links

- [Getting Started](https://pine-design-system.netlify.app/?path=/docs/introduction-getting-started--docs)
- [Storybook](https://pine-design-system.netlify.app/): every component, with examples
- [Versioning and deprecation policy](https://github.com/Kajabi/pine/blob/main/VERSIONING.md)
- [Changelog](https://github.com/Kajabi/pine/blob/main/CHANGELOG.md)
