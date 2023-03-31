import { html } from 'lit-html';

const BaseTemplate = (args) => html`<sage-textarea
  disabled="${args.disabled}"
  error-text="${args.errorText}"
  hint="${args.hint}"
  invalid="${args.invalid}"
  label="${args.label}"
  name="${args.name}"
  placeholder="${args.placeholder}"
  readonly="${args.readonly}"
  required="${args.required}"
  rows="${args.rows}"
  textarea-id="${args.textareaId}"
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
  textareaId: 'uniqueIdDefault'
};
Default.parameters = { ...defaultParameters };

export const Rows = BaseTemplate.bind({});
Rows.args = {
  name: 'Rows',
  label: 'Name',
  rows: 4,
  textareaId: 'uniqueIdRows'
};
Rows.parameters = { ...defaultParameters };

export const Required = BaseTemplate.bind({});
Required.args = {
  name: 'Required',
  label: 'Name',
  textareaId: 'uniqueIdRequired',
  required: true
};
Required.parameters = { ...defaultParameters };

export const Placeholder = BaseTemplate.bind({});
Placeholder.args = {
  name: 'Placeholder',
  label: 'Name',
  textareaId: 'uniqueIdPlaceholder',
  placeholder: 'Placeholder...'
};
Placeholder.parameters = { ...defaultParameters };

export const Disabled = BaseTemplate.bind({});
Disabled.args = {
  name: 'Disabled',
  label: 'Name',
  textareaId: 'uniqueIdDisabled',
  disabled: true
};
Disabled.parameters = { ...defaultParameters };

export const Readonly = BaseTemplate.bind({});
Readonly.args = {
  name: 'Readonly',
  label: 'Name',
  textareaId: 'uniqueIdReadonly',
  readonly: true,
  value: 'Readonly Value'
};
Readonly.parameters = { ...defaultParameters };

export const Hint = BaseTemplate.bind({});
Hint.args = {
  name: 'Hint',
  label: 'Name',
  textareaId: 'uniqueIdHint',
  hint: 'Hint'
};
Hint.parameters = { ...defaultParameters };

export const Error = BaseTemplate.bind({});
Error.args = {
  name: 'Error',
  label: 'Name',
  textareaId: 'uniqueIdError',
  required: true,
  errorText: 'Error',
  invalid: true
};
Error.parameters = { ...defaultParameters };