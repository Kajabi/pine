import { html } from 'lit-html';

const BaseTemplate = (args) => html` <pds-sortable border="${args.border}" component-id="${args.componentId}item-divided="${args.dividers}"></pds-sortable>`;

const defaultParameters = { docs: { disable: true } };

export const Default = BaseTemplate.bind();
Default.args = {
  componentId: 'default',
  border: false,
  dividers: false,
};
Default.parameters = { ...defaultParameters };


export const Bordered = BaseTemplate.bind();
Bordered.args = {
  componentId: 'bordered',
  border: true,
  dividers: false,
};
Bordered.parameters = { ...defaultParameters };

export const Dividers = BaseTemplate.bind();
Dividers.args = {
  componentId: 'dividers',
  border: true,
  dividers: true,
};
Dividers.parameters = { ...defaultParameters };


export const Handle = BaseTemplate.bind();
Handle.args = {
  componentId: 'handle',
  border: false,
  dividers: false,
};
Handle.parameters = { ...defaultParameters };


export const Actions = BaseTemplate.bind();
Actions.args = {
  componentId: 'actions',
  border: false,
  dividers: false,
};
Actions.parameters = { ...defaultParameters };

export const FullDemo = BaseTemplate.bind();
FullDemo.args = {
  componentId: 'demo',
  border: false,
  dividers: false,
};
FullDemo.parameters = { ...defaultParameters };


