import { html } from 'lit';
import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';

export default {
  args: {
    componentId: 'benzo',
  },
  argTypes: extractArgTypes('pds-select'),
  component: 'pds-select',
  title: 'components/Select',
};

const BaseTemplate = (args) => html`
  <pds-select component-id="${args.componentId}">
    <h1>Hello, world!</h1>
  </pds-select>
`;

export const Default = BaseTemplate.bind({});
