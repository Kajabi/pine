import { h } from '@stencil/core';
import { SageLink } from '@sage/core/sage-link';

export default {
  title: 'webcomponents/Link',
  component: SageLink,
};

const Template = args => <sage-link {...args}></sage-link>;

export const Plain = Template.bind({});
Plain.args = {
  href: 'https://www.google.com',
  text: 'Sage Link',
};

export const ExtenalLink = Template.bind({});
ExtenalLink.args = {
  ...Plain.args,
  external: true,
};
