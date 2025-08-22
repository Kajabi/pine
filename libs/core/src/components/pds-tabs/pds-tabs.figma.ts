import figma, { html } from '@figma/code-connect/html';

// Tab
figma.connect('<FIGMA_TABS_LIST>', {
  props: {
    variant: figma.enum('Variant', {
      "page": "primary",
      "filter": "filter",
      "availability": "availability",
    }),
    label: figma.textContent('Label'),
  },
  example: (props) => html`\
  <pds-tab variant=${props.variant}>${props.label}</pds-tab>
  `,
});

// Tabs
figma.connect('<FIGMA_TABS_TAB>', {
  props: {
    variant: figma.enum('Variant', {
      "page": "primary",
      "filter": "filter",
      "availability": "availability",
    }),
    children: figma.children('.Tab base'),
  },
  example: ({variant, children}) => html`\
  <pds-tabs variant=${variant}>${children}</pds-tabs>
  `,
});

