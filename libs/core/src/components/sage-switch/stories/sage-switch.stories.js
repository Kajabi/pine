import { html } from 'lit-html';

const BaseTemplate = (args) => html`
  <sage-switch
    disabled=${args.disabled}
    id=${args.componentId}
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
  disabled: false,
  componentId: 'sage-switch-checkbox-example',
  label: 'radio switch',
  name: 'form-input-radio',
  required: false,
  type: 'radio',
};
Radio.parameters = { ...defaultParameters };

