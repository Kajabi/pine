import figma, { html } from '@figma/code-connect/html';

figma.connect('https://www.figma.com/design/CC1YmaGKHnsvB28yLY9mEH?node-id=4583-21358', {
  props: {
    text: figma.string('Text'),
    icon: figma.string('Icon'),
  },
  example: (props) => html`\
  <pds-property icon=${props.icon}>${props.text}</pds-property>`,
});
