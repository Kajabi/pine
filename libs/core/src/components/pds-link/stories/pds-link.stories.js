import { html } from 'lit';
import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';

export default {
  argTypes: extractArgTypes('pds-link'),
  args: { href: '#some-anchor' },
  component: 'pds-link',
  title: 'components/Link'
}

const BaseTemplate = (args) => html`<pds-link external=${args.external} font-size=${args.fontSize} href=${args.href} variant=${args.variant}></pds-link>`;
const BaseTemplateWithSlot = (args) => html` <pds-link external=${args.external} font-size=${args.fontSize} href=${args.href} variant=${args.variant}>${args.slot}</pds-link>`;

export const External = BaseTemplate.bind();
External.args = {
  external: true
};

export const Inline = BaseTemplate.bind();
Inline.args = {
  href: 'https://www.google.com'
};

export const Plain = BaseTemplate.bind();
Plain.args = {
  variant: 'plain'
};

export const WithCustomText = BaseTemplateWithSlot.bind();
WithCustomText.args = {
  slot: 'Overrides default use of href'
};

export const WithoutCustomTextInSlot = BaseTemplateWithSlot.bind();
