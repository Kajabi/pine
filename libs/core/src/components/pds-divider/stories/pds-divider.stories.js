import { html } from 'lit';
import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';

export default {
  argTypes: extractArgTypes('pds-divider'),
  component: 'pds-divider',
  title: 'components/Divider'
}

const BaseTemplate = (args) => html` <pds-divider vertical=${args.vertical} offset=${args.offset} />`;

export const Default = BaseTemplate.bind();
Default.args = {
  vertical: false,
}

export const Vertical = BaseTemplate.bind();
Vertical.args = {
  vertical: true,
}
