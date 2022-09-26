import { h } from '@stencil/core';
import { SageLink } from '@sage/core/sage-link';

export default {
  title: 'webcomponents/Link',
  component: SageLink,
};

const Template = args => <sage-link href={args.href} text={args.text}></sage-link>;

export const Plain = Template.bind({});
Plain.args = { text: 'Sage Link' };
