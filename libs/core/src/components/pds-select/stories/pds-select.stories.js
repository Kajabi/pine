import { html } from 'lit';
import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';

export default {
  argTypes: extractArgTypes('pds-select'),
  args: {
    componentId: 'pds-select-example',
    label: 'Benzo Alpha',
    name: 'beatles',
    options: JSON.stringify([
      { value: 'john', label: 'John Lennon1' },
      { value: 'paul', label: 'Paul McCartney1' },
      { value: 'george', label: 'George Harrison1' },
      { value: 'ringo', label: 'Ringo Starr1' },
    ]),
  },
  argTypes: extractArgTypes('pds-select'),
  component: 'pds-select',
  title: 'components/Select',
};

const BaseTemplate = (args) =>
  html`<pds-select
    component-id="${args.componentId}"
    disabled="${args.disabled}"
    error-message="${args.errorMessage}"
    helper-message="${args.helperMessage}"
    label="${args.label}"
    name="${args.name}"
    .options=${args.options}
    required="${args.required}"
    type="${args.type}"
  />`;

export const Default = BaseTemplate.bind({});
Default.args = {
  componentId: 'pds-select-default-example',
  disabled: false,
  label: 'Select your favorite Beatle',
  name: 'beatles',
  options: JSON.stringify([
    { value: 'paul', label: 'Paul McCartney' },
    { value: 'john', label: 'John Lennon' },
    { value: 'george', label: 'George Harrison' },
    { value: 'ringo', label: 'Ringo Starr' },
  ]),
  required: true,
};

export const Disabled = BaseTemplate.bind({});
Disabled.args = {
  componentId: 'pds-select-disabled-example',
  disabled: true,
  label: 'Select your favorite Beatle',
  name: 'beatles',
  options: JSON.stringify([
    { value: 'paul', label: 'Paul McCartney' },
    { value: 'john', label: 'John Lennon' },
    { value: 'george', label: 'George Harrison' },
    { value: 'ringo', label: 'Ringo Starr' },
  ]),
};

export const withMessage = BaseTemplate.bind({});
withMessage.args = {
  componentId: 'pds-select-message-example',
  disabled: false,
  helperMessage: 'Please use the correct format',
  label: 'Select your favorite Beatle',
  name: 'beatles',
  options: JSON.stringify([
    { value: 'paul', label: 'Paul McCartney' },
    { value: 'john', label: 'John Lennon' },
    { value: 'george', label: 'George Harrison' },
    { value: 'ringo', label: 'Ringo Starr' },
  ]),
};

export const Invalid = BaseTemplate.bind({});
Invalid.args = {
  componentId: 'pds-select-invalid-example',
  disabled: false,
  errorMessage: 'Naw, son',
  label: 'Select your favorite Beatle',
  name: 'beatles',
  options: JSON.stringify([
    { value: 'paul', label: 'Paul McCartney' },
    { value: 'john', label: 'John Lennon' },
    { value: 'george', label: 'George Harrison' },
    { value: 'ringo', label: 'Ringo Starr' },
  ]),
};
