import { html } from 'lit';
import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';
import { withActions } from '@storybook/addon-actions/decorator';

export default {
  argTypes: extractArgTypes('pds-combobox'),
  args: {
    customOptionLayouts: false,
    customTriggerContent: false,
    disabled: false,
    dropdownPlacement: 'bottom-start',
    dropdownWidth: '236px',
    hideLabel: false,
    maxHeight: null,
    mode: 'filter',
    trigger: 'input',
    triggerVariant: 'secondary',
    triggerWidth: 'fit-content',
  },
  component: 'pds-combobox',
  decorators: [withActions],
  title: 'components/Combobox',
  parameters: {
    layout: 'centered',
  },
};

const BaseTemplate = (args) => html`
<pds-combobox
  component-id=${args.componentId}
  custom-option-layouts=${args.customOptionLayouts}
  custom-trigger-content=${args.customTriggerContent}
  disabled=${args.disabled}
  dropdown-placement=${args.dropdownPlacement}
  dropdown-width=${args.dropdownWidth}
  hide-label=${args.hideLabel}
  max-height=${args.maxHeight}
  label=${args.label}
  placeholder=${args.placeholder}
  mode=${args.mode}
  trigger=${args.trigger}
  trigger-variant=${args.triggerVariant}
  trigger-width=${args.triggerWidth}
>
  <option value="cat">Cat</option>
  <option value="dog">Dog</option>
  <option value="panda">Panda</option>
  <option value="snake">Snake</option>
</pds-combobox>`;

export const Default = BaseTemplate.bind();
Default.args = {
  componentId: 'combobox-story',
  label: 'Favorite Animal',
  placeholder: 'placeholder_text',
  trigger: 'input',
  triggerVariant: 'secondary',
  mode: 'filter',
};

export const ButtonTrigger = BaseTemplate.bind();
ButtonTrigger.args = {
  componentId: 'combobox-button-trigger-story',
  label: 'Favorite Animal',
  placeholder: 'Select an animal',
  trigger: 'button',
  triggerVariant: 'secondary',
  mode: 'select-only',
  triggerWidth: '250px',
};

export const Custom = (args) => html`

<div style="width: 100%;">
  <pds-combobox
    component-id="combobox-custom-trigger-layouts"
    custom-trigger-content=${args.customTriggerContent}
    custom-option-layouts=${args.customOptionLayouts}
    label=${args.label}
    trigger=${args.trigger}
    trigger-variant=${args.triggerVariant}
    trigger-width=${args.triggerWidth}
    mode=${args.mode}
    dropdown-width=${args.dropdownWidth}
    on-pds-combobox-change={(e) => console.log(e.detail.value)}
  >
    <pds-box
      align-items="center"
      class="payment-trigger-layout"
      gap="sm"
      slot="trigger-content"
    >
      <pds-box
        align-items="center"
        align-self="center"
        background-color="var(--pine-color-grey-200)"
        border-radius="md"
        flex="shrink"
        gap="sm"
        justify-content="center"
        min-height="48px"
        min-width="48px"
      >
        <pds-icon icon="ban" color="var(--pine-color-text-neutral)"></pds-icon>
      </pds-box>
      <pds-box class="option-content" direction="column">
        <div class="option-title">Payment Method</div>
        <div class="option-description"> payment option.</div>
      </pds-box>
      <pds-icon icon="caret-down"></pds-icon>
    </pds-box>

    <option value="" data-layout data-search-text="None">
      <pds-box class="payment-option-layout" align-items="center" gap="sm">
        <pds-box
          align-items="center"
          align-self="center"
          background-color="var(--pine-color-grey-200)"
          border-radius="md"
          flex="shrink"
          gap="sm"
          justify-content="center"
          min-height="48px"
          min-width="48px"
        >
          <pds-icon icon="ban" color="var(--pine-color-text-neutral)"></pds-icon>
        </pds-box>
        <pds-box class="option-content" direction="column">
          <div class="option-title">None</div>
          <div class="option-description">No debit/credit card payments</div>
        </pds-box>
      </pds-box>
    </option>
    <option value="stripe" data-layout data-search-text="Stripe credit card payment">
      <pds-box class="payment-option-layout" align-items="center" gap="sm">
        <pds-box
          align-items="center"
          align-self="center"
          background-color="var(--pine-color-green-200)"
          border-radius="md"
          flex="shrink"
          gap="sm"
          justify-content="center"
          min-height="48px"
          min-width="48px"
        >
          <pds-icon icon="card-stripe"></pds-icon>
        </pds-box>
        <pds-box class="option-content" direction="column">
          <div class="option-title">Stripe</div>
          <div class="option-description">Accept debit/credit cards through Stripe.</div>
        </pds-box>
      </pds-box>
    </option>
    <option value="paypal" data-layout data-search-text="PayPal digital payments">
      <pds-box class="payment-option-layout" align-items="center" gap="sm">
        <pds-box
          align-items="center"
          align-self="center"
          background-color="var(--pine-color-green-200)"
          border-radius="md"
          flex="shrink"
          gap="sm"
          justify-content="center"
          min-height="48px"
          min-width="48px"
        >
          <pds-icon icon="card-paypal"></pds-icon>
        </pds-box>
        <pds-box class="option-content" direction="column">
          <div class="option-title">PayPal</div>
          <div class="option-description">Accept payments through PayPal.</div>
        </pds-box>
      </pds-box>
    </option>
  </pds-combobox>
</div>`;

Custom.args = {
  componentId: 'combobox-custom-trigger-layouts',
  label: 'Payment Method',
  placeholder: 'Select a payment method',
  trigger: 'button',
  triggerVariant: 'secondary',
  mode: 'select-only',
  triggerWidth: '500px',
  dropdownWidth: '500px',
  customTriggerContent: true,
  customOptionLayouts: true,
};