import { html } from 'lit-html';
import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';
import { withActions } from '@storybook/addon-actions/decorator';

export default {
  argTypes: extractArgTypes('pds-table-cell'),
  component: 'pds-table-cell',
  decorators: [withActions],
  title: 'components/Table/Table Cell',
};

const BaseTemplate = (args) => html`
<pds-table>
  <pds-table-row>
    <pds-table-cell truncated=${args.truncate}>Row Item Alpha</pds-table-cell>
    <pds-table-cell truncated=${args.truncate}>Row Item Beta</pds-table-cell>
    <pds-table-cell truncated=${args.truncate}>Row Item Charlie</pds-table-cell>
  </pds-table-row>
</pds-table>`;

export const Default = BaseTemplate.bind();
Default.args = {
  truncate: false,
};
