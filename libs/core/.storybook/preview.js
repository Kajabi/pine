import React from 'react';
import { extractArgTypes, extractComponentDescription, setStencilDocJson } from '@pxtrn/storybook-addon-docs-stencil';

import { BackToTop, TableOfContents } from 'storybook-docs-toc';
import { DocsContainer } from '@storybook/addon-docs';

import docsJson from '../dist/docs.json';
import iconDocsJson from '../../icons/dist/docs.json';

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
    container: ({ children, ...rest }) => (
      <DocsContainer {...rest}>
        <TableOfContents className="sbdocs sbdocs-toc--custom" />
        {children}
        <BackToTop className="sbdocs sbdocs-top--custom" />
      </DocsContainer>
    )
  }
}

