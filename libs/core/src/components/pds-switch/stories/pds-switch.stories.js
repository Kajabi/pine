import { html } from 'lit-html';

const BaseTemplate = (args) => html`
  <pds-switch
    checked=${args.checked}
    component-id=${args.componentId}
    disabled=${args.disabled}
    error-message=${args.errorMessage}
    helper-message=${args.helperMessage}
    invalid=${args.invalid}
    label=${args.label}
    name=${args.name}
    onChange=${args.onChange}
    required=${args.required}
    type=${args.type}
  />
`;

const defaultParameters = { docs: { disable: true } };

const switchEventExample = () => {
  document.addEventListener('sageSwitchChange', function(e) {
    const input = e.target.shadowRoot.querySelector(".pds-switch__input");
    const inputState = input.checked ? '✅ checked' : '😭 not checked';

    console.info('sageSwitchChange event', e);
    console.info(`#${input.id} switch is: ${inputState}`);
  });
};

export const Default = BaseTemplate.bind({});

Default.args = {
  checked: false,
  disabled: false,
  componentId: 'pds-switch-checkbox-example',
  invalid: false,
  label: 'checkbox switch',
  name: 'pds-switch-checkbox',
  onChange: switchEventExample(),
  required: false,
  type: 'checkbox',
};
Default.parameters = { ...defaultParameters };

export const Radio = BaseTemplate.bind({});

Radio.args = {
  checked: false,
  disabled: false,
  componentId: 'pds-switch-radio-example',
  invalid: false,
  label: 'radio switch',
  name: 'pds-switch-radio',
  required: false,
  type: 'radio',
};
Radio.parameters = { ...defaultParameters };

export const Disabled = BaseTemplate.bind({});

Disabled.args = {
  checked: false,
  disabled: true,
  componentId: 'pds-switch-disabled-example',
  invalid: false,
  label: 'Can\'t touch this',
  name: 'pds-switch-disabled',
  required: false,
  type: 'checkbox',
};
Disabled.parameters = { ...defaultParameters };

export const HelperMessage = BaseTemplate.bind({});

HelperMessage.args = {
  checked: true,
  disabled: false,
  componentId: 'pds-switch-helper-example',
  helperMessage: 'Save my login details for next time.',
  invalid: false,
  label: 'Remember me!',
  name: 'pds-switch-message',
  required: false,
  type: 'checkbox',
};
HelperMessage.parameters = { ...defaultParameters };

export const Invalid = BaseTemplate.bind({});

Invalid.args = {
  checked: false,
  disabled: false,
  componentId: 'pds-switch-invalid-example',
  errorMessage: 'Terms and conditions must be accepted to continue',
  invalid: true,
  label: 'I agree to the terms and conditions',
  name: 'pds-switch-invalid',
  required: true,
  type: 'checkbox',
};
Invalid.parameters = { ...defaultParameters };
