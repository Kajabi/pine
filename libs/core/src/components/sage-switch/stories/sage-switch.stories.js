import { html } from 'lit-html';

const BaseTemplate = (args) => html`
  <sage-switch
    disabled=${args.disabled}
    id=${args.componentId}
    label=${args.label}
    name=${args.name}
    type=${args.type}
  >
  </sage-switch>
`;

const defaultParameters = { docs: { disable: true } };

export const Default = BaseTemplate.bind({});

Default.args = {
  disabled: false,
  componentId: 'cw2323',
  label: 'checkbox switch',
  name: 'form-input-checkbox',
  type: 'checkbox',
};
Default.parameters = { ...defaultParameters };

