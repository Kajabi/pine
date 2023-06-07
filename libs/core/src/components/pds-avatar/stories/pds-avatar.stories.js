import { html } from 'lit-html';
import imgFile from '../assets/demi_wilkinson.jpg';

const BaseTemplate = (args) => html`<pds-avatar
	badge="${args.badge}"
	image="${args.image}"
	size="${args.size}"
	variant="${args.variant}"
>
</pds-avatar>`;

const AdminTemplate = (args) => html`<pds-avatar size="${args.size}" variant="${args.variant}"></pds-avatar>`;

const BadgeTemplate = (args) => html`<pds-avatar badge="${args.badge}" size="${args.size}"></pds-avatar>`;

const CustomSizeTemplate = (args) => html`<pds-avatar style="--size: 128px;"></pds-avatar>`;

const ImageTemplate = (args) => html`<pds-avatar image="${args.image}" size="${args.size}"></pds-avatar>`;

const defaultParameters = { docs: { disable: true } };

export const Default = BaseTemplate.bind();
Default.args = {
	size: 'sm'
}
Default.parameters = { ...defaultParameters };

export const Admin = AdminTemplate.bind();
Admin.args = {
	size: 'lg',
	variant: 'admin',
}

export const Badge = BadgeTemplate.bind();
Badge.args = {
	badge: true,
	size: 'md'
}

export const CustomSize = CustomSizeTemplate.bind();

export const Image = ImageTemplate.bind();
Image.args = {
	image: imgFile,
	size: 'xl'
}
