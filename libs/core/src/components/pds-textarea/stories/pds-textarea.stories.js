import { html } from 'lit';
import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';
import { withActions } from '@storybook/addon-actions/decorator';

export default {
  args: {
    autocomplete: null,
    componentId: null,
    disabled: false,
    errorMessage: null,
    helperMessage: null,
    invalid: false,
    label: null,
    name: null,
    placeholder: null,
    readonly: false,
    required: false,
    value: null,
  },
  argTypes: extractArgTypes('pds-textarea'),
  component: 'pds-textarea',
  decorators: [withActions],
  parameters: {
    actions: {
      handles: ['onchange', 'pdsTextareaChange'],
    },
  },
  title: 'components/Textarea',
}

const BaseTemplate = (args) => html`<pds-textarea
  autocomplete="${args.autocomplete}"
  component-id="${args.componentId}"
  disabled="${args.disabled}"
  error-message="${args.errorMessage}"
  helper-message="${args.helperMessage}"
  invalid="${args.invalid}"
  label="${args.label}"
  name="${args.name}"
  onChange=${args.onChange}"
  placeholder="${args.placeholder}"
  readonly="${args.readonly}"
  required="${args.required}"
  rows="${args.rows}"
  value="${args.value}"
  >
</pds-textarea>`;

export const Default = BaseTemplate.bind({});
Default.args = {
  componentId: 'pds-textarea-default-example',
  label: 'Message',
  name: 'Default',
};

export const Rows = BaseTemplate.bind({});
Rows.args = {
  componentId: 'pds-textarea-rows-example',
  label: 'Message',
  name: 'Rows',
  rows: 4,
};

export const Required = BaseTemplate.bind({});
Required.args = {
  componentId: 'pds-textarea-required-example',
  label: 'Message',
  name: 'Required',
  required: true,
};

export const Placeholder = BaseTemplate.bind({});
Placeholder.args = {
  componentId: 'pds-textarea-placeholder-example',
  label: 'Message',
  name: 'Placeholder',
  placeholder: 'Enter a message...'
};

export const Disabled = BaseTemplate.bind({});
Disabled.args = {
  componentId: 'pds-textarea-disabled-example',
  disabled: true,
  label: 'Message',
  name: 'Disabled',
};

export const Readonly = BaseTemplate.bind({});
Readonly.args = {
  componentId: 'pds-textarea-readonly-example',
  label: 'Message',
  name: 'Readonly',
  readonly: true,
  value: 'Readonly Value'
};

export const WithMessage = BaseTemplate.bind({});
WithMessage.args = {
  componentId: 'pds-textarea-helper-example',
  helperMessage: 'Helper message text',
  label: 'Message',
  name: 'Message',
};

export const Invalid = BaseTemplate.bind({});
Invalid.args = {
  componentId: 'pds-textarea-error-example',
  errorMessage: 'Error',
  invalid: true,
  label: 'Message',
  name: 'Error',
  required: true,
};

export const Autocomplete = BaseTemplate.bind({});
Autocomplete.args = {
  componentId: 'pds-textarea-autocomplete',
  label: 'Message',
  name: 'message',
  autocomplete: 'on',
  placeholder: 'Enter a message...',
};
