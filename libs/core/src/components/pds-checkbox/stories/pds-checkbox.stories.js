import { html } from 'lit';
import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';
import { withActions } from '@storybook/addon-actions/decorator';

export default {
  argTypes: extractArgTypes('pds-checkbox'),
  args: {
    checked: false,
    disabled: false,
    indeterminate: false,
    invalid: false,
    hideLabel: false,
    required: false,
  },
  component: 'pds-checkbox',
  decorators: [withActions],
  parameters: {
    actions: {
      handles: ['onchange', 'pdsCheckboxChange'],
    },
  },
  title: 'components/Checkbox',
}

const BaseTemplate = (args) =>
  html` <pds-checkbox
    component-id=${args.componentId}
    checked=${args.checked}
    disabled=${args.disabled}
    error-message=${args.errorMessage}
    helper-message=${args.helperMessage}
    hide-label=${args.hideLabel}
    indeterminate=${args.indeterminate}
    invalid=${args.invalid}
    label=${args.label}
    name=${args.name}
    required=${args.required}
    value=${args.value}
  />`;

export const Default = BaseTemplate.bind();
Default.args = {
  componentId: 'default',
  label: 'Label text',
};

export const Checked = BaseTemplate.bind();
Checked.args = {
  componentId: 'checked',
  label: 'Label text',
  checked: true,
};

export const Disabled = BaseTemplate.bind();
Disabled.args = {
  componentId: 'disabled',
  label: 'Label text',
  disabled: true,
};

export const Indeterminate = BaseTemplate.bind();
Indeterminate.args = {
  componentId: 'indeterminate',
  label: 'Label text',
  indeterminate: true,
  checked: true,
};

export const withMessage = BaseTemplate.bind();
withMessage.args = {
  componentId: 'with-message',
  label: 'Label text',
  helperMessage: "This is short message text",
};

export const Invalid = BaseTemplate.bind();
Invalid.args = {
  componentId: 'invalid',
  errorMessage: 'This is a short error message',
  label: 'Label text',
  invalid: true,
};
