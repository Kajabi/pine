import { html } from 'lit-html';

const BaseTemplate = (args) => html`<sage-textarea
  component-id="${args.componentId}"
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
  componentId: 'uniqueIdDefault',
  label: 'Name',
  name: 'Default',
};
Default.parameters = { ...defaultParameters };

export const Rows = BaseTemplate.bind({});
Rows.args = {
  componentId: 'uniqueIdRows',
  label: 'Name',
  name: 'Rows',
  rows: 4,
};
Rows.parameters = { ...defaultParameters };

export const Required = BaseTemplate.bind({});
Required.args = {
  componentId: 'uniqueIdRequired',
  label: 'Name',
  name: 'Required',
  required: true,
};
Required.parameters = { ...defaultParameters };

export const Placeholder = BaseTemplate.bind({});
Placeholder.args = {
  componentId: 'uniqueIdPlaceholder',
  label: 'Name',
  name: 'Placeholder',
  placeholder: 'Placeholder...'
};
Placeholder.parameters = { ...defaultParameters };

export const Disabled = BaseTemplate.bind({});
Disabled.args = {
  componentId: 'uniqueIdDisabled',
  disabled: true,
  label: 'Name',
  name: 'Disabled',
};
Disabled.parameters = { ...defaultParameters };

export const Readonly = BaseTemplate.bind({});
Readonly.args = {
  componentId: 'uniqueIdReadonly',
  label: 'Name',
  name: 'Readonly',
  readonly: true,
  value: 'Readonly Value'
};
Readonly.parameters = { ...defaultParameters };

export const Hint = BaseTemplate.bind({});
Hint.args = {
  componentId: 'uniqueIdHint',
  hintMessage: 'Hint',
  label: 'Name',
  name: 'Hint',
};
Hint.parameters = { ...defaultParameters };

export const Error = BaseTemplate.bind({});
Error.args = {
  componentId: 'uniqueIdError',
  errorMessage: 'Error',
  invalid: true,
  label: 'Name',
  name: 'Error',
  required: true,
};
Error.parameters = { ...defaultParameters };
