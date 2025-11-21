import figma, { html } from '@figma/code-connect/html';

figma.connect('<FIGMA_PROGRESS_BAR>', {
  props: {
    percent: figma.string("Progress"),
    showPercent: figma.enum("Label", {
      "Right": true,
    }),
  },
  example: (props) => html`\
<pds-progress
  percent=${props.percent}
  show-percent=${props.showPercent}
></pds-progress>
  `,
  variant: { "Label": "False" },
});

figma.connect('<FIGMA_PROGRESS_BAR>', {
  props: {
    percent: figma.string("Progress"),
    showPercent: figma.enum("Label", {
      "Right": true,
    }),
  },
  example: (props) => html`\
<pds-progress
  percent=${props.percent}
  show-percent=${props.showPercent}
></pds-progress>
  `,
  variant: { "Label": "Right" },
});

figma.connect('<FIGMA_PROGRESS_BAR>', {
  props: {
    percent: figma.string("Progress"),
  },
  example: (props) => html`\
<pds-tooltip content=${props.percent} has-arrow="false" placement="top" style="width: 100%">
  <pds-progress percent=${props.percent}></pds-progress>
</pds-tooltip>
  `,
  variant: { "Label": "Top floating" },
});

figma.connect('<FIGMA_PROGRESS_BAR>', {
  props: {
    percent: figma.string("Progress"),
  },
  example: (props) => html`\
<pds-tooltip content=${props.percent} has-arrow="false" placement="bottom" style="width: 100%">
  <pds-progress percent=${props.percent}></pds-progress>
</pds-tooltip>
  `,
  variant: { "Label": "Bottom floating" },
});

figma.connect('<FIGMA_PROGRESS_CIRCLE>', {
  props: {
    percent: figma.string("Completion"),
  },
  example: (props) => html`\
<pds-progress percent=${props.percent}></pds-progress>
  `,
});
