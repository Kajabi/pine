import { html } from 'lit-html';

const BaseTemplate = (args) => html`
  <sage-switch
    checked=${args.checked}
    component-id=${args.componentId}
    disabled=${args.disabled}
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
  checked: true,
  disabled: true,
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

