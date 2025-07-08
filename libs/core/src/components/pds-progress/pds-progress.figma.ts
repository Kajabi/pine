import figma, { html } from '@figma/code-connect/html';

figma.connect('https://www.figma.com/design/CC1YmaGKHnsvB28yLY9mEH?node-id=823-30602', {
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

figma.connect('https://www.figma.com/design/CC1YmaGKHnsvB28yLY9mEH?node-id=37395-5953', {
  props: {
    percent: figma.string("Completion"),
  },
  example: (props) => html`\
    <pds-progress
      percent=${props.percent}
    ></pds-progress>
  `,
});