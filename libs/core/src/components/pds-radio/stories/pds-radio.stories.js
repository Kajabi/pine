import { html } from 'lit-html';

const BaseTemplate = (args) =>
  html` <pds-radio
    component-id=${args.componentId}
    label=${args.label}
    checked=${args.checked}
    disabled=${args.disabled}
    helper-message=${args.helperMessage}
    name=${args.name}
    indeterminate=${args.indeterminate}
    required=${args.required}
    value=${args.value}
    invalid=${args.invalid}
  />`;

const defaultParameters = { docs: { disable: true } };

export const Default = BaseTemplate.bind();
Default.args = {
  componentId: 'default',
  label: 'Label text',
};
Default.parameters = { ...defaultParameters };

export const Checked = BaseTemplate.bind();
Checked.args = {
  componentId: 'checked',
  label: 'Label text',
  checked: true,
};
Checked.parameters = { ...defaultParameters };

export const Disabled = BaseTemplate.bind();
Disabled.args = {
  componentId: 'disabled',
  label: 'Label text',
  disabled: true,
};
Disabled.parameters = { ...defaultParameters };

export const withMessage = BaseTemplate.bind();
withMessage.args = {
  componentId: 'with-message',
  label: 'Label text',
  helperMessage: 'This is short message text',
};
withMessage.parameters = { ...defaultParameters };

export const Invalid = BaseTemplate.bind();
Invalid.args = {
  componentId: 'invalid',
  label: 'Label text',
  invalid: true,
};
Invalid.parameters = { ...defaultParameters };
