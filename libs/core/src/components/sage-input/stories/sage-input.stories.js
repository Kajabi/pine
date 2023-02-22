import { html } from 'lit-html';

const Template = (args) => html`<sage-input
  disabled="${args.disabled}"
  error-text="${args.errorText}"
  hint="${args.hint}"
  id="${args.inputId}"
  label="${args.label}"
  name="${args.name}"
  placeholder="${args.placeholder}"
  readonly="${args.readonly}"
  required="${args.required}"
  type="${args.type}"
  value="${args.value}">
</sage-input>`;

const defaultParameters = {
  docs: {
    disabled: true
  }
};

export const Text = Template.bind({});
Text.args = {
  label: 'Name',
  type: 'text',
  value: 'Frank Dux'
};
Text.parameters = { ...defaultParameters };

export const Email = Template.bind({});
Email.args = {
  label: 'Email',
  type: 'email',
  value: 'user123@test.com'
};
Email.parameters = { ...defaultParameters };

export const Required = Template.bind({});
Required.args = {
  label: 'Email',
  type: 'email',
  required: true,
  value: 'user123@test.com',
};
Required.parameters = { ...defaultParameters };

export const Placeholder = Template.bind({});
Placeholder.args = {
  label: 'Email',
  placeholder: '123@email.com',
  type: 'email',
  value: 'user123@test.com'
};
Placeholder.parameters = { ...defaultParameters };

export const Disabled = Template.bind({});
Disabled.args = {
  label: 'Email',
  type: 'email',
  disabled: true,
  value: 'user123@test.com',
};
Disabled.parameters = { ...defaultParameters };

export const Readonly = Template.bind({});
Readonly.args = {
  label: 'Email',
  readonly: true,
  type: 'email',
  value: 'user123@test.com'
};
Readonly.parameters = { ...defaultParameters };

export const Hint = Template.bind({});
Hint.args = {
  label: 'Email',
  hint: 'Please use the correct format',
  type: 'email',
  value: 'user123@test.com'
};
Hint.parameters = { ...defaultParameters };

export const Error = Template.bind({});
Error.args = {
  label: 'Email',
  errorText: "Please provide a valid Email address",
  type: 'email',
  value: 'user123@test.com'
};
Error.parameters = { ...defaultParameters };
