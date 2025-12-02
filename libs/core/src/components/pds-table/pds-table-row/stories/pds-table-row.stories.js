import { html } from 'lit-html';


export default {

  component: 'pds-table-row',
  parameters: {
    actions: {
      handles: ['onclick', 'pdsTableRowSelected'],
    },
  },
  title: 'components/Table/Rows',
};

const BaseTemplate = () => html`
<pds-table>
  <pds-table-row>
    <pds-table-cell>Row Item Alpha</pds-table-cell>
    <pds-table-cell>Row Item Beta</pds-table-cell>
    <pds-table-cell>Row Item Charlie</pds-table-cell>
  </pds-table-row>
</pds-table>`;

export const Default = BaseTemplate.bind();
