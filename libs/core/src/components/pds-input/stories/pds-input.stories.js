import { html } from 'lit';
import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';

export default {
  argTypes: extractArgTypes('pds-input'),
  args: {
    disabled: false,
    errorText: null,
    hint: null,
    invalid: false,
    name: null,
    placeholder: null,
    readonly: false,
    required: false,
    type: 'text'
  },
  component: 'pds-input',
  title: 'components/Input'
}

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

export const Text = BaseTemplate.bind({});
Text.args = {
  componentId: 'pds-input-text-example',
  label: 'Name',
  type: 'text',
  value: 'Frank Dux'
};

export const Email = BaseTemplate.bind({});
Email.args = {
  componentId: 'pds-input-email-example',
  label: 'Email',
  type: 'email',
  value: 'user123@test.com'
};

export const Required = BaseTemplate.bind({});
Required.args = {
  componentId: 'pds-input-required-example',
  label: 'Email',
  type: 'email',
  required: true,
  value: 'user123@test.com',
};

export const Placeholder = BaseTemplate.bind({});
Placeholder.args = {
  componentId: 'pds-input-placeholder-example',
  label: 'Email',
  placeholder: '123@email.com',
  type: 'email',
  value: 'user123@test.com'
};

export const Disabled = BaseTemplate.bind({});
Disabled.args = {
  componentId: 'pds-input-disabled-example',
  label: 'Email',
  type: 'email',
  disabled: true,
  value: 'user123@test.com',
};

export const Readonly = BaseTemplate.bind({});
Readonly.args = {
  componentId: 'pds-input-readonly-example',
  label: 'Email',
  readonly: true,
  type: 'email',
  value: 'user123@test.com'
};

export const Hint = BaseTemplate.bind({});
Hint.args = {
  componentId: 'pds-input-hint-example',
  label: 'Email',
  hint: 'Please use the correct format',
  type: 'email',
  value: 'user123@test.com'
};

export const Invalid = BaseTemplate.bind({});
Invalid.args = {
  componentId: 'pds-input-invalid-example',
  label: 'Email',
  errorText: "Please provide a valid Email address",
  type: 'email',
  value: 'user123@test.com'
};
