import figma, { html } from '@figma/code-connect/html';

figma.connect('https://www.figma.com/design/CC1YmaGKHnsvB28yLY9mEH?node-id=34239-33855', {
  props: {
    variant: figma.enum('Variant', {
      "primary": "primary",
      "secondary": "secondary",
      "destructive": "destructive",
      "accent": "accent"
    }),
    label: figma.string('Label'),
  },
  example: (props) => html`<pds-button
    variant=${props.variant}
  >${props.label}</pds-button>`,
});