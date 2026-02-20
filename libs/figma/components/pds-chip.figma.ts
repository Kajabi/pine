import figma, { html } from '@figma/code-connect/html';

figma.connect('<FIGMA_CHIP>', {
  props: {
    dot: figma.enum("Variant", {
      dot: true,
      dropdown: true,
      false: undefined,
    }),
    label: figma.string('Label'),
    sentiment: figma.enum('Sentiment', {
  "accent (purp)": "accent",
  "danger (red)": "danger",
  "info (blue)": "info",
  "neutral (grey)": "neutral",
  "success (green)": "success",
  "warning (yellow)": "warning"
}),
    size: figma.enum("Size", {
      lg: "true",
    }),
    variant: figma.enum('Variant', {
  "text": "text",
  "tag": "tag",
  "dropdown": "dropdown"
}),
  },
  example: (props) => html`<pds-chip
    dot=${props.dot}
    large=${props.size}
    sentiment=${props.sentiment}
    variant=${props.variant}
  >${props.label}</pds-chip>`,
});
