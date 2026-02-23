import figma, { html } from '@figma/code-connect/html';

figma.connect('<FIGMA_DIVIDER>', {
  props: {
    offset: figma.enum('Offset', {
      "xxs - 4px": "xxs",
      "xs - 8px bleed": "xs",
      "sm - 16px bleed": "sm",
      "md - 24px bleed": "md",
      "lg - 32px bleed": "lg",
      "xl - 48px": "xl",
    }),
  },
  example: (props) => html`<pds-divider offset=${props.offset}></pds-divider>`,
});