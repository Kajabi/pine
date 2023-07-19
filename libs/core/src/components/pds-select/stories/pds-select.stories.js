import { html } from 'lit-html';

const BaseTemplate = (args) => html`
  <pds-select component-id="combobox">
    <pds-select-option component-id="opt1" value="Option A value"></pds-select-option>
    <pds-select-option component-id="opt2" value="Option B value"></pds-select-option>
    <pds-select-option component-id="opt3" value="Option C value"></pds-select-option>
    <pds-select-option component-id="opt4" value="Option D value"></pds-select-option>
  </pds-select>
`;

// TODO: This example is to handle cases when the value is different from the pds-select-option text content
// const BaseTemplate = (args) => html`
//   <pds-select component-id="combobox">
//     <pds-select-option component-id="opt1" value="val1">Option A value</pds-select-option>
//     <pds-select-option component-id="opt2" value="val2">Option B value</pds-select-option>
//     <pds-select-option component-id="opt3" value="val3">Option C value</pds-select-option>
//     <pds-select-option component-id="opt4" value="val4">Option D value</pds-select-option>
//   </pds-select>
// `;

// THIS DEMO DOESN'T WORK BECAUSE A VALUE MUST BE PRESENT, IT MAY MAKE SENSE TO SET IS AS REQUIRED IN THE PROPS
// const BaseTemplate = (args) => html`
//   <pds-select>
//     <pds-select-option>Option A Slot</pds-select-option>
//     <pds-select-option>Option B Slot</pds-select-option>
//     <pds-select-option>Option C Slot</pds-select-option>
//     <pds-select-option>Option D Slot</pds-select-option>
//   </pds-select>
// `;

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
  // onChange: selectEventExample(),
  name: 'Default',
};
Default.parameters = { ...defaultParameters };

// export const SlottedOptions = OptionsSlotTemplate.bind({});
// SlottedOptions.args = {
//   componentId: 'pds-select-options-slot-example',
//   label: 'Name',
//   onChange: selectEventExample(),
//   name: 'Slotted Options',
// };
// SlottedOptions.parameters = { ...defaultParameters };
