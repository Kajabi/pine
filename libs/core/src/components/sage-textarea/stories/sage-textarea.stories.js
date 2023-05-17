import { html } from 'lit-html';

const BaseTemplate = (args) => html`<sage-textarea
  disabled="${args.disabled}"
  error-message="${args.errorMessage}"
  hint-message="${args.hintMessage}"
  invalid="${args.invalid}"
  label="${args.label}"
  name="${args.name}"
  placeholder="${args.placeholder}"
  readonly="${args.readonly}"
  required="${args.required}"
  rows="${args.rows}"
  component-id="${args.componentId}"
  value="${args.value}"
  >
</sage-textarea>`;

const defaultParameters = {
  docs: {
    disable: true,
  },
};

export const Default = BaseTemplate.bind({});
Default.args = {
  name: 'Default',
  label: 'Name',
  componentId: 'uniqueIdDefault'
};
Default.parameters = { ...defaultParameters };

export const Rows = BaseTemplate.bind({});
Rows.args = {
  name: 'Rows',
  label: 'Name',
  rows: 4,
  componentId: 'uniqueIdRows'
};
Rows.parameters = { ...defaultParameters };

export const Required = BaseTemplate.bind({});
Required.args = {
  name: 'Required',
  label: 'Name',
  componentId: 'uniqueIdRequired',
  required: true
};
Required.parameters = { ...defaultParameters };

export const Placeholder = BaseTemplate.bind({});
Placeholder.args = {
  name: 'Placeholder',
  label: 'Name',
  componentId: 'uniqueIdPlaceholder',
  placeholder: 'Placeholder...'
};
Placeholder.parameters = { ...defaultParameters };

export const Disabled = BaseTemplate.bind({});
Disabled.args = {
  name: 'Disabled',
  label: 'Name',
  componentId: 'uniqueIdDisabled',
  disabled: true
};
Disabled.parameters = { ...defaultParameters };

export const Readonly = BaseTemplate.bind({});
Readonly.args = {
  name: 'Readonly',
  label: 'Name',
  componentId: 'uniqueIdReadonly',
  readonly: true,
  value: 'Readonly Value'
};
Readonly.parameters = { ...defaultParameters };

export const Hint = BaseTemplate.bind({});
Hint.args = {
  name: 'Hint',
  componentId: 'uniqueIdHint',
  label: 'Name',
  hintMessage: 'Hint'
};
Hint.parameters = { ...defaultParameters };

export const Error = BaseTemplate.bind({});
Error.args = {
  name: 'Error',
  label: 'Name',
  componentId: 'uniqueIdError',
  required: true,
  errorMessage: 'Error',
  invalid: true
};
Error.parameters = { ...defaultParameters };
