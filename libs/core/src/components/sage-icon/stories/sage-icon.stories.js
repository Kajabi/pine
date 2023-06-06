import { html } from 'lit-html';

const BaseTemplate = (args) => html`<sage-icon color=${args.color} name=${args.name} size=${args.size}></sage-icon>`;
const defaultParameters = { docs: { disable: true } };

export const Default = BaseTemplate.bind();
Default.args = {
  name: 'upload'
};
Default.parameters = { ...defaultParameters };
