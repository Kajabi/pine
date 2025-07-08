import { html } from 'lit';
import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';
import { withActions } from '@storybook/addon-actions/decorator';

export default {
  args: {
    checked: false,
    disabled: false,
    invalid: false,
    hideLabel: false,
    required: false,
    variant: 'default',
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
    hide-label=${args.hideLabel}
    name=${args.name}
    indeterminate=${args.indeterminate}
    required=${args.required}
    value=${args.value}
    invalid=${args.invalid}
    variant=${args.variant}
    icon=${args.icon}
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

export const Contained = BaseTemplate.bind();
Contained.args = {
  componentId: 'contained',
  label: 'Label text',
  variant: 'contained',
  icon: 'star',
};

export const ContainedChecked = BaseTemplate.bind();
ContainedChecked.args = {
  componentId: 'contained-checked',
  label: 'Label text',
  variant: 'contained',
  icon: 'star',
  checked: true,
};

export const ContainedDisabled = BaseTemplate.bind();
ContainedDisabled.args = {
  componentId: 'contained-disabled',
  label: 'Label text',
  variant: 'contained',
  icon: 'star',
  disabled: true,
};

export const ContainedInvalid = BaseTemplate.bind();
ContainedInvalid.args = {
  componentId: 'contained-invalid',
  label: 'Label text',
  variant: 'contained',
  icon: 'star',
  invalid: true,
  errorMessage: 'This is a short error message',
};
