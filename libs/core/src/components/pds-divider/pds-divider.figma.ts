import figma, { html } from '@figma/code-connect/html';

figma.connect('https://www.figma.com/file/CC1YmaGKHnsvB28yLY9mEH?node-id=4554-21304', {
  props: {
    offset: figma.enum('Bleed', {
      "16px bleed": "sm",
      "24px bleed": "md",
    }),
  },
  example: (props) => html`<pds-divider bleed=${props.offset}></pds-divider>`,
});