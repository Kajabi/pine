import figma, { html } from '@figma/code-connect/html';

figma.connect('<FIGMA_CHIP>', {
  props: {
    dot: figma.enum("variant", {
      dot: "true",
      dropdown: "true",
    }),
    sentiment: figma.enum('sentiment', {
      "accent (purp)": "accent",
      "danger (red)": "danger",
      "info (blue)": "info",
      "neutral (grey)": "neutral",
      "success (green)": "success",
      "warning (yellow)": "warning",
    }),
    size: figma.enum("size", {
      lg: "true",
    }),
    variant: figma.enum('variant', {
      "text": "text",
      "tag": "tag",
      "dropdown": "dropdown",
    }),
  },
  example: (props) => html`<pds-chip
    dot=${props.dot}
    large=${props.size}
    sentiment=${props.sentiment}
    variant=${props.variant}
  >Label</pds-chip>`,
});
