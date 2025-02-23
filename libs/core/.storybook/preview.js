import { extractArgTypes, extractComponentDescription, setStencilDocJson } from '@pxtrn/storybook-addon-docs-stencil';

import docsJson from '../dist/docs.json';
import iconDocsJson from '@pine-ds/icons/dist/docs.json';
/*
*
* Merge the Icon docs.json with core docs.json file
* This is needed to list out the Properties in the argsTable
*
*/
const combinedDocsJson = [...new Set([...docsJson.components, ...iconDocsJson.components])];
docsJson.components = combinedDocsJson

if (docsJson) { setStencilDocJson(docsJson) }

const preview = {
  parameters: {
    actions: { argTypesRegex: '^on.*' },
    options: {
      storySort: {
        method: 'alphabetical',
        order: ['Introduction', ['Welcome',], 'Foundations', 'Design Tokens', ['Tokens'], 'Guides', 'Components', 'Resources'],
        locales: 'en-US',
      },
    }
  },

  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },

  docs: {
    extractArgTypes,
    extractComponentDescription,
  },

  tags: ['autodocs']
}

export default preview;
