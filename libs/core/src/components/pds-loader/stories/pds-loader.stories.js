// import { html } from 'lit-html';
import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';

export default {
  argTypes: extractArgTypes('pds-loader'),
  component: 'pds-loader',
  title: 'components/Loader',
};