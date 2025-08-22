import figma, { html } from '@figma/code-connect/html';

figma.connect('<FIGMA_AVATAR>', {
  props: {
    badge: figma.boolean('Member'),
    size: figma.enum('Size', {
      "xsm": "xs",
      "sm": "sm",
      "md": "md",
      "lg": "lg",
      "xl": "xl",
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