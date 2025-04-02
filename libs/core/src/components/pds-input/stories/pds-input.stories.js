import { html } from 'lit';
import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';
import { withActions } from '@storybook/addon-actions/decorator';

export default {
  argTypes: extractArgTypes('pds-input'),
  args: {
    autocomplete: null,
    debounce: null,
    disabled: false,
    errorMessage: null,
    helperMessage: null,
    hideLabel: false,
    invalid: false,
    label: null,
    name: null,
    placeholder: null,
    readonly: false,
    required: false,
    type: 'text'
  },
  component: 'pds-input',
  parameters: {
    actions: {
      handles: [
        'oninput', 'pdsInput',
        'onchange', 'pdsChange',
        'onblur', 'pdsBlur',
        'onFocus', 'pdsFocus'],
    },
  },
  title: 'components/Input',
  decorators: [withActions],
}

const BaseTemplate = (args) => html`<pds-input
  autocomplete="${args.autocomplete}"
  component-id="${args.componentId}"
  debounce="${args.debounce}"
  disabled="${args.disabled}"
  error-message="${args.errorMessage}"
  helper-message="${args.helperMessage}"
  invalid="${args.invalid}"
  label="${args.label}"
  hide-label="${args.hideLabel}"
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
  placeholder: 'Enter a email address...',
  type: 'email',
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

export const withMessage = BaseTemplate.bind({});
withMessage.args = {
  componentId: 'pds-input-helper-example',
  label: 'Email',
  helperMessage: 'Please use the correct format',
  type: 'email',
  value: 'user123@test.com'
};

export const Invalid = BaseTemplate.bind({});
Invalid.args = {
  componentId: 'pds-input-invalid-example',
  label: 'Email',
  errorMessage: "Please provide a valid email address",
  type: 'email',
  value: 'Frank Dux'
};

export const Autocomplete = BaseTemplate.bind({});
Autocomplete.args = {
  componentId: 'pds-input-autocomplete',
  label: 'First name',
  type: 'text',
  autocomplete: 'given-name',
};
