import { h } from '@stencil/core';
import { SageLink } from '@sage/core/sage-link';

export default {
  title: 'webcomponents/Link',
  component: SageLink,
  argTypes: {
    fontSize: {
      description: 'Size variant',
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
  args: {
    href: '#some-anchor',
  },
};

const Template = args => <sage-link {...args}></sage-link>;
const TemplateWithSlot = args => <sage-link {...args}>{args.slot}</sage-link>;

export const External = Template.bind({});
External.args = {
  external: true,
};

export const Inline = Template.bind({});
Inline.args = {
  href: 'https://www.google.com',
};

export const Plain = Template.bind({});
Plain.args = {
  variant: 'plain',
};

export const WithCustomText = TemplateWithSlot.bind({});
WithCustomText.args = {
  slot: 'Overrides default use of href',
};

export const WithNoSlot = TemplateWithSlot.bind({});
