import { h } from '@stencil/core';
import { SageLink } from '@sage/core/sage-link';

export default {
  title: 'webcomponents/Link',
  component: SageLink,
  argTypes: {
    size: {
      description: 'Size variant',
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
};

const Template = args => <sage-link {...args}></sage-link>;

export const Plain = Template.bind({});
Plain.args = {
  href: 'https://www.google.com',
};

export const ExtenalLink = Template.bind({});
ExtenalLink.args = {
  ...Plain.args,
  external: true,
};

const TemplateWithSlot = args => (
  <sage-link {...args}>
    <p slot="text">{args.slot}</p>
  </sage-link>
);

export const LinkWithSlot = TemplateWithSlot.bind({});
LinkWithSlot.args = {
  ...Plain.args,
  slot: 'Overrides default use of href',
};

export const LinkWithNoSlot = TemplateWithSlot.bind({});
LinkWithNoSlot.args = {
  ...Plain.args,
};

export const LinkSize = Template.bind({});
LinkSize.args = {
  ...Plain.args,
  size: 'sm',
};
