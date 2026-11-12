import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';


export default {

  args: {
    disabled: false,
    hideLabel: false,
    required: false,
  },
  component: 'pds-switch',
  parameters: {},
  title: 'components/Switch',
}

const BaseTemplate = (args) => html`
  <pds-switch
    ?checked=${args.checked}
    component-id=${args.componentId}
    ?disabled=${args.disabled}
    error-message=${args.errorMessage}
    helper-message=${args.helperMessage}
    ?invalid=${args.invalid}
    label=${args.label}
    ?hide-label=${args.hideLabel}
    name=${args.name}
    onChange=${args.onChange}
    ?required=${args.required}
    type=${args.type}
    unchecked-value=${ifDefined(args.uncheckedValue)}
    value=${ifDefined(args.value)}
  />
`;

export const Default = BaseTemplate.bind({});

Default.args = {
  checked: false,
  disabled: false,
  componentId: 'pds-switch-checkbox-example',
  invalid: false,
  label: 'checkbox switch',
  name: 'pds-switch-checkbox',
  required: false,
  type: 'checkbox',
};

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

export const WithMessage = BaseTemplate.bind({});

WithMessage.args = {
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

export const DisabledWithReason = BaseTemplate.bind({});

DisabledWithReason.args = {
  checked: false,
  disabled: true,
  componentId: 'pds-switch-disabled-reason-example',
  helperMessage: 'Free offers can\'t have affiliate commissions.',
  invalid: false,
  label: 'Affiliate commissions',
  name: 'pds-switch-disabled-reason',
  required: false,
  type: 'checkbox',
};

export const Described = (args) => html`
  <pds-box direction="column" gap="xs">
    <pds-text id="pds-switch-described-text" tag="p">Send customers a receipt after each purchase.</pds-text>
    <pds-switch
      aria-describedby="pds-switch-described-text"
      ?checked=${args.checked}
      component-id=${args.componentId}
      ?disabled=${args.disabled}
      label=${args.label}
      name=${args.name}
    ></pds-switch>
  </pds-box>
`;

Described.args = {
  checked: false,
  disabled: false,
  componentId: 'pds-switch-described-example',
  label: 'Purchase receipts',
  name: 'pds-switch-described',
};

// Shows what the form submits, since an unchecked value isn't visible on the switch itself.
const showFormData = (event) => {
  const form = event.target.closest('form');
  const output = form?.querySelector('output');
  if (!form || !output) return;
  // The switch updates its form value after the change event, so read it once that's done.
  requestAnimationFrame(() => {
    const entries = Array.from(new FormData(form).entries());
    output.textContent = entries.length > 0 ? entries.map(([key, value]) => `${key}=${value}`).join('&') : '(nothing)';
  });
};

const submitted = ({ checked, name, uncheckedValue, value }) => {
  if (checked) return `${name}=${value ?? 'on'}`;
  return uncheckedValue === undefined ? '(nothing)' : `${name}=${uncheckedValue}`;
};

export const UncheckedValue = (args) => html`
  <form @pdsSwitchChange=${showFormData}>
    <pds-box direction="column" gap="sm">
      <pds-switch
        ?checked=${args.checked}
        component-id=${args.componentId}
        label=${args.label}
        name=${args.name}
        unchecked-value=${ifDefined(args.uncheckedValue)}
        value=${ifDefined(args.value)}
      ></pds-switch>
      <pds-text tag="p">Submits: <output>${submitted(args)}</output></pds-text>
    </pds-box>
  </form>
`;

UncheckedValue.args = {
  checked: false,
  componentId: 'pds-switch-unchecked-value-example',
  label: 'Email notifications',
  name: 'notify',
  uncheckedValue: '0',
  value: '1',
};
