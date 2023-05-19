import { html } from 'lit-html';

const BaseTemplate = (args) => html`<pds-avatar></pds-avatar>`;

const defaultParameters = { docs: { disable: true } };

export const Default = BaseTemplate.bind();
Default.parameters = { ...defaultParameters };
