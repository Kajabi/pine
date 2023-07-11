import { html } from 'lit-html';

// const BaseTemplate = (args) => html`<pds-select
//   component-id="${args.componentId}"
//   disabled="${args.disabled}"
//   error-message="${args.errorMessage}"
//   hint-message="${args.hintMessage}"
//   invalid="${args.invalid}"
//   label="${args.label}"
//   name="${args.name}"
//   onChange=${args.onChange}"
//   placeholder="${args.placeholder}"
//   readonly="${args.readonly}"
//   required="${args.required}"
//   value="${args.value}"
//   >
//   ${args.options}
// </pds-select>`;

const BaseTemplate = (args) => html`<pds-select
componentId="mySelect"
label="Favorite Number"
options=${args.options}
></pds-select>
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

const options = [
  'Option 1',
  'Option 2',
  'Option 3',
  'Option 4'
];

export const Default = BaseTemplate.bind({});
Default.args = {
  componentId: 'pds-select-default-example',
  label: 'Name',
  onChange: selectEventExample(),
  name: 'Default',
  options: options
};
Default.parameters = { ...defaultParameters };
