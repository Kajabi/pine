import { html, render } from 'lit-html';

import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';

import mdx from './sage-link.mdx';

export default {
  title: 'Components/Link',
  parameters: {
    docs: {
      page: mdx,
    },
  },
  component: 'sage-link',
  argTypes: extractArgTypes('sage-link')
};

const BaseTemplate = (args) => html`<sage-link external=${args.external} font-size=${args.fontSize} href=${args.href} variant=${args.variant}></sage-link>`;
const BaseTemplateWithSlot = (args) => html` <sage-link external=${args.external} font-size=${args.fontSize} href=${args.href} variant=${args.variant}>${args.slot}</sage-link>`;
const defaultParameters = { docs: { disable: true } };

export const External = BaseTemplate.bind();
External.args = {
  external: true
};
External.parameters = { ...defaultParameters };

export const Inline = BaseTemplate.bind();
Inline.args = {
  href: 'https://www.google.com'
};
Inline.parameters = { ...defaultParameters };

export const Plain = BaseTemplate.bind();
Plain.args = {
  variant: 'plain'
};
Plain.parameters = { ...defaultParameters };

export const WithCustomText = BaseTemplateWithSlot.bind();
WithCustomText.args = {
  slot: 'Overrides default use of href'
};
WithCustomText.parameters = { ...defaultParameters };

export const WithoutCustomTextInSlot = BaseTemplateWithSlot.bind();
WithoutCustomTextInSlot.parameters = { ...defaultParameters };
