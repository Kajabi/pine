import { html } from 'lit-html';

export default {
  argTypes: {
    cellAlign: {
      control: {
        type: 'select',
      },
      options: ['start', 'center', 'end', 'justify'],
    },
  },
  component: 'pds-table-cell',
  title: 'components/Table/Cells',
};

const BaseTemplate = (args) => html`
<pds-table>
  <pds-table-head>
    <pds-table-head-cell>Name</pds-table-head-cell>
    <pds-table-head-cell>Amount</pds-table-head-cell>
    <pds-table-head-cell>Description</pds-table-head-cell>
  </pds-table-head>
  <pds-table-body>
    <pds-table-row>
      <pds-table-cell truncate=${args.truncate} cell-align=${args.cellAlign}>John Doe</pds-table-cell>
      <pds-table-cell truncate=${args.truncate} cell-align=${args.cellAlign}>$1,234.56</pds-table-cell>
      <pds-table-cell truncate=${args.truncate} cell-align=${args.cellAlign}>This is a longer description that demonstrates text alignment in table cells.</pds-table-cell>
    </pds-table-row>
    <pds-table-row>
      <pds-table-cell truncate=${args.truncate} cell-align=${args.cellAlign}>Jane Smith</pds-table-cell>
      <pds-table-cell truncate=${args.truncate} cell-align=${args.cellAlign}>$987.65</pds-table-cell>
      <pds-table-cell truncate=${args.truncate} cell-align=${args.cellAlign}>Another example of text alignment behavior with different content lengths.</pds-table-cell>
    </pds-table-row>
  </pds-table-body>
</pds-table>`;

export const Default = BaseTemplate.bind();
Default.args = {
  truncate: false,
  cellAlign: 'start',
};
