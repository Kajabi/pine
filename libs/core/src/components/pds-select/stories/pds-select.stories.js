import { html } from 'lit';
import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';

export default {
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
    required="${args.required}"
    type="${args.type}"
  >
    <option value="paul">Paul McCartney</option>
    <option value="john">John Lennon</option>
    <option value="george">George Harrison</option>
    <option value="ringo">Ringo Starr</option>
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
  helperMessage: 'Please use the correct format',
  label: 'Select your favorite Beatle',
  name: 'beatles',
};

export const Invalid = BaseTemplate.bind({});
Invalid.args = {
  componentId: 'pds-select-invalid-example',
  disabled: false,
  errorMessage: 'Naw, son',
  label: 'Select your favorite Beatle',
  name: 'beatles',
};
