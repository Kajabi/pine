import { html } from 'lit-html';

import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';
import { withActions } from '@storybook/addon-actions/decorator';

export default {
  argTypes: extractArgTypes('pds-select'),
  args: {
    checked: false,
    componentId: null,
    disabled: false,
    errorMessage: null,
    helperMessage: null,
    invalid: false,
    label: null,
    required: false,
  },
  component: "pds-select",
  decorators: [withActions],
  parameters: {
    actions: {
      handles: ['pdsSelectChange', 'pdsSelectOptionSelected', 'keydown'],
    },
  },
  title: "components/Select",
};

const BaseTemplate = (args) => html`
  <pds-select
    component-id=${args.componentId}
    error-message=${args.errorMessage}
    helper-message=${args.helperMessage}
    label=${args.label}
  >
    <pds-select-option component-id="opt0" value="">Select an Option</pds-select-option>
    <pds-select-option component-id="opt1" value="Option A value">testing</pds-select-option>
  </pds-select>
`;

export const Default = BaseTemplate.bind();
Default.args = {
  componentId: 'pds-select-default-example',
  label: 'Label',
};

export const helperMessage = BaseTemplate.bind();
helperMessage.args = {
  componentId: 'pds-select-helper-message-example',
  helperMessage: 'This is a helper message',
  label: 'Label',
};

export const ErrorMessage = BaseTemplate.bind();
ErrorMessage.args = {
  componentId: 'pds-select-error-message-example',
  errorMessage: 'This is an error message',
  label: 'Label',
};