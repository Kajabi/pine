import { html } from 'lit';


export default {

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
    chipSentiment: 'neutral',
    chipLarge: false,
    chipIcon: null,
    chipDot: false,
  },
  component: 'pds-combobox',
  title: 'components/Combobox',
  parameters: {
    layout: 'centered',
  },
};

const BaseTemplate = (args) => html`
<pds-combobox
  component-id=${args.componentId}
  name=${args.name}
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
  chip-sentiment=${args.chipSentiment}
  chip-large=${args.chipLarge}
  chip-icon=${args.chipIcon}
  chip-dot=${args.chipDot}
  value=${args.value}
>
  <option value="cat">Cat</option>
  <option value="dog">Dog</option>
  <option value="panda">Panda</option>
  <option value="snake">Snake</option>
</pds-combobox>`;

export const Default = BaseTemplate.bind();
Default.args = {
  componentId: 'combobox-story',
  name: 'favoriteAnimal',
  label: 'Favorite Animal',
  placeholder: 'placeholder_text',
  trigger: 'input',
  triggerVariant: 'secondary',
  mode: 'filter',
  value: 'panda',
};

export const ButtonTrigger = BaseTemplate.bind();
ButtonTrigger.args = {
  componentId: 'combobox-button-trigger-story',
  name: 'favoriteAnimal',
  label: 'Favorite Animal',
  placeholder: 'Select an animal',
  trigger: 'button',
  triggerVariant: 'secondary',
  mode: 'select-only',
  triggerWidth: '250px',
  value: 'dog',
};

export const ChipTriggerAndLayout = (args) => html`
<pds-box min-width="100%" direction="row" gap="sm" wrap>
  <pds-combobox
    component-id=${args.componentId}
    label=${args.label}
    placeholder=${args.placeholder}
    trigger=${args.trigger}
    mode=${args.mode}
    custom-option-layouts=${args.customOptionLayouts}
    custom-trigger-content=${args.customTriggerContent}
    trigger-width=${args.triggerWidth}
    value=${args.value}
  >
    <option value="draft" data-layout><pds-chip sentiment="neutral" dot>Draft</pds-chip></option>
    <option value="published" data-layout><pds-chip sentiment="success" dot>Published</pds-chip></option>
    <option value="archived" data-layout><pds-chip sentiment="warning" dot>Archived</pds-chip></option>
  </pds-combobox>
</pds-box>`;

ChipTriggerAndLayout.args = {
  componentId: 'combobox-chip-custom-layouts',
  name: 'draftStatus',
  customOptionLayouts: true,
  customTriggerContent: true,
  label: 'Draft Status',
  placeholder: 'Draft',
  mode: 'select-only',
  trigger: 'chip',
  triggerWidth: 'fit-content',
  value: 'published',
};

export const ChipTriggerLayoutWithIcons = (args) => html`
<pds-box min-width="100%" direction="row" gap="sm" wrap>
  <pds-combobox
    component-id=${args.componentId}
    label=${args.label}
    placeholder=${args.placeholder}
    trigger=${args.trigger}
    mode=${args.mode}
    custom-option-layouts=${args.customOptionLayouts}
    custom-trigger-content=${args.customTriggerContent}
    trigger-width=${args.triggerWidth}
    value=${args.value}
  >
    <option value="low" chip-sentiment="info" chip-icon="info-circle">Low</option>
    <option value="medium" chip-sentiment="warning" chip-icon="warning">Medium</option>
    <option value="high" chip-sentiment="danger" chip-icon="warning">High</option>
    <option value="critical" chip-sentiment="danger" chip-icon="danger">Critical</option>
  </pds-combobox>
</pds-box>`;

ChipTriggerLayoutWithIcons.args = {
  componentId: 'combobox-chip-automatic',
  name: 'status',
  label: 'Status',
  placeholder: 'Select a status',
  trigger: 'chip',
  mode: 'select-only',
  triggerWidth: 'fit-content',
  value: 'high',
};

