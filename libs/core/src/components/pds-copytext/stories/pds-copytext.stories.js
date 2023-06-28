import { html } from 'lit-html';

const BaseTemplate = (args) => html` <pds-copytext border="${args.border}" full-width="${args.fullWidth}" value="${args.value}"></pds-copytext>`;

const defaultParameters = { docs: { disable: true } };

export const Default = BaseTemplate.bind();
Default.args = {
  border: true,
  fullWidth: false,
  value: 'Default copy text',
};
Default.parameters = { ...defaultParameters };

export const Borderless = BaseTemplate.bind();
Borderless.args = {
  border: false,
  fullWidth: false,
  value: 'Borderless copy text',
};
Borderless.parameters = { ...defaultParameters };

export const FullWidth = BaseTemplate.bind();
FullWidth.args = {
  border: true,
  fullWidth: true,
  value: 'Full width copy text',
};
FullWidth.parameters = { ...defaultParameters };
