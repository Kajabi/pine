import { html } from 'lit';

export default {
  component: 'pds-property',
  title: 'components/Property',
};

const BaseTemplate = (args) => html`
  <pds-property component-id=${args.componentId} icon=${args.icon}>${args.text}</pds-property>`;

export const Default = BaseTemplate.bind();
Default.args = {
  componentId: 'property-1',
  icon: 'star',
  text: 'Property text',
};
