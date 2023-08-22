import { html } from 'lit';
import imgFile from '../assets/demi_wilkinson.jpg';

import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';

export default {
  args: {
    alt: null,
    badge: false,
    dropdown: false,
    image: null,
    size: null,
    variant: 'customer',
  },
  argTypes: extractArgTypes('pds-avatar'),
  component: 'pds-avatar',
  title: 'components/Avatar',
}

const BaseTemplate = (args) => html`<pds-avatar
	alt="${args.alt}"
	badge="${args.badge}"
	dropdown="${args.dropdown}"
	image="${args.image}"
	size="${args.size}"
	variant="${args.variant}"
>
</pds-avatar>`;

export const Default = BaseTemplate.bind();
Default.args = {
	size: 'sm'
}

export const Admin = BaseTemplate.bind();
Admin.args = {
	size: 'lg',
	variant: 'admin',
}

export const Badge = BaseTemplate.bind();
Badge.args = {
	badge: true,
	size: 'md'
}

export const CustomSize = BaseTemplate.bind();
CustomSize.args = {
	size: '128px'
}

export const DropdownTrigger = BaseTemplate.bind();
DropdownTrigger.args = {
	dropdown: true,
	size: 'lg'
}

export const Image = BaseTemplate.bind();
Image.args = {
	alt: 'Customer Profile',
	image: imgFile,
	size: 'xl'
}
