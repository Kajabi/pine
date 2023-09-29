import { html } from 'lit-html';
import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';
import { withActions } from '@storybook/addon-actions/decorator';

export default {
  argTypes: extractArgTypes('pds-table'),
  component: 'pds-table',
  // decorators: [withActions],
  // parameters: {
  //   actions: {
  //     handles: ['onchange', ''],
  //   },
  // },
  title: 'components/Table',
};

const BaseTemplate = (args) => html`
<pds-table></pds-table>`;


export const Default = BaseTemplate.bind();
Default.args = {
  componentId: 'default',
};
