import { html } from 'lit-html';

const BaseTemplate = (args) => html`
<pds-label
/>`;

const defaultParameters = { docs: { disable: true } };

export const Default = BaseTemplate.bind();
Default.args = {
}
Default.parameters = { ...defaultParameters };
