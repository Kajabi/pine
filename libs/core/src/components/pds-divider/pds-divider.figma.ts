import figma, { html } from '@figma/code-connect/html';

figma.connect('<FIGMA_DIVIDER>', {
  props: {
    offset: figma.enum('Bleed', {
      "16px bleed": "sm",
      "24px bleed": "md",
    }),
  },
  example: (props) => html`<pds-divider bleed=${props.offset}></pds-divider>`,
});