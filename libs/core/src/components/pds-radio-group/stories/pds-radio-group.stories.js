import { html } from 'lit';

export default {
  args: {
    direction: 'column',
    disabled: false,
    invalid: false,
    required: false,
  },
  component: 'pds-radio-group',
  parameters: {},
  title: 'components/Radio Group',
}

const BaseTemplate = (args) =>
  html` <pds-radio-group
    component-id=${args.componentId}
    direction=${args.direction}
    ?disabled=${args.disabled}
    error-message=${args.errorMessage}
    gap=${args.gap}
    helper-message=${args.helperMessage}
    ?invalid=${args.invalid}
    group-label=${args.groupLabel}
    name=${args.name}
    ?required=${args.required}
  >
    <pds-radio component-id="radio1" label="Option 1" value="1"></pds-radio>
    <pds-radio component-id="radio2" label="Option 2" value="2"></pds-radio>
    <pds-radio component-id="radio3" label="Option 3" value="3"></pds-radio>
  </pds-radio-group>`;

export const Default = BaseTemplate.bind();
Default.args = {
  componentId: 'default-group',
  name: 'default-group',
};

export const Disabled = BaseTemplate.bind();
Disabled.args = {
  componentId: 'disabled-group',
  disabled: true,
  groupLabel: 'Comments',
  name: 'disabled-group',
};

export const withMessage = BaseTemplate.bind();
withMessage.args = {
  componentId: 'helper-group',
  helperMessage: 'Select one option from the list',
  groupLabel: 'Comments',
  name: 'helper-group',
};

export const Invalid = BaseTemplate.bind();
Invalid.args = {
  componentId: 'error-group',
  errorMessage: 'Please select an option',
  invalid: true,
  groupLabel: 'Comments',
  name: 'error-group',
};

const BorderTemplate = (args) =>
  html` <pds-radio-group
    component-id=${args.componentId}
    direction=${args.direction}
    ?disabled=${args.disabled}
    error-message=${args.errorMessage}
    gap=${args.gap}
    helper-message=${args.helperMessage}
    ?invalid=${args.invalid}
    group-label=${args.groupLabel}
    name=${args.name}
    ?required=${args.required}
  >
    <pds-radio component-id="radio1" label="Option 1" value="1" ?has-border=${true}></pds-radio>
    <pds-radio component-id="radio2" label="Option 2" value="2" ?has-border=${true}></pds-radio>
    <pds-radio component-id="radio3" label="Option 3" value="3" ?has-border=${true}></pds-radio>
  </pds-radio-group>`;

export const WithBorder = BorderTemplate.bind();
WithBorder.args = {
  componentId: 'bordered-group',
  direction: 'row',
  groupLabel: 'Comments',
  name: 'bordered-group',
};

const ImageTemplate = (args) =>
  html` <pds-radio-group
    component-id=${args.componentId}
    direction=${args.direction}
    ?disabled=${args.disabled}
    error-message=${args.errorMessage}
    gap=${args.gap}
    helper-message=${args.helperMessage}
    ?invalid=${args.invalid}
    group-label=${args.groupLabel}
    name=${args.name}
    ?required=${args.required}
  >
    <pds-radio component-id="radio1" label="John Doe" value="john" helper-message="Senior Developer">
      <pds-box slot="image" background-color="var(--pine-color-accent)" border-radius="full" padding="sm">
        <pds-icon icon="danger" size="medium" color="var(--pine-color-white)"></pds-icon>
      </pds-box>
    </pds-radio>
    <pds-radio component-id="radio2" label="Jane Smith" value="jane" helper-message="Product Manager">
      <pds-box slot="image" background-color="var(--pine-color-accent)" border-radius="full" padding="sm">
        <pds-icon icon="danger" size="medium" color="var(--pine-color-white)"></pds-icon>
      </pds-box>
    </pds-radio>
    <pds-radio component-id="radio3" label="Mike Johnson" value="mike" helper-message="UX Designer">
      <pds-box slot="image" background-color="var(--pine-color-accent)" border-radius="full" padding="sm">
        <pds-icon icon="danger" size="medium" color="var(--pine-color-white)"></pds-icon>
      </pds-box>
    </pds-radio>
  </pds-radio-group>`;

export const WithImage = ImageTemplate.bind();
WithImage.args = {
  componentId: 'image-group',
  direction: 'row',
  groupLabel: 'Select Team Member',
  name: 'image-group',
};

export const Horizontal = BorderTemplate.bind();
Horizontal.args = {
  componentId: 'horizontal-group',
  direction: 'row',
  name: 'horizontal-group',
};

