import { html } from 'lit-html';

const BaseTemplate = (args) => html`
  <sage-switch
    checked=${args.checked}
    component-id=${args.componentId}
    disabled=${args.disabled}
    helper-message=${args.helperMessage}
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
  label: 'checkbox switch',
  name: 'form-input-checkbox',
  required: false,
  type: 'checkbox',
};
Default.parameters = { ...defaultParameters };

export const Radio = BaseTemplate.bind({});

Radio.args = {
  checked: false,
  disabled: false,
  componentId: 'sage-switch-radio-example',
  label: 'radio switch',
  name: 'form-input-radio',
  required: false,
  type: 'radio',
};
Radio.parameters = { ...defaultParameters };

export const HelperMessage = BaseTemplate.bind({});

HelperMessage.args = {
  checked: true,
  disabled: false,
  componentId: 'sage-switch-helper-example',
  helperMessage: 'Save my login details for next time.',
  label: 'Remember me!',
  name: 'form-input-message',
  required: false,
  type: 'checkbox',
};
HelperMessage.parameters = { ...defaultParameters };

