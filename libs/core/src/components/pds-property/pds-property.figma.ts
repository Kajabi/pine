import figma, { html } from '@figma/code-connect/html';

figma.connect('<FIGMA_PROPERTY>', {
  props: {
    text: figma.string('Text'),
    icon: figma.string('Icon'),
  },
  example: (props) => html`\
  <pds-property icon=${props.icon}>${props.text}</pds-property>`,
});
