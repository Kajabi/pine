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
  onInput=${args.onInput}
  required="${args.required}"
  value="${args.value}">
</sage-input>`;

const defaultParameters = {
  docs: {
    disable: true
  }
};

const selectEventExample = () => {
  document.addEventListener('sageSelectChange', function(e) {
    const select = e.target.shadowRoot.querySelector("select");

    console.info('sageSelectChange event', e);
    console.info(`#${select.id} select value is: ${select.value}`);
  });
};

export const Default = BaseTemplate.bind({});
Default.args = {
  componentId: 'sage-select-default-example',
  label: 'Name',
  onInput: selectEventExample(),
  value: 'Frank Dux Select'
};
Default.parameters = { ...defaultParameters };
