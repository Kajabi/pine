import { html } from 'lit';
import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';
import { withActions } from '@storybook/addon-actions/decorator';

export default {
  argTypes: extractArgTypes('pds-combobox'),
  args: {
    disabled: false,
    dropdownPlacement: 'bottom-start',
    dropdownWidth: 'trigger',
    hideLabel: false,
    maxHeight: null,
    mode: 'filter',
    trigger: 'input',
    triggerVariant: 'secondary',
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
  placeholder: 'Type to search...',
  trigger: 'input',
  triggerVariant: 'secondary',
  mode: 'filter',
};

export const HiddenLabel = BaseTemplate.bind();
HiddenLabel.args = {
  componentId: 'combobox-hidden-label-story',
  hideLabel: true,
  label: 'Favorite Animal',
  placeholder: 'Select an animal',
  trigger: 'button',
  triggerVariant: 'secondary',
  mode: 'select-only',
};