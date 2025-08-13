import { html } from 'lit-html';
import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';
import { withActions } from '@storybook/addon-actions/decorator';

export default {
  argTypes: extractArgTypes('pds-copytext'),
  component: 'pds-copytext',
  decorators: [withActions],
  parameters: {
    actions: {
      handles: ['onclick', 'pdsCopied'],
    },
  },
  title: 'components/Copytext',
}

const BaseTemplate = (args) => html`
  <pds-copytext
    .border=${args.border}
    .full-width=${args.fullWidth}
    component-id=${args.componentId}
    onClick=${args.onClick}
    .truncate=${args.truncate}
    value="${args.value}">
  </pds-copytext>`;

export const Default = BaseTemplate.bind();
Default.args = {
  border: true,
  fullWidth: false,
  truncate: false,
  value: 'Default copy text',
};

export const Borderless = BaseTemplate.bind();
Borderless.args = {
  border: false,
  fullWidth: false,
  truncate: false,
  value: 'Borderless copy text',
};

export const FullWidth = BaseTemplate.bind();
FullWidth.args = {
  border: true,
  fullWidth: true,
  truncate: false,
  value: 'Full width copy text',
};

export const Truncate = BaseTemplate.bind();
Truncate.args = {
  border: true,
  fullWidth: false,
  truncate: true,
  value: 'This is a very long text that will be truncated when the truncate property is set to true. You can hover over the text to see the full content.',
};

