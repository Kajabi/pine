import { html } from 'lit-html';

const BaseTemplate = (args) =>
  html` <pds-sortable border="${args.border}" component-id="${args.componentId} dividers="${args.dividers}" handle-type="${args.handleType}"></pds-sortable>`;

const defaultParameters = { docs: { disable: true } };

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
Default.parameters = { ...defaultParameters };

export const Bordered = BaseTemplate.bind();
Bordered.args = {
  componentId: 'bordered',
  border: true,
  dividers: false,
  handleType: 'row',
};
Bordered.parameters = { ...defaultParameters };

export const Dividers = BaseTemplate.bind();
Dividers.args = {
  componentId: 'dividers',
  border: true,
  dividers: true,
  handleType: 'row',
};
Dividers.parameters = { ...defaultParameters };

export const Handle = BaseTemplate.bind();
Handle.args = {
  componentId: 'handle',
  border: false,
  dividers: false,
  handleType: 'handle',
};
Handle.parameters = { ...defaultParameters };

export const Actions = BaseTemplate.bind();
Actions.args = {
  componentId: 'actions',
  border: false,
  dividers: false,
  handleType: 'row',
};
Actions.parameters = { ...defaultParameters };

export const FullDemo = BaseTemplate.bind();
FullDemo.args = {
  componentId: 'demo',
  border: false,
  dividers: false,
  handleType: 'row',
};
FullDemo.parameters = { ...defaultParameters };
