import { html } from 'lit';
import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';

export default {
  argTypes: extractArgTypes('pds-link'),
  args: { href: '#some-anchor' },
  argTypes: {
    variant: {
      control: 'radio',
      options: ['inline', 'plain'],
    },
  },
  component: 'pds-link',
  title: 'components/Link'
}

const BaseTemplate = (args) => html`<pds-link color=${args.color} external=${args.external} font-size=${args.fontSize} href=${args.href} component-id=${args.componentId} variant=${args.variant}></pds-link>`;
const BaseTemplateWithSlot = (args) => html` <pds-link color=${args.color} external=${args.external} font-size=${args.fontSize} href=${args.href} component-id=${args.componentId} variant=${args.variant}>${args.slot}</pds-link>`;

export const Colors = BaseTemplate.bind();
Colors.args = {
  color: 'danger',
  external: false,
  fontSize: 'lg',
};

export const External = BaseTemplate.bind();
External.args = {
  external: true,
  fontSize: 'lg',
  variant: 'inline'
};

export const Inline = BaseTemplate.bind();
Inline.args = {
  external: false,
  fontSize: 'lg',
  href: 'https://www.google.com',
  variant: 'inline'
};

export const Plain = BaseTemplate.bind();
Plain.args = {
  external: false,
  fontSize: 'lg',
  variant: 'plain'
};

export const WithCustomText = BaseTemplateWithSlot.bind();
WithCustomText.args = {
  external: false,
  fontSize: 'lg',
  slot: 'Overrides default use of href',
  variant: 'inline'
};

export const WithoutCustomTextInSlot = BaseTemplateWithSlot.bind();
WithoutCustomTextInSlot.args = {
  external: false,
  fontSize: 'lg',
  variant: 'inline'
};
