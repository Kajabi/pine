import figma, { html } from '@figma/code-connect/html';

figma.connect('https://www.figma.com/design/CC1YmaGKHnsvB28yLY9mEH?node-id=37112-19825', {
  props: {
    variant: figma.enum('Variant', {
      "page": "primary",
      "filter": "pill",
      "availability": "availability",
    }),
    label: figma.textContent('Text Layer'),
  },
  example: (props) => html`\
  <pds-tab variant=${props.variant}>${props.label}</pds-tab>
  `,
});

figma.connect('https://www.figma.com/design/CC1YmaGKHnsvB28yLY9mEH?node-id=2537-21031', {
  props: {
    variant: figma.enum('Variant', {
      "page": "primary",
      "filter": "pill",
      "availability": "availability",
    }),
    children: figma.children('.Tab base'),
  },
  example: ({variant, children}) => html`\
  <pds-tabs variant=${variant}>${children}</pds-tabs>
  `,
});

