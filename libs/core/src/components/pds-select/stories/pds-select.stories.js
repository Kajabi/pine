import { html } from 'lit';
import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';

export default {
  args: {
    autocomplete: null,
    disabled: false,
    errorMessage: null,
    helperMessage: null,
    multiple: false,
  },
  argTypes: extractArgTypes('pds-select'),
  component: 'pds-select',
  title: 'components/Select',
};

const options = [
  { value: 'paul', label: 'Paul McCartney' },
  { value: 'john', label: 'John Lennon' },
  { value: 'george', label: 'George Harrison' },
  { value: 'ringo', label: 'Ringo Starr' },
];

const BaseTemplate = (args) =>
  html`<pds-select
    autocomplete="${args.autocomplete}"
    component-id="${args.componentId}"
    disabled="${args.disabled}"
    error-message="${args.errorMessage}"
    helper-message="${args.helperMessage}"
    label="${args.label}"
    multiple="${args.multiple}"
    name="${args.name}"
    required="${args.required}"
    type="${args.type}"
  >
    ${options.map((option) => html`<option value="${option.value}">${option.label}</option>`)}
  </pds-select>`;

const OptgroupTemplate = (args) =>
  html`<pds-select
    autocomplete="${args.autocomplete}"
    component-id="${args.componentId}"
    disabled="${args.disabled}"
    error-message="${args.errorMessage}"
    helper-message="${args.helperMessage}"
    label="${args.label}"
    multiple="${args.multiple}"
    name="${args.name}"
    required="${args.required}"
    type="${args.type}"
  >
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
};

export const Disabled = BaseTemplate.bind({});
Disabled.args = {
  componentId: 'pds-select-disabled-example',
  disabled: true,
  label: 'Select your favorite Beatle',
  name: 'beatles',
};

export const withMessage = BaseTemplate.bind({});
withMessage.args = {
  componentId: 'pds-select-message-example',
  disabled: false,
  helperMessage: "Please don't pick Ringo",
  label: 'Select your favorite Beatle',
  name: 'beatles',
};

export const Invalid = BaseTemplate.bind({});
Invalid.args = {
  componentId: 'pds-select-invalid-example',
  disabled: false,
  errorMessage: 'Its not Ringo',
  label: 'Select your favorite Beatle',
  name: 'beatles',
};

export const Autocomplete = BaseTemplate.bind({});
Autocomplete.args = {
  componentId: 'pds-select-autocomplete-example',
  disabled: false,
  autocomplete: 'on',
  label: 'Select your favorite Beatle',
  name: 'beatles',
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
};
