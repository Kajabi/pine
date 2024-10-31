import { html } from 'lit';
import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';

export default {
  args: {
    componentId: 'benzo',
    thingy: 'thingy',
  },
  argTypes: extractArgTypes('pds-ben'),
  component: 'pds-ben',
  title: 'components/Ben',
};

const BaseTemplate = (args) => html`
  <pds-ben component-id="${args.componentId}" thingy="${args.thingy}">
    <h1>Hello, world!</h1>
  </pds-ben>
`;

export const Default = BaseTemplate.bind({});
