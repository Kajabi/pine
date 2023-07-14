import { html } from 'lit-html';

const BaseTemplate = (args) => html`
  <pds-select>
    <pds-select-option value="Option A value"></pds-select-option>
    <pds-select-option value="Option B value"></pds-select-option>
    <pds-select-option value="Option C value"></pds-select-option>
    <pds-select-option value="Option D value"></pds-select-option>
  </pds-select>
`;

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
  onChange: selectEventExample(),
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
