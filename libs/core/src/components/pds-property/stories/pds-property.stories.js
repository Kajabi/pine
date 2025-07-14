import { html } from 'lit';
import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';
import { withActions } from '@storybook/addon-actions/decorator';

export default {
  argTypes: extractArgTypes('pds-property'),
  component: 'pds-property',
  decorators: [withActions],
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
