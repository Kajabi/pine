import { html } from 'lit';
import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';

export default {
  argTypes: extractArgTypes('pds-loader'),
  component: 'pds-loader',
  title: 'components/Loader'
}

const BaseTemplate = (args) => html`<pds-loader variant="${args.variant}></pds-loader>`;

export const Default = BaseTemplate.bind();
Default.args = {
  variant: 'spinner'
};

export const Typing = BaseTemplate.bind();
Typing.args = {
  variant: 'typing'
};