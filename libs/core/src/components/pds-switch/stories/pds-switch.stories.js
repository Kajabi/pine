import { html } from 'lit';
import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';
import { withActions } from '@storybook/addon-actions/decorator';

export default {
  args: {
    disabled: false,
    required: false,
  },
  argTypes: extractArgTypes('pds-switch'),
  component: 'pds-switch',
  decorators: [withActions],
  parameters: {
    actions: {
      handles: ['onchange', 'pdsSwitchChange'],
    },
  },
  title: 'components/Switch',
}

const BaseTemplate = (args) => html`
  <pds-switch
    checked=${args.checked}
    component-id=${args.componentId}
    disabled=${args.disabled}
    error-message=${args.errorMessage}
    helper-message=${args.helperMessage}
    invalid=${args.invalid}
    label=${args.label}
    name=${args.name}
    onChange=${args.onChange}
    required=${args.required}
    type=${args.type}
  />
`;

export const Default = BaseTemplate.bind({});

Default.args = {
  checked: false,
  disabled: false,
  componentId: 'pds-switch-checkbox-example',
  invalid: false,
  label: 'checkbox switch',
  name: 'pds-switch-checkbox',
  required: false,
  type: 'checkbox',
};

export const Disabled = BaseTemplate.bind({});

Disabled.args = {
  checked: false,
  disabled: true,
  componentId: 'pds-switch-disabled-example',
  invalid: false,
  label: 'Can\'t touch this',
  name: 'pds-switch-disabled',
  required: false,
  type: 'checkbox',
};

export const WithMessage = BaseTemplate.bind({});

WithMessage.args = {
  checked: true,
  disabled: false,
  componentId: 'pds-switch-helper-example',
  helperMessage: 'Save my login details for next time.',
  invalid: false,
  label: 'Remember me!',
  name: 'pds-switch-message',
  required: false,
  type: 'checkbox',
};

export const Invalid = BaseTemplate.bind({});

Invalid.args = {
  checked: false,
  disabled: false,
  componentId: 'pds-switch-invalid-example',
  errorMessage: 'Terms and conditions must be accepted to continue',
  invalid: true,
  label: 'I agree to the terms and conditions',
  name: 'pds-switch-invalid',
  required: true,
  type: 'checkbox',
};
