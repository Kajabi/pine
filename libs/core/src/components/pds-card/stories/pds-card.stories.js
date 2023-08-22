import { html } from 'lit-html';
import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';

export default {
  args: { padding: 'md' },
  argTypes: extractArgTypes('pds-card'),
  component: 'pds-card',
  title: 'components/Card',
};

const BaseTemplate = (args) => html`
  <pds-card
    border=${args.border}
    bg-color=${args.bgColor}
    padding=${args.padding}
    shadow=${args.shadow}
  >
  </pds-card>`;

export const Default = BaseTemplate.bind();
Default.args = {};

export const Padding = BaseTemplate.bind();
Padding.args = {
  padding: 'sm',
};

export const Border = BaseTemplate.bind();
Border.args = {
  border: false,
};

export const Background = BaseTemplate.bind();
Background.args = {
  bgColor: 'var(--pine-color-primary-100)',
  border: false,
};

export const Shadow = BaseTemplate.bind();
Shadow.args = {
  shadow: 'md',
};
