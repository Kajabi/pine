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
};

const Template = args => <sage-link {...args}></sage-link>;

export const Plain = Template.bind({});
Plain.args = {
  href: 'https://www.google.com',
};

export const External = Template.bind({});
External.args = {
  ...Plain.args,
  external: true,
};

const TemplateWithSlot = args => <sage-link {...args}>{args.slot}</sage-link>;

export const WithCustomText = TemplateWithSlot.bind({});
WithCustomText.args = {
  ...Plain.args,
  slot: 'Overrides default use of href',
};

export const WithNoSlot = TemplateWithSlot.bind({});
WithNoSlot.args = {
  ...Plain.args,
};
