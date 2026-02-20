import figma, { html } from '@figma/code-connect/html';

figma.connect('<FIGMA_LOADER>', {
  props: {
    showLabel: figma.boolean("Show text", {
        true: figma.string("↳ ✏️Text"),
        false: undefined,
    }),
    size: figma.enum("Size", {
      xsm: "xs",
      sm: "sm",
      md: "md",
      lg: "lg",
      xlg: "xl",
    }),
  },
  example: (props) => html`\
    <pds-loader
      is-loading="true"
      show-label=${props.showLabel}
      size=${props.size}
      variant="spinner"
    ></pds-loader>
  `,
});