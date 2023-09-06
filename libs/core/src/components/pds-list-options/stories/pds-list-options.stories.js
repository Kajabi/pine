import { html } from 'lit';
import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';
import { withActions } from '@storybook/addon-actions/decorator';

export default {
  argTypes: extractArgTypes('pds-list-options'),
  component: 'pds-list-options',
  decorators: [withActions],
  parameters: {
    actions: {
      handles: [],
    },
  },
  title: 'components/ListOptions'
}

const BaseTemplate = (args) => html`
<pds-list-options>
  <pds-list-option>Item 1</pds-list-option>
  <pds-list-option>Item 2</pds-list-option>
  <pds-list-option>Item 3</pds-list-option>
</pds-list-options>`;

export const Default = BaseTemplate.bind({});
Default.args = {
  htmlContent: true,
  placement: "bottom-start",
};
