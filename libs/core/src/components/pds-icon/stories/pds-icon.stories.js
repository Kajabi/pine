import { html } from 'lit-html';

const BaseTemplate = (args) => html`<pds-icon color=${args.color} name=${args.name} size=${args.size}></pds-icon>`;
const defaultParameters = { docs: { disable: true } };

export const Default = BaseTemplate.bind();
Default.args = {
  name: 'upload'
};
Default.parameters = { ...defaultParameters };
