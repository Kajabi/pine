import { html } from 'lit';

export default {
  args: {
    checked: false,
    disabled: false,
    indeterminate: false,
    invalid: false,
    hideLabel: false,
    required: false,
    variant: 'default',
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'pill'],
    },
  },
  component: 'pds-checkbox',
  parameters: {},
  title: 'components/Checkbox',
}

const BaseTemplate = (args) =>
  html` <pds-checkbox
    component-id=${args.componentId}
    ?checked=${args.checked}
    ?disabled=${args.disabled}
    error-message=${args.errorMessage}
    helper-message=${args.helperMessage}
    ?hide-label=${args.hideLabel}
    ?indeterminate=${args.indeterminate}
    ?invalid=${args.invalid}
    label=${args.label}
    name=${args.name}
    ?required=${args.required}
    value=${args.value}
    variant=${args.variant}
  />`;

export const Default = BaseTemplate.bind();
Default.args = {
  componentId: 'default',
  label: 'Label text',
};

export const Checked = BaseTemplate.bind();
Checked.args = {
  componentId: 'checked',
  label: 'Label text',
  checked: true,
};

export const Disabled = BaseTemplate.bind();
Disabled.args = {
  componentId: 'disabled',
  label: 'Label text',
  disabled: true,
};

export const Indeterminate = BaseTemplate.bind();
Indeterminate.args = {
  componentId: 'indeterminate',
  label: 'Label text',
  indeterminate: true,
  checked: true,
};

export const withMessage = BaseTemplate.bind();
withMessage.args = {
  componentId: 'with-message',
  label: 'Label text',
  helperMessage: "This is short message text",
};

export const Invalid = BaseTemplate.bind();
Invalid.args = {
  componentId: 'invalid',
  errorMessage: 'This is a short error message',
  label: 'Label text',
  invalid: true,
};

export const Pill = BaseTemplate.bind();
Pill.args = {
  componentId: 'pill',
  label: 'Label text',
  variant: 'pill',
};

const PillGroupTemplate = (args) =>
  html`<fieldset style="border: 0; margin: 0; padding: 0;">
    <legend style="font: var(--pine-typography-body-medium); margin-block-end: var(--pine-dimension-xs); padding: 0;">Send to</legend>
    <pds-box wrap gap="xs">
      <pds-checkbox component-id="pill-email" name="channels" value="email" label="Email" variant="pill" checked ?disabled=${args.disabled} ?invalid=${args.invalid}></pds-checkbox>
      <pds-checkbox component-id="pill-sms" name="channels" value="sms" label="SMS" variant="pill" ?disabled=${args.disabled} ?invalid=${args.invalid}></pds-checkbox>
      <pds-checkbox component-id="pill-push" name="channels" value="push" label="Push notification" variant="pill" ?disabled=${args.disabled} ?invalid=${args.invalid}></pds-checkbox>
    </pds-box>
  </fieldset>`;

export const PillGroup = PillGroupTemplate.bind();
PillGroup.args = {};

export const PillDisabled = PillGroupTemplate.bind();
PillDisabled.args = {
  disabled: true,
};

export const PillInvalid = PillGroupTemplate.bind();
PillInvalid.args = {
  invalid: true,
};
