import { html } from 'lit-html';

const BaseTemplate = (args) => html`<sage-select
  component-id="${args.component}"
  disabled="${args.disabled}"
  error-message="${args.errorMessage}"
  helper-message="${args.helperMessage}"
  invalid="${args.invalid}"
  label="${args.label}"
  multiple="${args.multiple}"
  name="${args.name}"
  required="${args.required}"
  value="${args.value}">
</sage-input>`;

const defaultParameters = {
  docs: {
    disable: true
  }
};

export const Default = BaseTemplate.bind({});
Default.args = {
  componentId: 'sage-select-default-example',
  label: 'Name',
  value: 'Frank Dux Select'
};
Default.parameters = { ...defaultParameters };
