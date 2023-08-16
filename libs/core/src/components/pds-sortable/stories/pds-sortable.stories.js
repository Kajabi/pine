import { html } from 'lit-html';

const BaseTemplate = (args) => html` <pds-sortable component-id="${args.componentId}"></pds-sortable>`;

const defaultParameters = { docs: { disable: true } };

export const Default = BaseTemplate.bind();
Default.args = {
  componentId: 'default',
};
Default.parameters = { ...defaultParameters };
