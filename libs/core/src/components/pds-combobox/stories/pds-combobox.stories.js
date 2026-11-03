import { html } from 'lit';


export default {

  args: {
    customOptionLayouts: false,
    customTriggerContent: false,
    disabled: false,
    dropdownPlacement: 'bottom-start',
    dropdownMount: 'host',
    dropdownWidth: '236px',
    errorMessage: null,
    flyoutMaxWidth: '380px',
    flyoutMinWidth: '280px',
    groupDisplay: 'inline',
    helperMessage: null,
    hideLabel: false,
    invalid: false,
    maxHeight: null,
    mode: 'filter',
    trigger: 'input',
    triggerVariant: 'secondary',
    triggerWidth: 'fit-content',
    truncate: false,
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
  ?disabled=${args.disabled}
  dropdown-placement=${args.dropdownPlacement}
  dropdown-mount=${args.dropdownMount}
  dropdown-width=${args.dropdownWidth}
  error-message=${args.errorMessage}
  helper-message=${args.helperMessage}
  hide-label=${args.hideLabel}
  invalid=${args.invalid}
  max-height=${args.maxHeight}
  label=${args.label}
  placeholder=${args.placeholder}
  mode=${args.mode}
  trigger=${args.trigger}
  trigger-variant=${args.triggerVariant}
  trigger-width=${args.triggerWidth}
  truncate=${args.truncate}
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

export const HelperMessage = BaseTemplate.bind();
HelperMessage.args = {
  componentId: 'combobox-helper-story',
  name: 'favoriteAnimal',
  label: 'Favorite Animal',
  placeholder: 'placeholder_text',
  helperMessage: 'Start typing to filter the list.',
};

export const ErrorMessage = BaseTemplate.bind();
ErrorMessage.args = {
  componentId: 'combobox-error-story',
  name: 'favoriteAnimal',
  label: 'Favorite Animal',
  placeholder: 'placeholder_text',
  errorMessage: 'Please choose an animal.',
  invalid: true,
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

// trigger-shape="input": the same field as pds-select, empty and with a value, beside one.
export const ButtonTriggerInputShape = (args) => html`
<div style="display: grid; gap: 16px; grid-template-columns: repeat(2, 240px);">
  <pds-combobox component-id="combobox-input-shape-empty" label=${args.label} trigger="button" trigger-shape=${args.triggerShape} trigger-variant=${args.triggerVariant} trigger-width="100%" mode="select-only" placeholder=${args.placeholder} ?disabled=${args.disabled}>
    <option value="tag">Tag</option>
    <option value="offer">Offer</option>
  </pds-combobox>
  <pds-select component-id="select-input-shape-empty" label="Conditional" ?disabled=${args.disabled}>
    <option value="">Select conditional...</option>
    <option value="is">is</option>
  </pds-select>
  <pds-combobox component-id="combobox-input-shape-filled" label=${args.label} trigger="button" trigger-shape=${args.triggerShape} trigger-variant=${args.triggerVariant} trigger-width="100%" mode="select-only" value="tag" ?disabled=${args.disabled}>
    <option value="tag">Tag</option>
    <option value="offer">Offer</option>
  </pds-combobox>
  <pds-select component-id="select-input-shape-filled" label="Conditional" value="is" ?disabled=${args.disabled}>
    <option value="">Select conditional...</option>
    <option value="is">is</option>
  </pds-select>
</div>`;

ButtonTriggerInputShape.args = {
  label: 'Category',
  placeholder: 'Select category',
  triggerShape: 'input',
  triggerVariant: 'secondary',
  disabled: false,
};

ButtonTriggerInputShape.argTypes = {
  triggerShape: { control: 'inline-radio', options: ['pill', 'input'] },
  triggerVariant: { control: 'inline-radio', options: ['secondary', 'primary', 'accent', 'destructive'] },
};

export const ProgrammaticClear = (args) => html`
<pds-box direction="column" gap="sm" align-items="start">
  <pds-combobox
    id="combobox-clear-story"
    component-id=${args.componentId}
    name=${args.name}
    label=${args.label}
    placeholder=${args.placeholder}
    trigger=${args.trigger}
    mode=${args.mode}
    value=${args.value}
  >
    <option value="cat">Cat</option>
    <option value="dog">Dog</option>
    <option value="panda">Panda</option>
    <option value="snake">Snake</option>
  </pds-combobox>
  <pds-button
    variant="secondary"
    size="sm"
    @click=${() => document.querySelector('#combobox-clear-story').clear()}
  >
    Reset
  </pds-button>
</pds-box>`;
ProgrammaticClear.args = {
  componentId: 'combobox-clear-story',
  name: 'favoriteAnimal',
  label: 'Favorite Animal',
  placeholder: 'Select an animal',
  trigger: 'input',
  mode: 'filter',
  value: 'panda',
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

export const OptionGroupsWithIcons = (args) => html`
<pds-combobox
  component-id="combobox-optgroup-icons"
  label=${args.label}
  placeholder=${args.placeholder}
  trigger=${args.trigger}
  mode=${args.mode}
  trigger-width=${args.triggerWidth}
  dropdown-width=${args.dropdownWidth}
>
  <optgroup label="Tag" data-icon="hashtag">
    <option value="tag-add">Add a tag</option>
    <option value="tag-remove">Remove a tag</option>
  </optgroup>
  <optgroup label="Email" data-icon="mail">
    <option value="email-send">Send an email</option>
  </optgroup>
  <optgroup label="Coupon" data-icon="coupon">
    <option value="coupon-send">Send a coupon</option>
  </optgroup>
</pds-combobox>`;

OptionGroupsWithIcons.args = {
  label: 'Action',
  placeholder: 'Select an action',
  trigger: 'button',
  mode: 'select-only',
  triggerWidth: '280px',
  dropdownWidth: '280px',
};

export const OptionGroupsFromOptions = (args) => html`
<pds-combobox
  component-id="combobox-grouped-options"
  label=${args.label}
  placeholder=${args.placeholder}
  trigger=${args.trigger}
  mode=${args.mode}
  trigger-width=${args.triggerWidth}
  dropdown-width=${args.dropdownWidth}
  .options=${args.options}
></pds-combobox>`;

OptionGroupsFromOptions.args = {
  label: 'Action',
  placeholder: 'Select an action',
  trigger: 'button',
  mode: 'select-only',
  triggerWidth: '280px',
  dropdownWidth: '280px',
  // Tag's options are split by Email on purpose: each group still renders together.
  options: [
    { id: 'tag-add', text: 'Add a tag', group: 'Tag', groupIcon: 'hashtag' },
    { id: 'email-send', text: 'Send an email', group: 'Email', groupIcon: 'mail' },
    { id: 'tag-remove', text: 'Remove a tag', group: 'Tag' },
    { id: 'coupon-send', text: 'Send a coupon', group: 'Coupon', groupIcon: 'coupon' },
  ],
};

export const GroupDisplayFlyout = (args) => html`
<div style="min-height: 420px;">
  <pds-combobox
    component-id="combobox-group-flyout"
    label=${args.label}
    placeholder=${args.placeholder}
    trigger=${args.trigger}
    mode=${args.mode}
    group-display="flyout"
    trigger-width=${args.triggerWidth}
    dropdown-width=${args.dropdownWidth}
    flyout-min-width=${args.flyoutMinWidth}
    flyout-max-width=${args.flyoutMaxWidth}
    .options=${args.options}
  ></pds-combobox>
</div>`;

GroupDisplayFlyout.args = {
  label: 'Action',
  placeholder: 'Select an action',
  trigger: 'input',
  mode: 'filter',
  // Narrower than the old 408px default (matches Action Catalog's trigger/dropdown width),
  // leaving more room for the flyout on typical viewports. This alone doesn't guarantee a flyout
  // on a cramped canvas (e.g. Storybook with the Controls panel docked): the room check compares
  // available space against flyout-min-width (280px), not dropdown-width, so a narrow enough
  // canvas still falls back to drill-in — correctly, there's genuinely no room for both.
  triggerWidth: '280px',
  dropdownWidth: '280px',
  flyoutMinWidth: '280px',
  flyoutMaxWidth: '380px',
  options: [
    { id: 'offer-grant', text: 'Grant an offer', group: 'Offer', groupIcon: 'grant-offer' },
    { id: 'offer-revoke', text: 'Revoke an offer', group: 'Offer' },
    { id: 'tag-add', text: 'Add a tag', group: 'Tag', groupIcon: 'hashtag' },
    { id: 'tag-remove', text: 'Remove a tag', group: 'Tag' },
    { id: 'email-send', text: 'Send an email', group: 'Email', groupIcon: 'mail' },
    { id: 'coupon-send', text: 'Send a coupon', group: 'Coupon', groupIcon: 'coupon' },
  ],
};

export const GroupDisplayDrillInWithPanelSearch = (args) => html`
<div style="min-height: 360px;">
  <pds-combobox
    component-id="combobox-group-drill-in"
    label=${args.label}
    placeholder=${args.placeholder}
    trigger="button"
    mode="select-only"
    group-display="drill-in"
    ?panel-search=${args.panelSearch}
    search-placeholder=${args.searchPlaceholder}
    search-options-label=${args.searchOptionsLabel}
    drill-in-back-label=${args.drillInBackLabel}
    no-options-found-label=${args.noOptionsFoundLabel}
    trigger-width=${args.triggerWidth}
    dropdown-width=${args.dropdownWidth}
    .options=${args.options}
  ></pds-combobox>
</div>`;

// Search for something that matches no filter to see noOptionsFoundLabel.
GroupDisplayDrillInWithPanelSearch.args = {
  panelSearch: true,
  noOptionsFoundLabel: 'No filters found',
  label: 'Filter',
  placeholder: 'Choose a filter',
  searchPlaceholder: 'Search filters',
  searchOptionsLabel: 'Search filters',
  drillInBackLabel: 'Back',
  triggerWidth: '320px',
  dropdownWidth: '320px',
  options: [
    { id: 'email-status', text: 'Marketing status', group: 'Email', groupIcon: 'mail' },
    { id: 'email-activity', text: 'Email activity', group: 'Email' },
    { id: 'email-broadcasts', text: 'Broadcasts', group: 'Email' },
    { id: 'contact-added', text: 'Was added', group: 'Contact', groupIcon: 'hashtag' },
    { id: 'contact-hidden', text: 'Is hidden', group: 'Contact' },
  ],
};

GroupDisplayDrillInWithPanelSearch.argTypes = {
  noOptionsFoundLabel: { control: 'text' },
};

// A category picker: ungrouped categories with icons, and groups listed between them in the
// data's order. Once a category is chosen, the trigger shows its icon, or its group's.
export const OptionIconsWithGroups = (args) => html`
<div style="min-height: 480px;">
  <pds-combobox
    component-id="combobox-option-icons"
    label=${args.label}
    hide-label
    placeholder=${args.placeholder}
    trigger="button"
    trigger-shape="input"
    mode="select-only"
    group-display=${args.groupDisplay}
    panel-search
    search-placeholder=${args.searchPlaceholder}
    search-options-label=${args.searchPlaceholder}
    drill-in-back-label="Back"
    trigger-width=${args.triggerWidth}
    dropdown-width=${args.triggerWidth}
    .options=${args.options}
  ></pds-combobox>
</div>`;

OptionIconsWithGroups.args = {
  label: 'Category',
  placeholder: 'Select category',
  searchPlaceholder: 'Search categories',
  groupDisplay: 'drill-in',
  triggerWidth: '360px',
  options: [
    { id: 'assessment', text: 'Assessment', icon: 'assessment' },
    { id: 'contact', text: 'Contact', icon: 'contact' },
    { id: 'coupon', text: 'Coupon', icon: 'coupon' },
    { id: 'broadcast', text: 'Broadcast', group: 'Email', groupIcon: 'mail' },
    { id: 'email-activity', text: 'Email activity', group: 'Email' },
    { id: 'marketing-status', text: 'Email marketing status', group: 'Email' },
    { id: 'sequence', text: 'Sequence', group: 'Email' },
    { id: 'event', text: 'Event', icon: 'calendar-date' },
    { id: 'custom-fields', text: 'Custom fields', group: 'Fields', groupIcon: 'columns' },
    { id: 'default-fields', text: 'Default fields', group: 'Fields' },
    { id: 'form', text: 'Form', icon: 'form' },
    { id: 'tag', text: 'Tag', icon: 'hashtag' },
  ],
};

// truncate: a long label in the trigger and the options, without it (wrapping, as by default) and
// with it (one line, with an ellipsis). Options with an icon and in a group truncate too.
const truncateOptions = [
  { id: 'onboarding', text: 'Assessment for the quarterly onboarding cohort', icon: 'assessment' },
  { id: 'contact', text: 'Contact who joined during the spring membership launch', icon: 'contact' },
  { id: 'broadcast', text: 'Broadcast to everyone who joined the spring membership launch', group: 'Email', groupIcon: 'mail' },
  { id: 'sequence', text: 'Sequence', group: 'Email' },
  { id: 'tag', text: 'Tag', icon: 'hashtag' },
];

export const Truncate = (args) => html`
<div style="display: flex; gap: 48px; min-height: 360px;">
  ${[false, true].map(truncate => html`
  <pds-combobox
    component-id=${`combobox-truncate-${truncate ? 'on' : 'off'}`}
    label=${truncate ? 'With truncate' : 'Without truncate'}
    trigger=${args.trigger}
    trigger-shape=${args.triggerShape}
    trigger-variant=${args.triggerVariant}
    mode="select-only"
    trigger-width=${args.triggerWidth}
    dropdown-width=${args.triggerWidth}
    value=${args.value}
    ?truncate=${truncate}
    .options=${args.options}
  ></pds-combobox>`)}
</div>`;

Truncate.args = {
  trigger: 'button',
  triggerShape: 'input',
  triggerVariant: 'secondary',
  triggerWidth: '240px',
  value: 'onboarding',
  options: truncateOptions,
};

Truncate.argTypes = {
  trigger: { control: 'select', options: ['input', 'button'] },
  triggerShape: { control: 'select', options: ['pill', 'input'] },
};

// A large action catalog: many groups, a button trigger and panel search. The narrower widths
// leave room for the flyout beside the dropdown on a narrow canvas.
export const GroupDisplayActionCatalog = (args) => html`
<div style="min-height: 520px;">
  <pds-combobox
    component-id="combobox-action-catalog"
    label=${args.label}
    placeholder=${args.placeholder}
    trigger="button"
    mode="select-only"
    group-display=${args.groupDisplay}
    ?panel-search=${args.panelSearch}
    search-placeholder=${args.searchPlaceholder}
    search-options-label=${args.searchOptionsLabel}
    drill-in-back-label=${args.drillInBackLabel}
    trigger-width=${args.triggerWidth}
    dropdown-width=${args.dropdownWidth}
    .options=${args.options}
  ></pds-combobox>
</div>`;

GroupDisplayActionCatalog.args = {
  panelSearch: true,
  label: 'Action',
  placeholder: 'Choose an action',
  groupDisplay: 'flyout',
  searchPlaceholder: 'Search actions',
  searchOptionsLabel: 'Search actions',
  drillInBackLabel: 'Back',
  triggerWidth: '280px',
  dropdownWidth: '280px',
  options: [
    { id: 'contact_tag_add', text: 'Add a tag', group: 'Contact', groupIcon: 'contact' },
    { id: 'contact_tag_remove', text: 'Remove a tag', group: 'Contact' },
    { id: 'enroll_in_workflow', text: 'Enroll in an automation', group: 'Contact' },
    { id: 'email_send', text: 'Send an email', group: 'Communication', groupIcon: 'mail' },
    { id: 'email_sequence_subscribe', text: 'Subscribe to a sequence', group: 'Communication' },
    { id: 'email_sequence_unsubscribe', text: 'Unsubscribe from a sequence', group: 'Communication' },
    { id: 'sms_send', text: 'Send a text message', group: 'Communication' },
    { id: 'offer_send', text: 'Send an offer', group: 'Communication' },
    { id: 'event_register', text: 'Register for an event', group: 'Communication' },
    { id: 'event_deregister', text: 'Deregister from an event', group: 'Communication' },
    { id: 'offer_grant', text: 'Grant an offer', group: 'Membership', groupIcon: 'product' },
    { id: 'offer_revoke', text: 'Revoke an offer', group: 'Membership' },
    { id: 'offer_cancel_payment_and_access', text: 'Cancel payment and access', group: 'Membership' },
    { id: 'coupon_send', text: 'Send a coupon', group: 'Membership' },
    { id: 'certificate_send', text: 'Send a certificate', group: 'Membership' },
    { id: 'community_channel_member_add', text: 'Add to a channel', group: 'Communities', groupIcon: 'users' },
    { id: 'community_channel_member_remove', text: 'Remove from a channel', group: 'Communities' },
    { id: 'community_post_to_channel', text: 'Post to a channel', group: 'Communities' },
    { id: 'community_send_dm', text: 'Send a community message', group: 'Communities' },
    { id: 'coaching_invoice_reminder', text: 'Send an invoice reminder', group: 'Coaching', groupIcon: 'one-off-session' },
    { id: 'coaching_sessions_cancel', text: 'Cancel sessions', group: 'Coaching' },
    { id: 'coaching_sessions_remove', text: 'Remove sessions', group: 'Coaching' },
    { id: 'instagram_direct_message', text: 'Send an Instagram message', group: 'Instagram', groupIcon: 'logo-instagram' },
    { id: 'instagram_reply', text: 'Reply to an Instagram comment', group: 'Instagram' },
    { id: 'facebook_direct_message', text: 'Send a Facebook message', group: 'Facebook', groupIcon: 'logo-facebook' },
    { id: 'facebook_reply', text: 'Reply to a Facebook comment', group: 'Facebook' },
  ],
};

GroupDisplayActionCatalog.argTypes = {
  groupDisplay: { control: 'inline-radio', options: ['inline', 'flyout', 'drill-in'] },
};

export const DisabledOptions = (args) => html`
<div style="min-height: 320px;">
  <pds-combobox
    component-id="combobox-disabled-options"
    label=${args.label}
    placeholder=${args.placeholder}
    helper-message=${args.helperMessage}
    trigger="button"
    mode="select-only"
    group-display=${args.groupDisplay}
    trigger-width="280px"
    dropdown-width="280px"
    .options=${args.options}
  ></pds-combobox>
</div>`;

DisabledOptions.args = {
  label: 'Action',
  placeholder: 'Choose an action',
  helperMessage: 'Text messages and coaching actions need the Pro plan.',
  groupDisplay: 'flyout',
  options: [
    { id: 'contact_tag_add', text: 'Add a tag', group: 'Contact', groupIcon: 'contact' },
    { id: 'contact_tag_remove', text: 'Remove a tag', group: 'Contact' },
    { id: 'email_send', text: 'Send an email', group: 'Communication', groupIcon: 'mail' },
    { id: 'sms_send', text: 'Send a text message', group: 'Communication', disabled: true },
    { id: 'coaching_invoice_reminder', text: 'Send an invoice reminder', group: 'Coaching', groupIcon: 'one-off-session', disabled: true },
    { id: 'coaching_sessions_cancel', text: 'Cancel sessions', group: 'Coaching', disabled: true },
  ],
};

DisabledOptions.argTypes = {
  groupDisplay: { control: 'inline-radio', options: ['inline', 'flyout', 'drill-in'] },
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

export const InScrollableModal = (args) => html`
  <div>
    <pds-button onClick="document.querySelector('#${args.modalId}').open = true">
      Open modal
    </pds-button>
    <pds-modal
      id="${args.modalId}"
      component-id="${args.modalId}"
      size="md"
      scrollable="true"
    >
      <pds-modal-header>
        <pds-box direction="column" fit padding="md">
          <pds-text tag="h2" size="h3">Offer selector</pds-text>
        </pds-box>
      </pds-modal-header>
      <pds-modal-content>
        <pds-box fit direction="column" gap="md" padding-inline-start="md" padding-inline-end="md">
          <p>Scroll this content and open the combobox. With <code>dropdown-mount="body"</code>, the list is not clipped by the modal.</p>
          ${Array.from({ length: 8 }, (_, i) => html`<p>Scrollable filler paragraph ${i + 1}.</p>`)}
          <pds-combobox
            component-id=${args.componentId}
            dropdown-mount="body"
            label=${args.label}
            placeholder=${args.placeholder}
            mode=${args.mode}
            trigger-width="100%"
            dropdown-width="100%"
            max-height="200px"
          >
            <option value="react">React</option>
            <option value="vue">Vue.js</option>
            <option value="svelte">Svelte</option>
            <option value="angular">Angular</option>
          </pds-combobox>
          ${Array.from({ length: 8 }, (_, i) => html`<p>More filler paragraph ${i + 9}.</p>`)}
        </pds-box>
      </pds-modal-content>
      <pds-modal-footer>
        <pds-box fit padding="md" justify-content="end" gap="sm">
          <pds-button variant="secondary" onClick="document.querySelector('#${args.modalId}').open = false">Cancel</pds-button>
          <pds-button variant="primary" onClick="document.querySelector('#${args.modalId}').open = false">Save</pds-button>
        </pds-box>
      </pds-modal-footer>
    </pds-modal>
  </div>
`;

InScrollableModal.args = {
  modalId: 'combobox-modal-demo',
  componentId: 'combobox-in-modal',
  label: 'Technology',
  placeholder: 'Select a technology',
  mode: 'filter',
};