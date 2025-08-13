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
    fullWidth: false,
    helperMessage: null,
    invalid: false,
    max: null,
    maxlength: null,
    min: null,
    minlength: null,
    pattern: null,
    step: null,
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
  .debounce=${args.debounce}
  .disabled=${args.disabled}
  error-message="${args.errorMessage}"
  .full-width=${args.fullWidth}
  helper-message="${args.helperMessage}"
  .invalid=${args.invalid}
  label="${args.label}"
  name="${args.name}"
  placeholder="${args.placeholder}"
  .readonly=${args.readonly}
  .required=${args.required}
  type="${args.type}"
  .value=${args.value}">
  ${args.prefix || ''}
  ${args.suffix || ''}
  ${args.prepend || ''}
  ${args.append || ''}
  ${args.action || ''}
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

export const FullWidth = BaseTemplate.bind({});
FullWidth.args = {
  componentId: 'pds-input-full-width-example',
  label: 'Full Width Input',
  type: 'text',
  fullWidth: true,
  placeholder: 'This input takes full width of its container',
};

export const withPrefixIcon = (args) => html`<pds-input
  autocomplete="${args.autocomplete}"
  component-id="pds-input-prefix-icon"
  .debounce=${args.debounce}
  .disabled=${args.disabled}
  error-message="${args.errorMessage}"
  helper-message="${args.helperMessage}"
  .invalid=${args.invalid}
  label="Email"
  name="${args.name}"
  placeholder="${args.placeholder}"
  .readonly=${args.readonly}
  .required=${args.required}
  type="email"
  .value=${args.value}">
  <pds-icon slot="prefix" name="mail" size="small"></pds-icon>
</pds-input>`;

export const withSuffixButton = (args) => html`<pds-input
  autocomplete="${args.autocomplete}"
  component-id="pds-input-suffix-button"
  .debounce=${args.debounce}
  .disabled=${args.disabled}
  error-message="${args.errorMessage}"
  helper-message="${args.helperMessage}"
  .invalid=${args.invalid}
  label="Search"
  name="${args.name}"
  placeholder="${args.placeholder}"
  .readonly=${args.readonly}
  .required=${args.required}
  type="text"
  .value=${args.value}">
  <pds-button slot="suffix" variant="unstyled" class="pds-input__suffix">
    <pds-icon name="search" size="small"></pds-icon>
  </pds-button>
</pds-input>`;

export const withPrependSelect = (args) => html`<pds-input
  autocomplete="${args.autocomplete}"
  component-id="pds-input-prepend-select"
  .debounce=${args.debounce}
  .disabled=${args.disabled}
  error-message="${args.errorMessage}"
  helper-message="${args.helperMessage}"
  .invalid=${args.invalid}
  label="Amount"
  name="${args.name}"
  placeholder="${args.placeholder}"
  .readonly=${args.readonly}
  .required=${args.required}
  type="text"
  .value=${args.value}>
  <pds-select .hide-label=${true} label="Currency" slot="prepend" class="pds-input__prepend" name="currency">
    <option value="USD">USD</option>
    <option value="EUR">EUR</option>
    <option value="GBP">GBP</option>
  </pds-select>
</pds-input>`;

export const withAppendSelect = (args) => html`<pds-input
  autocomplete="${args.autocomplete}"
  component-id="pds-input-append-select"
  .debounce=${args.debounce}
  .disabled=${args.disabled}
  error-message="${args.errorMessage}"
  helper-message="${args.helperMessage}"
  .invalid=${args.invalid}
  label="Phone"
  name="${args.name}"
  placeholder="${args.placeholder}"
  .readonly=${args.readonly}
  .required=${args.required}
  type="tel"
  .value=${args.value}>
  <pds-select .hide-label=${true} slot="append" class="pds-input__append" name="phone-type">
    <option value="mobile">Mobile</option>
    <option value="home">Home</option>
    <option value="work">Work</option>
  </pds-select>
</pds-input>`;

export const withPrefixAndAppend = (args) => html`<pds-input
  autocomplete="${args.autocomplete}"
  component-id="pds-input-prefix-append"
  .debounce=${args.debounce}
  .disabled=${args.disabled}
  error-message="${args.errorMessage}"
  helper-message="${args.helperMessage}"
  .invalid=${args.invalid}
  label="Amount"
  name="${args.name}"
  placeholder="${args.placeholder}"
  .readonly=${args.readonly}
  .required=${args.required}
  type="text"
  .value=${args.value}>
  <pds-icon slot="prefix" name="dollar" size="small"></pds-icon>
  <pds-select .hide-label=${true} slot="append" class="pds-input__append" name="currency">
    <option value="USD">USD</option>
    <option value="EUR">EUR</option>
    <option value="GBP">GBP</option>
  </pds-select>
</pds-input>`;

export const withPrependAndSuffix = (args) => html`<pds-input
  autocomplete="${args.autocomplete}"
  component-id="pds-input-prepend-suffix"
  .debounce=${args.debounce}
  .disabled=${args.disabled}
  error-message="${args.errorMessage}"
  helper-message="${args.helperMessage}"
  .invalid=${args.invalid}
  label="Amount"
  name="${args.name}"
  placeholder="${args.placeholder}"
  .readonly=${args.readonly}
  .required=${args.required}
  type="text"
  .value=${args.value}>
  <pds-select .hide-label=${true} slot="prepend" class="pds-input__prepend" name="currency">
    <option value="USD">USD</option>
    <option value="EUR">EUR</option>
    <option value="GBP">GBP</option>
  </pds-select>
  <pds-button slot="suffix" variant="unstyled" class="pds-input__suffix">
    <pds-icon name="remove-circle" size="small"></pds-icon>
  </pds-button>
</pds-input>`;

export const withActionLink = (args) => html`<pds-input
  autocomplete="${args.autocomplete}"
  component-id="pds-input-action-link"
  .debounce=${args.debounce}
  .disabled=${args.disabled}
  error-message="${args.errorMessage}"
  helper-message="${args.helperMessage}"
  .invalid=${args.invalid}
  label="Password"
  name="${args.name}"
  placeholder="${args.placeholder}"
  .readonly=${args.readonly}
  .required=${true}
  type="password"
  .value=${args.value}">
  <pds-link href="#" slot="action">
    Forgot password?
  </pds-link>
</pds-input>`;

export const withActionButton = (args) => html`<pds-input
  autocomplete="${args.autocomplete}"
  component-id="pds-input-action-button"
  .debounce=${args.debounce}
  .disabled=${args.disabled}
  error-message="${args.errorMessage}"
  helper-message="Choose a unique username"
  .invalid=${args.invalid}
  label="Username"
  name="${args.name}"
  placeholder="${args.placeholder}"
  .readonly=${args.readonly}
  .required=${args.required}
  type="text"
  .value=${args.value}">
  <pds-button slot="action" variant="unstyled">
    <pds-icon name="question-circle"></pds-icon>
  </pds-button>
</pds-input>`;
