import { html } from 'lit';
import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';

export default {
  argTypes: extractArgTypes('pds-select'),
  args: {
    componentId: 'pds-select-example',
    label: 'Benzo Alpha',
    type: 'select',
  },
  argTypes: extractArgTypes('pds-select'),
  component: 'pds-select',
  title: 'components/Select',
};

const BaseTemplate = (args) => html`<pds-select component-id="${args.componentId}" label="${args.label}" type="${args.type}" />`;

export const Default = BaseTemplate.bind({});
Default.args = {
  componentId: 'pds-select-example',
  label: 'Select Label',
  type: 'select',
};
