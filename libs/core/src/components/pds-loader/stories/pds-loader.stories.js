import { html } from 'lit';
import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';

export default {
  argTypes: extractArgTypes('pds-loader'),
  component: 'pds-loader',
  title: 'components/Loader',
  args: {
    isLoading: true,
  }
}

const BaseTemplate = (args) => html`
  <pds-loader
    is-loading="${args.isLoading}"
    show-label="${args.showLabel}"
    size="${args.size}"
    variant="${args.variant}"
  >
    ${args.slot}
  </pds-loader>
`;

export const Default = BaseTemplate.bind();
Default.args = {
  size: '100px',
  showLabel: true,
  slot: 'Now loading...',
  variant: 'spinner'
};

export const Typing = BaseTemplate.bind();
Typing.args = {
  variant: 'typing'
};