import { extractArgTypes, extractComponentDescription, setStencilDocJson } from '@pxtrn/storybook-addon-docs-stencil';

import { themes } from '@storybook/theming';

import docsJson from '../dist/docs.json';
import iconDocsJson from '../../icons/dist/docs.json';

import { ThemedDocsContainer } from '../src/utils/ThemedDocsContainer';

import SageTheme from './SageTheme';
import SageThemeDark from './SageThemeDark';

/*
*
* Merge the Icon docs.json with core docs.json file
* This is needed to list out the Properties in the argsTable
*
*/
const combinedDocsJson = [...new Set([...docsJson.components, ...iconDocsJson.components])];
docsJson.components = combinedDocsJson

if (docsJson) { setStencilDocJson(docsJson) }

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  docs: {
    extractArgTypes,
    extractComponentDescription,
    container: ThemedDocsContainer
  },
  darkMode: {
    dark: SageThemeDark,
    light: SageTheme
  },
  options: {
    storySort: {
      order: [
        'Welcome',
        'Resources',
        'Foundations',
        [
          'Design Principles',
          'Colors',
          'Typography'
        ],
        'Components',
        'Get Support'
      ],
    },
  }
}
