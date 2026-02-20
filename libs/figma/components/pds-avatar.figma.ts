import figma, { html } from '@figma/code-connect/html';

figma.connect('<FIGMA_AVATAR>', {
  props: {
    badge: figma.boolean('Badge'),
    size: figma.enum('Size', {
      "xsm - 24px": "xs",
      "sm - 32px": "sm",
      "md - 40px": "md",
      "lg - 56px": "lg",
      "xl - 64px": "xl",
    }),
    type: figma.enum('Type', {
      "user": "ASSET_URL",
      "placeholder": undefined,
    }),
  },
  example: (props) => html`
  <pds-avatar
    badge=${props.badge}
    image=${props.type}
    size=${props.size}
  ></pds-avatar>`,
});