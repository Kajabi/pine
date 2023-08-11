import { html } from 'lit-html';

const BaseTemplate = (args) => html`
  <pds-select component-id="combobox" label="Label">
    <pds-select-option component-id="opt0" value="">Select an Option</pds-select-option>
    <pds-select-option component-id="opt1" value="Option A value">testing</pds-select-option>
    <pds-select-option component-id="opt2" value="Option B value"></pds-select-option>
    <pds-select-option component-id="opt3" value="Option C value"></pds-select-option>
    <pds-select-option component-id="opt4" value="Option D value"></pds-select-option>
  </pds-select>
`;

const defaultParameters = {
  docs: {
    disable: true,
  },
};

const selectEventExample = () => {
  document.addEventListener('pdsSelectChange', function(e) {
    const select = e.target.shadowRoot.querySelector(".pds-select__field");

    console.log('e: ', select);
    console.log(`The value has been update to #${select.value}`);
  });
};

export const Default = BaseTemplate.bind({});
Default.args = {
  componentId: 'pds-select-default-example',
  label: 'Name',
  name: 'Default',
};
Default.parameters = { ...defaultParameters };
