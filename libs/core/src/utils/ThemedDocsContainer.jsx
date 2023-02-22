// This is a temporary workaround to allow theme switching storybook docs
// see https://github.com/storybookjs/storybook/issues/10523 for further details
import React from 'react';
import { DocsContainer, DocsContextProps } from '@storybook/addon-docs';
import { BackToTop, TableOfContents } from 'storybook-docs-toc';
import { useDarkMode } from 'storybook-dark-mode';

import SageTheme from '../../.storybook/SageTheme';
import SageThemeDark from '../../.storybook/SageThemeDark';

export const ThemedDocsContainer = ({ children, context, ...rest }) => {
  const dark = useDarkMode();

  return (
    <DocsContainer
      context={{
        ...context,
        storyById: (id) => {
          const storyContext = context.storyById(id);
          return {
            ...storyContext,
            parameters: {
              ...storyContext?.parameters,
              docs: {
                ...storyContext?.parameters.docs,
                theme: dark ? SageThemeDark : SageTheme,
              },
            },
          };
        },
      }}
      {...rest}
    >
      <TableOfContents className="sbdocs sbdocs-toc--custom" />
      {children}
      <BackToTop className="sbdocs sbdocs-top--custom" />
    </DocsContainer>
  );
};
