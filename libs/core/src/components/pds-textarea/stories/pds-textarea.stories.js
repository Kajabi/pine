import { html } from 'lit';
import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';

export default {
  args: {
    componentId: null,
    disabled: false,
    errorMessage: null,
    hintMessage: null,
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
  title: 'components/Textarea'
}

const BaseTemplate = (args) => html`<pds-textarea
  component-id="${args.componentId}"
  disabled="${args.disabled}"
  error-message="${args.errorMessage}"
  hint-message="${args.hintMessage}"
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

const textareaEventExample = () => {
  document.addEventListener('pdsTextareaChange', function(e) {
    const textarea = e.target.shadowRoot.querySelector(".pds-textarea__field");

    console.log('e: ', textarea);
    console.log(`The value has been update to #${textarea.value}`);
  });
};

export const Default = BaseTemplate.bind({});
Default.args = {
  componentId: 'pds-textarea-default-example',
  label: 'Name',
  onChange: textareaEventExample(),
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

export const Hint = BaseTemplate.bind({});
Hint.args = {
  componentId: 'pds-textarea-hint-example',
  hintMessage: 'Hint',
  label: 'Name',
  name: 'Hint',
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
