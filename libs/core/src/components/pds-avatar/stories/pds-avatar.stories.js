import { html } from 'lit-html';
import imgFile from '../assets/demi_wilkinson.jpg';

const BaseTemplate = (args) => html`<pds-avatar
	alt="${args.alt}"
	badge="${args.badge}"
	image="${args.image}"
	size="${args.size}"
	variant="${args.variant}"
>
</pds-avatar>`;

const defaultParameters = { docs: { disable: true } };

export const Default = BaseTemplate.bind();
Default.args = {
	size: 'sm'
}
Default.parameters = { ...defaultParameters };

export const Admin = BaseTemplate.bind();
Admin.args = {
	size: 'lg',
	variant: 'admin',
}
Admin.parameters = { ...defaultParameters };

export const Badge = BaseTemplate.bind();
Badge.args = {
	badge: true,
	size: 'md'
}
Badge.parameters = { ...defaultParameters };

export const CustomSize = BaseTemplate.bind();
CustomSize.args = {
	size: '128px'
}
CustomSize.parameters = { ...defaultParameters };

export const Image = BaseTemplate.bind();
Image.args = {
	alt: 'Customer Profile',
	image: imgFile,
	size: 'xl'
}
Image.parameters = { ...defaultParameters };
