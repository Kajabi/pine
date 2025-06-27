import { html } from 'lit';
import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';
import { withActions } from '@storybook/addon-actions/decorator';

export default {
  argTypes: extractArgTypes('pds-combobox'),
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
  label=${args.label}
  placeholder=${args.placeholder}
  trigger=${args.trigger}
  trigger-variant=${args.triggerVariant}
  mode=${args.mode}
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