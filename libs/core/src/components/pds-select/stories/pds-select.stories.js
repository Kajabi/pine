import { html } from 'lit';
import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';

export default {
  argTypes: extractArgTypes('pds-select'),
  args: {
    componentId: 'pds-select-example',
    disabled: true,
    label: 'Benzo Alpha',
    required: true,
    type: 'select',
  },
  argTypes: extractArgTypes('pds-select'),
  component: 'pds-select',
  title: 'components/Select',
};

const BaseTemplate = (args) =>
  html`<pds-select component-id="${args.componentId}" disabled="${args.disabled}" label="${args.label}" required="${args.required} type="${args.type}" />`;

export const Default = BaseTemplate.bind({});
Default.args = {
  componentId: 'pds-select-example',
  disabled: true,
  label: 'Select Label',
  required: true,
  type: 'select',
};
