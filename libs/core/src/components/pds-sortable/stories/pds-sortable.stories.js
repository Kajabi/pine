import { html } from 'lit-html';
import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';

export default {
  argTypes: extractArgTypes('pds-sortable'),
  component: 'pds-sortable',
  title: 'components/Sortable'
}

const BaseTemplate = (args) => html`
<pds-sortable
  border="${args.border}"
  component-id="${args.componentId}
  dividers="${args.dividers}"
  handle-type="${args.handleType}"
>
</pds-sortable>`;

const sortableEventExample = () => {
  document.addEventListener('pdsSortableItemMoved', function (e) {
    console.info('Item Moved:', e.detail);
  });
};

export const Default = BaseTemplate.bind();
Default.args = {
  componentId: 'default',
  border: false,
  dividers: false,
  handleType: 'row',
  onChange: sortableEventExample(),
};

export const Bordered = BaseTemplate.bind();
Bordered.args = {
  componentId: 'bordered',
  border: true,
  dividers: false,
  handleType: 'row',
};

export const Dividers = BaseTemplate.bind();
Dividers.args = {
  componentId: 'dividers',
  border: true,
  dividers: true,
  handleType: 'row',
};

export const Handle = BaseTemplate.bind();
Handle.args = {
  componentId: 'handle',
  border: false,
  dividers: false,
  handleType: 'handle',
};

export const Actions = BaseTemplate.bind();
Actions.args = {
  componentId: 'actions',
  border: false,
  dividers: false,
  handleType: 'row',
};

export const FullDemo = BaseTemplate.bind();
FullDemo.args = {
  componentId: 'demo',
  border: false,
  dividers: false,
  handleType: 'row',
};
