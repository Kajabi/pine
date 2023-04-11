import { html } from 'lit-html';

const BaseTemplate = (args) => html`<sage-textarea
  disabled="${args.disabled}"
  error-text="${args.errorText}"
  hint-text="${args.hintText}"
  invalid="${args.invalid}"
  label-text="${args.labelText}"
  name="${args.name}"
  placeholder-text="${args.placeholderText}"
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
  labelText: 'Name',
  componentId: 'uniqueIdDefault'
};
Default.parameters = { ...defaultParameters };

export const Rows = BaseTemplate.bind({});
Rows.args = {
  name: 'Rows',
  labelText: 'Name',
  rows: 4,
  componentId: 'uniqueIdRows'
};
Rows.parameters = { ...defaultParameters };

export const Required = BaseTemplate.bind({});
Required.args = {
  name: 'Required',
  labelText: 'Name',
  componentId: 'uniqueIdRequired',
  required: true
};
Required.parameters = { ...defaultParameters };

export const Placeholder = BaseTemplate.bind({});
Placeholder.args = {
  name: 'Placeholder',
  labelText: 'Name',
  componentId: 'uniqueIdPlaceholder',
  placeholderText: 'Placeholder...'
};
Placeholder.parameters = { ...defaultParameters };

export const Disabled = BaseTemplate.bind({});
Disabled.args = {
  name: 'Disabled',
  labelText: 'Name',
  componentId: 'uniqueIdDisabled',
  disabled: true
};
Disabled.parameters = { ...defaultParameters };

export const Readonly = BaseTemplate.bind({});
Readonly.args = {
  name: 'Readonly',
  labelText: 'Name',
  componentId: 'uniqueIdReadonly',
  readonly: true,
  value: 'Readonly Value'
};
Readonly.parameters = { ...defaultParameters };

export const Hint = BaseTemplate.bind({});
Hint.args = {
  name: 'Hint',
  labelText: 'Name',
  componentId: 'uniqueIdHint',
  hintText: 'Hint'
};
Hint.parameters = { ...defaultParameters };

export const Error = BaseTemplate.bind({});
Error.args = {
  name: 'Error',
  labelText: 'Name',
  componentId: 'uniqueIdError',
  required: true,
  errorText: 'Error',
  invalid: true
};
Error.parameters = { ...defaultParameters };
