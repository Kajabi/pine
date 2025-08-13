import { html } from 'lit';
import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';
import { withActions } from '@storybook/addon-actions/decorator';

export default {
  args: {
    autocomplete: null,
    disabled: false,
    errorMessage: null,
    hideLabel: false,
    helperMessage: null,
    invalid: false,
    multiple: false,
    value: null,
  },
  argTypes: extractArgTypes('pds-select'),
  component: 'pds-select',
  decorators: [withActions],
  parameters: {
    actions: {
      handles: ['onchange', 'pdsSelectChange'],
    },
  },
  title: 'components/Select',
};

const options = [
  { value: 'paul', label: 'Paul McCartney' },
  { value: 'john', label: 'John Lennon' },
  { value: 'george', label: 'George Harrison' },
  { value: 'ringo', label: 'Ringo Starr' },
];

const optgroupOptions = [
  {
    label: 'Correct answers',
    options: [
      { value: 'paul', label: 'Paul McCartney' },
      { value: 'john', label: 'John Lennon' },
      { value: 'george', label: 'George Harrison' },
    ],
  },
  {
    label: 'Incorrect answers',
    options: [{ value: 'ringo', label: 'Ringo Starr' }],
  },
];

const BaseTemplate = (args) =>
  html`<pds-select
    autocomplete="${args.autocomplete}"
    component-id="${args.componentId}"
    .disabled=${args.disabled}
    error-message="${args.errorMessage}"
    helper-message="${args.helperMessage}"
    .hide-label=${args.hideLabel}
    .invalid=${args.invalid}
    label="${args.label}"
    .multiple=${args.multiple}
    name="${args.name}"
    .required=${args.required}
    type="${args.type}"
    .value=${args.value}
  >
    ${args.action || ''}
    ${options.map((option) => html`<option value="${option.value}">${option.label}</option>`)}
  </pds-select>`;

const OptgroupTemplate = (args) =>
  html`<pds-select
    autocomplete="${args.autocomplete}"
    component-id="${args.componentId}"
    .disabled=${args.disabled}
    error-message="${args.errorMessage}"
    helper-message="${args.helperMessage}"
    .invalid=${args.invalid}
    label="${args.label}"
    .multiple=${args.multiple}
    name="${args.name}"
    .required=${args.required}
    type="${args.type}"
    .value=${args.value}
  >
    ${args.action || ''}
    ${optgroupOptions.map(
      (group) => html`<optgroup label="${group.label}">${group.options.map((option) => html`<option value="${option.value}">${option.label}</option>`)}</optgroup>`,
    )}
  </pds-select>`;

export const Default = BaseTemplate.bind({});
Default.args = {
  componentId: 'pds-select-default-example',
  disabled: false,
  label: 'Select your favorite Beatle',
  name: 'beatles',
  required: true,
  value: 'paul',
};

export const Disabled = BaseTemplate.bind({});
Disabled.args = {
  componentId: 'pds-select-disabled-example',
  disabled: true,
  label: 'Select your favorite Beatle',
  name: 'beatles',
  value: 'george',
};

export const withMessage = BaseTemplate.bind({});
withMessage.args = {
  componentId: 'pds-select-message-example',
  disabled: false,
  helperMessage: "Please don't pick Ringo",
  label: 'Select your favorite Beatle',
  name: 'beatles',
  value: 'john',
};

export const Invalid = BaseTemplate.bind({});
Invalid.args = {
  componentId: 'pds-select-invalid-example',
  disabled: false,
  errorMessage: 'Its not Ringo',
  invalid: true,
  label: 'Select your favorite Beatle',
  name: 'beatles',
  value: 'ringo',
};

export const Autocomplete = BaseTemplate.bind({});
Autocomplete.args = {
  componentId: 'pds-select-autocomplete-example',
  disabled: false,
  autocomplete: 'on',
  label: 'Select your favorite Beatle',
  name: 'beatles',
  value: 'paul',
};

export const Multiple = BaseTemplate.bind({});
Multiple.args = {
  componentId: 'pds-select-multiple-example',
  disabled: false,
  helperMessage: "Use 'Command' on your keyboard to select multiple options",
  label: 'Select your favorite Beatle',
  multiple: true,
  name: 'beatles',
};

export const WithOptgroup = OptgroupTemplate.bind({});
WithOptgroup.args = {
  componentId: 'pds-select-optgroup-example',
  disabled: false,
  label: 'Select your favorite Beatle',
  name: 'beatles',
  value: 'george',
};

export const withActionLink = (args) => html`<pds-select
  autocomplete="${args.autocomplete}"
  component-id="pds-select-action-link"
  .disabled=${args.disabled}
  error-message="${args.errorMessage}"
  helper-message="${args.helperMessage}"
  .hide-label=${args.hideLabel}
  .invalid=${args.invalid}
  label="Timezone"
  .multiple=${args.multiple}
  name="timezone"
  .required=${args.required}
  type="${args.type}"
  .value=${args.value}">
  <pds-link href="#" slot="action">
    Auto-detect
  </pds-link>
  ${options.map((option) => html`<option value="${option.value}">${option.label}</option>`)}
</pds-select>`;

export const withActionButton = (args) => html`<pds-select
  autocomplete="${args.autocomplete}"
  component-id="pds-select-action-button"
  .disabled=${args.disabled}
  error-message="${args.errorMessage}"
  helper-message="${args.helperMessage}"
  .hide-label=${args.hideLabel}
  .invalid=${args.invalid}
  label="Country"
  .multiple=${args.multiple}
  name="country"
  .required=${args.required}
  type="${args.type}"
  .value=${args.value}">
  <pds-button slot="action" variant="unstyled">
    <pds-icon name="question-circle"></pds-icon>
  </pds-button>
  ${options.map((option) => html`<option value="${option.value}">${option.label}</option>`)}
</pds-select>`;
