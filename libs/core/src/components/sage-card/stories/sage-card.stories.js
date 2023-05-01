import { html } from 'lit-html';

const BaseTemplate = (args) => html` <sage-card compact=${args.compact}></sage-card>`;

const defaultParameters = { docs: { disable: true } };

export const Default = BaseTemplate.bind();
Default.args = {
  compact: false,
};
Default.parameters = { ...defaultParameters };

export const Compact = BaseTemplate.bind();
Compact.args = {
  compact: true,
};
Compact.parameters = { ...defaultParameters };
