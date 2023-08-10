import { html } from 'lit-html';

const BaseTemplate = (args) => html`
  <pds-select-option component-id="${args.componentId}" value="${args.value}">"${args.textContent}"</pds-select-option>
`;

const defaultParameters = {
  code: {
    showCode: true,
  },
  docs: {
    disable: true,
  },
};

export const Default = BaseTemplate.bind({});
Default.args = {
  componentId: 'pds-select-option-default-example',
  value: 'My value',
};
Default.parameters = { ...defaultParameters };

export const TextContentOnly = BaseTemplate.bind({});
TextContentOnly.args = {
  componentId: 'pds-select-options-text-content-example',
  textContent: 'My text content',
};
TextContentOnly.parameters = { ...defaultParameters };

export const TextContentAndValue = BaseTemplate.bind({});
TextContentAndValue.args = {
  componentId: 'pds-select-options-text-content-and-value-example',
  textContent: 'My text content',
  value: 'My value',
};
TextContentAndValue.parameters = { ...defaultParameters };
