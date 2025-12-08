import React from 'react';
import Markdown from 'markdown-to-jsx';

interface ChangelogRendererProps {
  changelogContent: string;
}

/**
 * Component to render changelog markdown content using Pine design tokens
 * Renders the provided markdown content as formatted HTML with Pine styling
 */
export const ChangelogRenderer: React.FC<ChangelogRendererProps> = ({ changelogContent }) => {
  return (
    <div style={{
      maxWidth: '100%',
      lineHeight: 'var(--pine-line-height-body)',
      color: 'var(--pine-color-text)',
    }}>
      <Markdown
        options={{
          overrides: {
            h2: {
              component: 'h2',
              props: {
                style: {
                  marginBlockStart: 'var(--pine-dimension-2xl)',
                  marginBlockEnd: 'var(--pine-dimension-md)',
                  paddingBlockEnd: 'var(--pine-dimension-xs)',
                  borderBlockEnd: 'var(--pine-border)',
                  fontSize: 'var(--pine-font-size-heading-2)',
                  fontWeight: 'var(--pine-font-weight-semi-bold)',
                  color: 'var(--pine-color-text)',
                  lineHeight: 'var(--pine-line-height-heading)',
                },
              },
            },
            h3: {
              component: 'h3',
              props: {
                style: {
                  marginBlockStart: 'var(--pine-dimension-xl)',
                  marginBlockEnd: 'var(--pine-dimension-sm)',
                  fontSize: 'var(--pine-font-size-heading-3)',
                  fontWeight: 'var(--pine-font-weight-semi-bold)',
                  color: 'var(--pine-color-text)',
                  lineHeight: 'var(--pine-line-height-heading)',
                },
              },
            },
            ul: {
              component: 'ul',
              props: {
                style: {
                  marginInlineStart: 'var(--pine-dimension-lg)',
                  marginBlockEnd: 'var(--pine-dimension-md)',
                  paddingInlineStart: 'var(--pine-dimension-sm)',
                },
              },
            },
            li: {
              component: 'li',
              props: {
                style: {
                  marginBlockEnd: 'var(--pine-dimension-xs)',
                  fontSize: 'var(--pine-font-size-body-md)',
                  lineHeight: 'var(--pine-line-height-body)',
                  color: 'var(--pine-color-text)',
                },
              },
            },
            p: {
              component: 'p',
              props: {
                style: {
                  marginBlockEnd: 'var(--pine-dimension-md)',
                  fontSize: 'var(--pine-font-size-body-md)',
                  lineHeight: 'var(--pine-line-height-body)',
                  color: 'var(--pine-color-text)',
                },
              },
            },
            a: {
              component: 'a',
              props: {
                style: {
                  color: 'var(--pine-color-text)',
                  textDecoration: 'underline',
                  fontWeight: 'var(--pine-font-weight-semi-bold)',
                },
              },
            },
            code: {
              component: 'code',
              props: {
                style: {
                  backgroundColor: 'var(--pine-color-background-container-hover)',
                  paddingBlock: 'var(--pine-dimension-2xs)',
                  paddingInline: 'var(--pine-dimension-xs)',
                  borderRadius: 'var(--pine-dimension-2xs)',
                  fontSize: 'var(--pine-font-size-body-sm)',
                  fontFamily: 'monospace',
                  color: 'var(--pine-color-text)',
                },
              },
            },
          },
        }}
      >
        {changelogContent}
      </Markdown>
    </div>
  );
};