export const Custom = (args) => html`

<pds-box min-width="100%">
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
        <pds-text class="option-title">Select a payment method</pds-text>
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
          <pds-text size="md" weight="semibold" class="option-title">None</pds-text>
          <pds-text size="sm" class="option-description">No debit/credit card payments</pds-text>
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
          <pds-text size="md" weight="semibold" class="option-title">Stripe</pds-text>
          <pds-text size="sm" class="option-description">Accept debit/credit cards through Stripe.</pds-text>
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
          <pds-text size="md" weight="semibold" class="option-title">PayPal</pds-text>
          <pds-text size="sm" class="option-description">Accept payments through PayPal.</pds-text>
        </pds-box>
      </pds-box>
    </option>
  </pds-combobox>
</pds-box>`;

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

export const OptionGroupsOptgroup = (args) => html`
<pds-combobox
  component-id="combobox-optgroups"
  label=${args.label}
  placeholder=${args.placeholder}
  trigger=${args.trigger}
  trigger-variant=${args.triggerVariant}
  mode=${args.mode}
  trigger-width=${args.triggerWidth}
  dropdown-width=${args.dropdownWidth}
  max-height=${args.maxHeight}
>
  <optgroup label="Mammals">
    <option value="cat">Cat</option>
    <option value="dog">Dog</option>
    <option value="elephant">Elephant</option>
    <option value="whale">Whale</option>
    <option value="dolphin">Dolphin</option>
    <option value="tiger">Tiger</option>
  </optgroup>
  <optgroup label="Birds">
    <option value="eagle">Eagle</option>
    <option value="parrot">Parrot</option>
    <option value="penguin">Penguin</option>
    <option value="owl">Owl</option>
    <option value="falcon">Falcon</option>
  </optgroup>
  <optgroup label="Fish">
    <option value="salmon">Salmon</option>
    <option value="shark">Shark</option>
    <option value="tuna">Tuna</option>
    <option value="goldfish">Goldfish</option>
  </optgroup>
  <optgroup label="Reptiles">
    <option value="snake">Snake</option>
    <option value="lizard">Lizard</option>
    <option value="turtle">Turtle</option>
    <option value="crocodile">Crocodile</option>
  </optgroup>
</pds-combobox>`;

OptionGroupsOptgroup.args = {
  componentId: 'combobox-optgroups',
  label: 'Select Animal',
  placeholder: 'Choose an animal',
  trigger: 'button',
  triggerVariant: 'secondary',
  mode: 'select-only',
  triggerWidth: '280px',
  dropdownWidth: '280px',
  maxHeight: '280px',
};

export const OptionGroupsPdsText = (args) => html`
<pds-combobox
  component-id="combobox-pds-text-groups"
  label=${args.label}
  placeholder=${args.placeholder}
  trigger=${args.trigger}
  trigger-variant=${args.triggerVariant}
  mode=${args.mode}
  trigger-width=${args.triggerWidth}
  dropdown-width=${args.dropdownWidth}
  max-height=${args.maxHeight}
>
  <pds-text color="secondary">Frontend Technologies</pds-text>
  <option value="react">React</option>
  <option value="vue">Vue.js</option>
  <option value="angular">Angular</option>
  <option value="svelte">Svelte</option>
  <option value="nextjs">Next.js</option>

  <pds-text color="secondary">Backend Technologies</pds-text>
  <option value="nodejs">Node.js</option>
  <option value="python">Python</option>
  <option value="java">Java</option>
  <option value="golang">Go</option>
  <option value="rust">Rust</option>

  <pds-text color="secondary">Databases</pds-text>
  <option value="postgresql">PostgreSQL</option>
  <option value="mongodb">MongoDB</option>
  <option value="mysql">MySQL</option>
  <option value="redis">Redis</option>

  <pds-text color="secondary">Cloud Services</pds-text>
  <option value="aws">AWS</option>
  <option value="azure">Azure</option>
  <option value="gcp">Google Cloud</option>
  <option value="vercel">Vercel</option>
</pds-combobox>`;

OptionGroupsPdsText.args = {
  componentId: 'combobox-pds-text-groups',
  label: 'Select Technology',
  placeholder: 'Choose a technology',
  trigger: 'input',
  mode: 'filter',
  triggerWidth: '300px',
  dropdownWidth: '300px',
  maxHeight: '280px',
};