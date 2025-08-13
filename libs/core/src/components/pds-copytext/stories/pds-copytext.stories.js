import { html } from 'lit';
import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';
import { withActions } from '@storybook/addon-actions/decorator';

export default {
  argTypes: extractArgTypes('pds-copytext'),
  component: 'pds-copytext',
  decorators: [withActions],
  parameters: {
    actions: {
      handles: ['onclick', 'pdsCopyTextClick'],
    },
  },
  title: 'components/Copy Text',
}

const BaseTemplate = (args) => html`
  <pds-copytext
    ?border=${args.border}
    ?full-width=${args.fullWidth}
    component-id=${args.componentId}
    onClick=${args.onClick}
    ?truncate=${args.truncate}
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
  value: 'Copy all of this really long text that should be truncated in the UI, but will still be copied to the clipboard. This can be used in cases where the text is too long to fit in the UI, but the user still needs to copy the full text.',
};
