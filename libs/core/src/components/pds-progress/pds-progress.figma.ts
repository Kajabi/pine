import figma, { html } from '@figma/code-connect/html';

figma.connect('<FIGMA_PROGRESS_BAR>', {
    props: {
      percent: figma.string("Progress"),
      showPercent: figma.enum("Label", {
        "false": true,
      }),
    },
    example: (props) => html`\
      <pds-progress
        percent=${props.percent}
        show-percent=${props.showPercent}
      ></pds-progress>
    `,
  });

figma.connect('<FIGMA_PROGRESS_CIRCLE>', {
  props: {
    percent: figma.string("Completion"),
  },
  example: (props) => html`\
    <pds-progress
      percent=${props.percent}
    ></pds-progress>
  `,
});