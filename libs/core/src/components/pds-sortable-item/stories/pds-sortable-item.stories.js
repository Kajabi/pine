import { html } from 'lit-html';
import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';

export default {
  argTypes: extractArgTypes('pds-sortable-item'),
  component: 'pds-sortable-item',
  title: 'components/Sortable/Sortable Item',
};

const BaseTemplate = (args) => html`
<pds-sortable-item
  action="${args.actions}"
  component-id="${args.componentId}"
  handle="${args.handle}"
>
  Item
</pds-sortable-item>`;

export const Default = BaseTemplate.bind();
Default.args = {
  componentId: 'default',
  actions: false,
  handle: false,
};
