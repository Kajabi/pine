import { html } from 'lit-html';

const BaseTemplate = (args) =>
  html` <sage-checkbox
    id=${args.checkboxId}
    label=${args.label}
    checked=${args.checked}
    disabled=${args.disabled}
    message=${args.message}
    name=${args.name}
    indeterminate=${args.indeterminate}
    required=${args.required}
    value=${args.value}
  />`;

const defaultParameters = { docs: { disable: true } };

export const Default = BaseTemplate.bind();
Default.args = {
  checkboxId: 'default',
  label: 'Label text',
};
Default.parameters = { ...defaultParameters };

export const Checked = BaseTemplate.bind();
Checked.args = {
  checkboxId: 'checked',
  label: 'Label text',
  checked: true,
};
Checked.parameters = { ...defaultParameters };

export const Disabled = BaseTemplate.bind();
Disabled.args = {
  checkboxId: 'disabled',
  label: 'Label text',
  disabled: true,
};
Disabled.parameters = { ...defaultParameters };

export const Indeterminate = BaseTemplate.bind();
Indeterminate.args = {
  checkboxId: 'indeterminate',
  label: 'Label text',
  indeterminate: true,
};
Indeterminate.parameters = { ...defaultParameters };

export const withMessage = BaseTemplate.bind();
withMessage.args = {
  checkboxId: 'indeterminite',
  label: 'Label text',
  message: "This is short message text",
};
withMessage.parameters = { ...defaultParameters };

export const withError = BaseTemplate.bind();
withError.args = {
  checkboxId: 'errors',
  label: 'Label text',
  error: true,
};
withError.parameters = { ...defaultParameters };
