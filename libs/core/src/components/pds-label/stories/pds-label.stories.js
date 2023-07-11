import { html } from 'lit-html';

const BaseTemplate = (args) => html`<pds-label
	for="${args.for}"
>
Label
</pds-label>`;

const defaultParameters = { docs: { disable: true } };

export const Default = BaseTemplate.bind();

Default.parameters = { ...defaultParameters };
