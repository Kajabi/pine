import { html } from 'lit';
import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';

export default {
  argTypes: extractArgTypes('pds-select'),
  args: {
    componentId: 'pds-select-example',
    disabled: true,
    hasError: true,
    helperMessage: 'Please use the correct format',
    label: 'Benzo Alpha',
    name: 'pets',
    required: true,
  },
  argTypes: extractArgTypes('pds-select'),
  component: 'pds-select',
  title: 'components/Select',
};

const BaseTemplate = (args) =>
  html`<pds-select component-id="${args.componentId}" disabled="${args.disabled}" has-error="${args.hasError}" helper-message="${args.helperMessage}" label="${args.label}"
  name="${args.name}" required="${args.required} type="${args.type}" />`;

export const Default = BaseTemplate.bind({});
Default.args = {
  componentId: 'pds-select-example',
  disabled: true,
  hasError: true,
  helperMessage: 'Please use the correct format',
  label: 'Select Label',
  name: 'pets',
  required: true,
};
