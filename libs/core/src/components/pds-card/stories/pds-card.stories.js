import { html } from 'lit-html';

const BaseTemplate = (args) => html` <pds-card border=${args.border} padding=${args.padding} bg-color=${args.bgColor} shadow=${args.shadow}></pds-card>`;

const defaultParameters = { docs: { disable: true } };

export const Default = BaseTemplate.bind();
Default.args = {};
Default.parameters = { ...defaultParameters };

export const Border = BaseTemplate.bind();
Border.args = {
  border: false,
};
Border.parameters = { ...defaultParameters };

export const Padding = BaseTemplate.bind();
Padding.args = {
  padding: 'sm',
};
Padding.parameters = { ...defaultParameters };

export const background = BaseTemplate.bind();
background.args = {
  bgColor: 'var(--pine-color-primary-100)',
  border: false,
};
background.parameters = { ...defaultParameters };

export const shadow = BaseTemplate.bind();
shadow.args = {
  shadow: 'md',
};
shadow.parameters = { ...defaultParameters };
