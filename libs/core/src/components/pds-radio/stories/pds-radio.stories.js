import { html } from 'lit';
import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';
import { withActions } from '@storybook/addon-actions/decorator';

export default {
  args: {
    checked: false,
    disabled: false,
    invalid: false,
    labelHidden: false,
    required: false,
  },
  argTypes: extractArgTypes('pds-radio'),
  component: 'pds-radio',
  decorators: [withActions],
  parameters: {
    actions: {
      handles: ['onchange', 'pdsRadioChange'],
    },
  },
  title: 'components/Radio',
}

const BaseTemplate = (args) =>
  html` <pds-radio
    component-id=${args.componentId}
    label=${args.label}
    checked=${args.checked}
    disabled=${args.disabled}
    error-message=${args.errorMessage}
    helper-message=${args.helperMessage}
    label-hidden=${args.labelHidden}
    name=${args.name}
    indeterminate=${args.indeterminate}
    required=${args.required}
    value=${args.value}
    invalid=${args.invalid}
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

export const withMessage = BaseTemplate.bind();
withMessage.args = {
  componentId: 'with-message',
  label: 'Label text',
  helperMessage: 'This is short message text',
};

export const Invalid = BaseTemplate.bind();
Invalid.args = {
  componentId: 'invalid',
  errorMessage: 'This is a short error message',
  label: 'Label text',
  invalid: true,
};
