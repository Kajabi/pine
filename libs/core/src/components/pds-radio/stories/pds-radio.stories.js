import { html } from 'lit';
import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';
import { withActions } from '@storybook/addon-actions/decorator';

export default {
  args: {
    checked: false,
    disabled: false,
    hasBorder: false,
    invalid: false,
    hideLabel: false,
    required: false,
  },
  argTypes: extractArgTypes('pds-radio'),
  component: 'pds-radio',
  decorators: [withActions],
  parameters: {
    actions: {
      handles: ['onchange', 'pdsRadioChange'],
    },
  },
  title: 'components/Radio',
}

const BaseTemplate = (args) =>
  html` <pds-radio
    component-id=${args.componentId}
    label=${args.label}
    ?checked=${args.checked}
    ?disabled=${args.disabled}
    error-message=${args.errorMessage}
    ?has-border=${args.hasBorder}
    helper-message=${args.helperMessage}
    ?hide-label=${args.hideLabel}
    name=${args.name}
    ?indeterminate=${args.indeterminate}
    ?required=${args.required}
    value=${args.value}
    ?invalid=${args.invalid}
  />`;

export const Default = BaseTemplate.bind();
Default.args = {
  componentId: 'default',
  label: 'Label text',
};

export const Checked = BaseTemplate.bind();
Checked.args = {
  componentId: 'checked',
  label: 'Label text',
  checked: true,
};

export const Disabled = BaseTemplate.bind();
Disabled.args = {
  componentId: 'disabled',
  label: 'Label text',
  disabled: true,
};

export const withMessage = BaseTemplate.bind();
withMessage.args = {
  componentId: 'with-message',
  label: 'Label text',
  helperMessage: 'This is short message text',
};

export const Invalid = BaseTemplate.bind();
Invalid.args = {
  componentId: 'invalid',
  errorMessage: 'This is a short error message',
  label: 'Label text',
  invalid: true,
};

export const WithBorder = BaseTemplate.bind();
WithBorder.args = {
  componentId: 'with-border',
  label: 'Label text',
  hasBorder: true,
  helperMessage: 'This radio has a border for better visual separation',
};

const ImageTemplate = (args) =>
  html` <pds-radio
    component-id=${args.componentId}
    label=${args.label}
    ?checked=${args.checked}
    ?disabled=${args.disabled}
    error-message=${args.errorMessage}
    ?has-border=${args.hasBorder}
    helper-message=${args.helperMessage}
    ?hide-label=${args.hideLabel}
    name=${args.name}
    ?required=${args.required}
    value=${args.value}
    ?invalid=${args.invalid}
  >
    <pds-box slot="image" background-color="var(--pine-color-accent)" border-radius="full" padding="sm">
      <pds-icon icon="danger" size="medium" color="var(--pine-color-white)" />
    </pds-box>
  </pds-radio>`;

export const WithImage = ImageTemplate.bind();
WithImage.args = {
  componentId: 'with-image',
  label: 'Option with image',
  helperMessage: 'This radio includes an image using the image slot',
};
