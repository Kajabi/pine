import { html } from 'lit-html';

const BaseTemplate = (args) => html` <pds-divider vertical=${args.vertical} offset=${args.offset} />`;

const defaultParameters = { docs: { disable: true } };

export const Default = BaseTemplate.bind();
Default.args = {
  vertical: false,
}
Default.parameters = { ...defaultParameters };


export const Vertical = BaseTemplate.bind();
Vertical.args = {
  vertical: true,
}
Vertical.parameters = { ...defaultParameters };

