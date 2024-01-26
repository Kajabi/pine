# Pine Doc Components

## Background

We started off using Storybook to document our [Stencil Web Components](https://https://stenciljs.com). With Stencil you have framework integrations or Output Targets, we were using React. Instead of having multiple versions of Storybook (WebComponents, React, etc), we elected to recreate the common components we used within Storybook (ArgsTable and Canvas).

## Components

### docArgsTable
The docArgsTable component can be used to show a static table of arg types for a given component as a way to document its interface.

### Properties

|name|description|
|---|----|
|docSource|The `docs-json` output type from Stencil.  During compiliation Stencil will generate a JSON file with all of the components metadata. You can read more about docs-json [here](https://stenciljs.com/docs/docs-json). It expects the `components` key.|
|componentName|The name of the component to lookup.|



### docCanvas
The Canvas component is a wrapper, featuring a series of buttons to view the various Source snippets.

#### Properties
|name|description|
|----|-----|
|mdxSource|An object of key/value pairs. Each key will render a button that will show the source code.|

## How to use


### docArgsTable
```javascript
import { DocArgsTable } from '@pine-ds/doc-components';
import { components } from '../../../../dist/docs.json';

<DocArgsTable componentName='pds-radio' docSource={components} />
```

**output**
![Alt text](https://github.com/Kajabi/pine/blob/HEAD/libs/doc-components/public/doc-args-table.png)

### docCanvas

```javascript
import { DocCanvas } from '@pine-ds/doc-components';

<DocCanvas mdxSource={{
  react: `<PdsRadio componentId="message1" label="Label" helperMessage="This is short message text." />`,
  webComponent: `<pds-radio component-id="message1" label="Label" helper-message="This is short message text." />`
}}>
  <pds-radio component-id="message1" label="Label" helper-message="This is short message text." />
</DocCanvas>
```

**output**

Default state
![Alt text](https://github.com/Kajabi/pine/blob/HEAD/libs/doc-components/public/doc-canvas-default-state.png)

Active Tab
![Alt text](https://github.com/Kajabi/pine/blob/HEAD/libs/doc-components/public/doc-canvas-active-tab.png)
