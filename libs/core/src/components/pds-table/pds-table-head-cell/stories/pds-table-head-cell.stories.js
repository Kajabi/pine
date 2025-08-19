import { html } from 'lit-html';
import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';
import { withActions } from '@storybook/addon-actions/decorator';

export default {
  argTypes: {
    ...extractArgTypes('pds-table-head-cell'),
    cellAlign: {
      control: {
        type: 'select',
      },
      options: ['start', 'center', 'end', 'justify'],
    },
  },
  component: 'pds-table-head-cell',
  decorators: [withActions],
  title: 'components/Table/Head',
};

const BaseTemplate = (args) => html`
<pds-table>
  <pds-table-head>
    <pds-table-head-cell sortable=${args.sortable} cell-align=${args.cellAlign}>Column Heading Alpha</pds-table-head-cell>
    <pds-table-head-cell sortable=${args.sortable} cell-align=${args.cellAlign}>Column Heading Beta</pds-table-head-cell>
    <pds-table-head-cell sortable=${args.sortable} cell-align=${args.cellAlign}>Column Heading Charlie</pds-table-head-cell>
  </pds-table-head>
</pds-table>`;

export const Default = BaseTemplate.bind();
Default.args = {
  sortable: false,
  cellAlign: 'start',
};
