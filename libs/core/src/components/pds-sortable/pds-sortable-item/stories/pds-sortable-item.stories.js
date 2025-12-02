import { html } from 'lit-html';

export default {
  component: 'pds-sortable-item',
  title: 'components/Sortable/Sortable Item',
};

const BaseTemplate = (args) => html`
<pds-sortable-item
  action="${args.enableActions}"
  component-id="${args.componentId}"
  show-handle="${args.showHandle}"
>
  Item
</pds-sortable-item>`;

export const Default = BaseTemplate.bind();
Default.args = {
  componentId: 'default',
  enableActions: false,
  showHandle: false,
};
