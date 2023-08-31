import { html } from 'lit-html';

import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';

export default {
  args: {
    checked: false,
    componentId: null,
    disabled: false,
    errorMessage: null,
    hintMessage: null,
    invalid: false,
    label: null,
    required: false,
  },
  argTypes: extractArgTypes('pds-select'),
  component: "pds-select",
  subcomponents: {
    PdsSelectOption: 'pds-select-option',
  },
  title: "components/Select",
};

const BaseTemplate = (args) => html`
  <pds-select
    component-id=${args.componentId}
    error-message=${args.errorMessage}
    hint-message=${args.hintMessage}
    label=${args.label}
  >
    <pds-select-option component-id="opt0" value="">Select an Option</pds-select-option>
    <pds-select-option component-id="opt1" value="Option A value">testing</pds-select-option>
    <pds-select-option component-id="opt2" value="Option B value"></pds-select-option>
    <pds-select-option component-id="opt3" value="Option C value"></pds-select-option>
    <pds-select-option component-id="opt4" value="Option D value"></pds-select-option>
  </pds-select>
`;

const selectEventExample = () => {
  document.addEventListener('pdsSelectChange', function(e) {
    const select = e.target.shadowRoot.querySelector(".pds-select__field");

    console.log('e: ', select);
    console.log(`The value has been update to #${select.value}`);
  });
};

export const Default = BaseTemplate.bind();
Default.args = {
  componentId: 'pds-select-default-example',
  label: 'Label',
};

export const HintMessage = BaseTemplate.bind();
HintMessage.args = {
  componentId: 'pds-select-hint-message-example',
  hintMessage: 'This is a hint message',
  label: 'Label',
};

export const ErrorMessage = BaseTemplate.bind();
ErrorMessage.args = {
  componentId: 'pds-select-error-message-example',
  errorMessage: 'This is an error message',
  label: 'Label',
};
