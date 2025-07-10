import { html } from 'lit';
import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';
import { withActions } from '@storybook/addon-actions/decorator';

export default {
  argTypes: extractArgTypes('pds-property'),
  args: {
    icon: null,
    text: null,
  },
  component: 'pds-property',
  decorators: [withActions],
  title: 'components/Property',
};

const BaseTemplate = (args) => html`
  <pds-property
    component-id=${args.componentId}
    icon=${args.icon}
  >
    ${args.text}
  </pds-property>`;

export const Default = BaseTemplate.bind();
Default.args = {
  icon: 'check-circle',
  text: 'Property text',
};

export const WithoutIcon = BaseTemplate.bind();
WithoutIcon.args = {
  text: 'Property text without icon',
};

export const LongText = BaseTemplate.bind();
LongText.args = {
  icon: 'warning-triangle',
  text: 'This is a longer property text that might wrap to multiple lines or be truncated depending on the container width',
};