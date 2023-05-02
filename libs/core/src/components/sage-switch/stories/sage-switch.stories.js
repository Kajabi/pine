import { html } from 'lit-html';

const BaseTemplate = (args) => html`
  <sage-switch
    checked=${args.checked}
    component-id=${args.componentId}
    disabled=${args.disabled}
    error-message=${args.errorMessage}
    helper-message=${args.helperMessage}
    invalid=${args.invalid}
    label=${args.label}
    name=${args.name}
    required=${args.required}
    type=${args.type}
  >
  </sage-switch>
`;

const defaultParameters = { docs: { disable: true } };

export const Default = BaseTemplate.bind({});

Default.args = {
  checked: false,
  disabled: false,
  componentId: 'sage-switch-checkbox-example',
  invalid: false,
  label: 'checkbox switch',
  name: 'sage-switch-checkbox',
  required: false,
  type: 'checkbox',
};
Default.parameters = { ...defaultParameters };

export const Radio = BaseTemplate.bind({});

Radio.args = {
  checked: false,
  disabled: false,
  componentId: 'sage-switch-radio-example',
  invalid: false,
  label: 'radio switch',
  name: 'sage-switch-radio',
  required: false,
  type: 'radio',
};
Radio.parameters = { ...defaultParameters };

export const Disabled = BaseTemplate.bind({});

Disabled.args = {
  checked: false,
  disabled: true,
  componentId: 'sage-switch-disabled-example',
  invalid: false,
  label: 'Can\'t touch this',
  name: 'sage-switch-disabled',
  required: false,
  type: 'checkbox',
};
Disabled.parameters = { ...defaultParameters };

export const HelperMessage = BaseTemplate.bind({});

HelperMessage.args = {
  checked: true,
  disabled: false,
  componentId: 'sage-switch-helper-example',
  helperMessage: 'Save my login details for next time.',
  invalid: false,
  label: 'Remember me!',
  name: 'sage-switch-message',
  required: false,
  type: 'checkbox',
};
HelperMessage.parameters = { ...defaultParameters };

export const Invalid = BaseTemplate.bind({});

Invalid.args = {
  checked: false,
  disabled: false,
  componentId: 'sage-switch-invalid-example',
  errorMessage: 'Terms and conditions must be accepted to continue',
  invalid: true,
  label: 'I agree to the terms and conditions',
  name: 'sage-switch-invalid',
  required: true,
  type: 'checkbox',
};
Invalid.parameters = { ...defaultParameters };
