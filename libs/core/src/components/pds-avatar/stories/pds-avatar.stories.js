import { html } from 'lit-html';

const BaseTemplate = (args) => html`<pds-avatar size="${args.size}"></pds-avatar>`;

const AdminVariantTemplate = (args) => html`<pds-avatar size="${args.size}" variant="${args.variant}"></pds-avatar>`;

const defaultParameters = { docs: { disable: true } };

export const Default = BaseTemplate.bind();
Default.args = {
	size: 'sm'
}
Default.parameters = { ...defaultParameters };

export const AdminVariant = AdminVariantTemplate.bind();
AdminVariant.args = {
	size: 'lg',
	variant: 'admin',
}
