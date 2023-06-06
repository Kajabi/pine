import { html } from 'lit-html';

const BaseTemplate = (args) => html`<pds-link external=${args.external} font-size=${args.fontSize} href=${args.href} variant=${args.variant}></pds-link>`;
const BaseTemplateWithSlot = (args) => html` <pds-link external=${args.external} font-size=${args.fontSize} href=${args.href} variant=${args.variant}>${args.slot}</pds-link>`;
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
