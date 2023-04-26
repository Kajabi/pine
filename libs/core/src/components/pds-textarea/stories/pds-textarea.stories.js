import { html } from 'lit-html';

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

const defaultParameters = {
  docs: {
    disable: true,
  },
};

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
Default.parameters = { ...defaultParameters };

export const Rows = BaseTemplate.bind({});
Rows.args = {
  componentId: 'pds-textarea-rows-example',
  label: 'Name',
  name: 'Rows',
  rows: 4,
};
Rows.parameters = { ...defaultParameters };

export const Required = BaseTemplate.bind({});
Required.args = {
  componentId: 'pds-textarea-required-example',
  label: 'Name',
  name: 'Required',
  required: true,
};
Required.parameters = { ...defaultParameters };

export const Placeholder = BaseTemplate.bind({});
Placeholder.args = {
  componentId: 'pds-textarea-placeholder-example',
  label: 'Name',
  name: 'Placeholder',
  placeholder: 'Placeholder...'
};
Placeholder.parameters = { ...defaultParameters };

export const Disabled = BaseTemplate.bind({});
Disabled.args = {
  componentId: 'pds-textarea-disabled-example',
  disabled: true,
  label: 'Name',
  name: 'Disabled',
};
Disabled.parameters = { ...defaultParameters };

export const Readonly = BaseTemplate.bind({});
Readonly.args = {
  componentId: 'pds-textarea-readonly-example',
  label: 'Name',
  name: 'Readonly',
  readonly: true,
  value: 'Readonly Value'
};
Readonly.parameters = { ...defaultParameters };

export const Hint = BaseTemplate.bind({});
Hint.args = {
  componentId: 'pds-textarea-hint-example',
  hintMessage: 'Hint',
  label: 'Name',
  name: 'Hint',
};
Hint.parameters = { ...defaultParameters };

export const Invalid = BaseTemplate.bind({});
Invalid.args = {
  componentId: 'pds-textarea-error-example',
  errorMessage: 'Error',
  invalid: true,
  label: 'Name',
  name: 'Error',
  required: true,
};
Invalid.parameters = { ...defaultParameters };