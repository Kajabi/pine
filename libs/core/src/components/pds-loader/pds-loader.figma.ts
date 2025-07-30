import figma, { html } from '@figma/code-connect/html';

figma.connect('https://www.figma.com/design/CC1YmaGKHnsvB28yLY9mEH?node-id=21674-33731', {
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