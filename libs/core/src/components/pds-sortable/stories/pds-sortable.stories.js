import { html } from 'lit-html';

const BaseTemplate = (args) => html` <pds-sortable border="${args.border}" component-id="${args.componentId}"></pds-sortable>`;

const defaultParameters = { docs: { disable: true } };

export const Default = BaseTemplate.bind();
Default.args = {
  componentId: 'default',
  border: false,
};
Default.parameters = { ...defaultParameters };


export const Bordered = BaseTemplate.bind();
Bordered.args = {
  componentId: 'bordered',
  border: true,
};
Bordered.parameters = { ...defaultParameters };


export const Handle = BaseTemplate.bind();
Handle.args = {
  componentId: 'handle',
  border: false,
};
Handle.parameters = { ...defaultParameters };


export const Actions = BaseTemplate.bind();
Actions.args = {
  componentId: 'actions',
  border: false,
};
Actions.parameters = { ...defaultParameters };

export const FullDemo = BaseTemplate.bind();
FullDemo.args = {
  componentId: 'demo',
  border: false,
};
FullDemo.parameters = { ...defaultParameters };


