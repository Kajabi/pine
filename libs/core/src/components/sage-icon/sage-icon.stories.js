import { html, render } from 'lit-html';

import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';

import mdx from './sage-icon.mdx';

export default {
  title: 'Components/Icon',
  parameters: {
    docs: {
      page: mdx,
    },
  },
  component: 'sage-icon',
  argTypes: extractArgTypes('sage-icon')
};

const BaseTemplate = (args) => html`<sage-icon name=${args.name} size=${args.size}></sage-icon>`;
const defaultParameters = { docs: { disable: true } };

export const Default = BaseTemplate.bind();
Default.args = {
  name: 'upload'
};
Default.parameters = { ...defaultParameters };
