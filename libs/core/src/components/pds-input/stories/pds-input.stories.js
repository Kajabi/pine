import { html } from 'lit-html';

const BaseTemplate = (args) => html`<pds-input
  disabled="${args.disabled}"
  error-text="${args.errorText}"
  hint="${args.hint}"
  invalid="${args.invalid}"
  component-id="${args.componentId}"
  label="${args.label}"
  name="${args.name}"
  placeholder="${args.placeholder}"
  readonly="${args.readonly}"
  required="${args.required}"
  type="${args.type}"
  value="${args.value}">
</pds-input>`;

const defaultParameters = {
  docs: {
    disable: true
  }
};

export const Text = BaseTemplate.bind({});
Text.args = {
  componentId: 'sage-input-text-example',
  label: 'Name',
  type: 'text',
  value: 'Frank Dux'
};
Text.parameters = { ...defaultParameters };

export const Email = BaseTemplate.bind({});
Email.args = {
  componentId: 'sage-input-email-example',
  label: 'Email',
  type: 'email',
  value: 'user123@test.com'
};
Email.parameters = { ...defaultParameters };

export const Required = BaseTemplate.bind({});
Required.args = {
  componentId: 'sage-input-required-example',
  label: 'Email',
  type: 'email',
  required: true,
  value: 'user123@test.com',
};
Required.parameters = { ...defaultParameters };

export const Placeholder = BaseTemplate.bind({});
Placeholder.args = {
  componentId: 'sage-input-placeholder-example',
  label: 'Email',
  placeholder: '123@email.com',
  type: 'email',
  value: 'user123@test.com'
};
Placeholder.parameters = { ...defaultParameters };

export const Disabled = BaseTemplate.bind({});
Disabled.args = {
  componentId: 'sage-input-disabled-example',
  label: 'Email',
  type: 'email',
  disabled: true,
  value: 'user123@test.com',
};
Disabled.parameters = { ...defaultParameters };

export const Readonly = BaseTemplate.bind({});
Readonly.args = {
  componentId: 'sage-input-readonly-example',
  label: 'Email',
  readonly: true,
  type: 'email',
  value: 'user123@test.com'
};
Readonly.parameters = { ...defaultParameters };

export const Hint = BaseTemplate.bind({});
Hint.args = {
  componentId: 'sage-input-hint-example',
  label: 'Email',
  hint: 'Please use the correct format',
  type: 'email',
  value: 'user123@test.com'
};
Hint.parameters = { ...defaultParameters };

export const Error = BaseTemplate.bind({});
Error.args = {
  componentId: 'sage-input-error-example',
  label: 'Email',
  errorText: "Please provide a valid Email address",
  type: 'email',
  value: 'user123@test.com'
};
Error.parameters = { ...defaultParameters };
