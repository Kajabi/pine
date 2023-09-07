import { html } from 'lit';
import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';
import { withActions } from '@storybook/addon-actions/decorator';

export default {
  args: {
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
  label: 'Name',
  name: 'Default',
};

export const Rows = BaseTemplate.bind({});
Rows.args = {
  componentId: 'pds-textarea-rows-example',
  label: 'Name',
  name: 'Rows',
  rows: 4,
};

export const Required = BaseTemplate.bind({});
Required.args = {
  componentId: 'pds-textarea-required-example',
  label: 'Name',
  name: 'Required',
  required: true,
};

export const Placeholder = BaseTemplate.bind({});
Placeholder.args = {
  componentId: 'pds-textarea-placeholder-example',
  label: 'Name',
  name: 'Placeholder',
  placeholder: 'Placeholder...'
};

export const Disabled = BaseTemplate.bind({});
Disabled.args = {
  componentId: 'pds-textarea-disabled-example',
  disabled: true,
  label: 'Name',
  name: 'Disabled',
};

export const Readonly = BaseTemplate.bind({});
Readonly.args = {
  componentId: 'pds-textarea-readonly-example',
  label: 'Name',
  name: 'Readonly',
  readonly: true,
  value: 'Readonly Value'
};

export const Message = BaseTemplate.bind({});
Message.args = {
  componentId: 'pds-textarea-helper-example',
  helperMessage: 'Helper message text',
  label: 'Name',
  name: 'Message',
};

export const Invalid = BaseTemplate.bind({});
Invalid.args = {
  componentId: 'pds-textarea-error-example',
  errorMessage: 'Error',
  invalid: true,
  label: 'Name',
  name: 'Error',
  required: true,
};
