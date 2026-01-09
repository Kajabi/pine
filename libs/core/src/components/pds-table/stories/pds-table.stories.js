import { html } from 'lit-html';


export default {
  component: 'pds-table',
  parameters: {},
  title: 'components/Table',
  argTypes: {
    border: {
      control: { type: 'boolean' },
      description: 'Adds top and bottom borders to the table head',
      table: {
        category: 'Table Head',
      },
    },
    background: {
      control: { type: 'boolean' },
      description: 'Adds a subtle background color to the table head',
      table: {
        category: 'Table Head',
      },
    },
    rowDividers: {
      control: { type: 'boolean' },
      description: 'Adds divider borders between table rows. The last row will not have a bottom border',
    },
  },
};

const BaseTemplate = (args) => html`
<pds-table
  ?compact=${args.compact}
  component-id="${args.componentId}"
  ?fixed-column=${args.fixedColumn}
  ?responsive=${args.responsive}
  ?row-dividers=${args.rowDividers}
  ?selectable=${args.selectable}
>
  <pds-table-head
    ?border=${args.border}
    ?background=${args.background}
  >
    <pds-table-head-cell>Column Title</pds-table-head-cell>
    <pds-table-head-cell>Column Title</pds-table-head-cell>
    <pds-table-head-cell>Column Title</pds-table-head-cell>
  </pds-table-head>
  <pds-table-body>
    <pds-table-row value="row1">
      <pds-table-cell>Row Item Alpha</pds-table-cell>
      <pds-table-cell>Row Item Alpha</pds-table-cell>
      <pds-table-cell>Row Item Alpha</pds-table-cell>
    </pds-table-row>
    <pds-table-row value="row2">
      <pds-table-cell>Row Item Bravo</pds-table-cell>
      <pds-table-cell>Row Item Bravo</pds-table-cell>
      <pds-table-cell>Row Item Bravo</pds-table-cell>
    </pds-table-row>
    <pds-table-row value="row3">
      <pds-table-cell>Row Item Charlie</pds-table-cell>
      <pds-table-cell>Row Item Charlie</pds-table-cell>
      <pds-table-cell>Row Item Charlie</pds-table-cell>
    </pds-table-row>
  </pds-table-body>
</pds-table>`;

const AlignmentTemplate = (args) => html`
<pds-table
  ?compact=${args.compact}
  component-id="${args.componentId}"
  ?fixed-column=${args.fixedColumn}
  ?responsive=${args.responsive}
  ?row-dividers=${args.rowDividers}
  ?selectable=${args.selectable}
>
  <pds-table-head
    ?border=${args.border}
    ?background=${args.background}
  >
    <pds-table-head-cell cell-align="start">Name</pds-table-head-cell>
    <pds-table-head-cell cell-align="center">Amount</pds-table-head-cell>
    <pds-table-head-cell cell-align="end">Status</pds-table-head-cell>
    <pds-table-head-cell cell-align="justify">Description</pds-table-head-cell>
  </pds-table-head>
  <pds-table-body>
    <pds-table-row>
      <pds-table-cell cell-align="start">John Doe</pds-table-cell>
      <pds-table-cell cell-align="center">$1,234.56</pds-table-cell>
      <pds-table-cell cell-align="end">Active</pds-table-cell>
      <pds-table-cell cell-align="justify">This is a longer description that demonstrates justified text alignment in table cells. It shows how text wraps and aligns within the cell boundaries.</pds-table-cell>
    </pds-table-row>
    <pds-table-row>
      <pds-table-cell cell-align="start">Jane Smith</pds-table-cell>
      <pds-table-cell cell-align="center">$987.65</pds-table-cell>
      <pds-table-cell cell-align="end">Inactive</pds-table-cell>
      <pds-table-cell cell-align="justify">Another example of justified text that spans multiple lines to show the alignment behavior in table cells with varying content lengths.</pds-table-cell>
    </pds-table-row>
    <pds-table-row>
      <pds-table-cell cell-align="start">Michael Johnson</pds-table-cell>
      <pds-table-cell cell-align="center">$2,468.13</pds-table-cell>
      <pds-table-cell cell-align="end">Pending</pds-table-cell>
      <pds-table-cell cell-align="justify">Short justified text example.</pds-table-cell>
    </pds-table-row>
  </pds-table-body>
</pds-table>`;

const ResponsiveTemplate = (args) => html`
<pds-table
  ?compact=${args.compact}
  component-id="${args.componentId}"
  ?fixed-column=${args.fixedColumn}
  ?responsive=${args.responsive}
  ?row-dividers=${args.rowDividers}
  ?selectable=${args.selectable}
>
  <pds-table-head
    ?border=${args.border}
    ?background=${args.background}
  >
    <pds-table-head-cell>Column Title</pds-table-head-cell>
    <pds-table-head-cell>Column Title</pds-table-head-cell>
    <pds-table-head-cell>Column Title</pds-table-head-cell>
    <pds-table-head-cell>Column Title</pds-table-head-cell>
    <pds-table-head-cell>Column Title</pds-table-head-cell>
    <pds-table-head-cell>Column Title</pds-table-head-cell>
    <pds-table-head-cell>Column Title</pds-table-head-cell>
    <pds-table-head-cell>Column Title</pds-table-head-cell>
    <pds-table-head-cell>Column Title</pds-table-head-cell>
    <pds-table-head-cell>Column Title</pds-table-head-cell>
    <pds-table-head-cell>Column Title</pds-table-head-cell>
    <pds-table-head-cell>Column Title</pds-table-head-cell>
  </pds-table-head>
  <pds-table-body>
    <pds-table-row value="responsive1">
      <pds-table-cell>Row Item Alpha</pds-table-cell>
      <pds-table-cell>Row Item Beta</pds-table-cell>
      <pds-table-cell>Row Item Charlie</pds-table-cell>
      <pds-table-cell>Row Item Delta</pds-table-cell>
      <pds-table-cell>Row Item Echo</pds-table-cell>
      <pds-table-cell>Row Item Foxtrot</pds-table-cell>
      <pds-table-cell>Row Item Golf</pds-table-cell>
      <pds-table-cell>Row Item Hotel</pds-table-cell>
      <pds-table-cell>Row Item Juliett</pds-table-cell>
      <pds-table-cell>Row Item Kilo</pds-table-cell>
      <pds-table-cell>Row Item Lima</pds-table-cell>
      <pds-table-cell>Row Item Mike</pds-table-cell>
    </pds-table-row>
    <pds-table-row value="responsive2">
      <pds-table-cell>Row Item Alpha</pds-table-cell>
      <pds-table-cell>Row Item Beta</pds-table-cell>
      <pds-table-cell>Row Item Charlie</pds-table-cell>
      <pds-table-cell>Row Item Delta</pds-table-cell>
      <pds-table-cell>Row Item Echo</pds-table-cell>
      <pds-table-cell>Row Item Foxtrot</pds-table-cell>
      <pds-table-cell>Row Item Golf</pds-table-cell>
      <pds-table-cell>Row Item Hotel</pds-table-cell>
      <pds-table-cell>Row Item Juliett</pds-table-cell>
      <pds-table-cell>Row Item Kilo</pds-table-cell>
      <pds-table-cell>Row Item Lima</pds-table-cell>
      <pds-table-cell>Row Item Mike</pds-table-cell>
    </pds-table-row>
    <pds-table-row value="responsive3">
      <pds-table-cell>Row Item Alpha</pds-table-cell>
      <pds-table-cell>Row Item Beta</pds-table-cell>
      <pds-table-cell>Row Item Charlie</pds-table-cell>
      <pds-table-cell>Row Item Delta</pds-table-cell>
      <pds-table-cell>Row Item Echo</pds-table-cell>
      <pds-table-cell>Row Item Foxtrot</pds-table-cell>
      <pds-table-cell>Row Item Golf</pds-table-cell>
      <pds-table-cell>Row Item Hotel</pds-table-cell>
      <pds-table-cell>Row Item Juliett</pds-table-cell>
      <pds-table-cell>Row Item Kilo</pds-table-cell>
      <pds-table-cell>Row Item Lima</pds-table-cell>
      <pds-table-cell>Row Item Mike</pds-table-cell>
    </pds-table-row>
  </pds-table-body>
</pds-table>`;

const SortableTemplate = (args) => html`
<pds-table
  ?compact=${args.compact}
  component-id="${args.componentId}"
  ?fixed-column=${args.fixedColumn}
  ?responsive=${args.responsive}
  ?row-dividers=${args.rowDividers}
  ?selectable=${args.selectable}
>
  <pds-table-head
    ?border=${args.border}
    ?background=${args.background}
  >
    <pds-table-head-cell sortable=${args.sortable}>Name</pds-table-head-cell>
    <pds-table-head-cell sortable=${args.sortable}>Email</pds-table-head-cell>
    <pds-table-head-cell sortable=${args.sortable}>Email Marketing</pds-table-head-cell>
  </pds-table-head>
  <pds-table-body>
    <pds-table-row>
      <pds-table-cell>John Doe</pds-table-cell>
      <pds-table-cell>john.doe@example.com</pds-table-cell>
      <pds-table-cell>Subscribed</pds-table-cell>
    </pds-table-row>
    <pds-table-row>
      <pds-table-cell>Jane Smith</pds-table-cell>
      <pds-table-cell>jane.smith@example.com</pds-table-cell>
      <pds-table-cell>Not Subscribed</pds-table-cell>
    </pds-table-row>
    <pds-table-row>
      <pds-table-cell>Michael Johnson</pds-table-cell>
      <pds-table-cell>michael.johnson@example.com</pds-table-cell>
      <pds-table-cell>Subscribed</pds-table-cell>
    </pds-table-row>
    <pds-table-row>
      <pds-table-cell>Susan Brown</pds-table-cell>
      <pds-table-cell>susan.brown@example.com</pds-table-cell>
      <pds-table-cell>Not Subscribed</pds-table-cell>
    </pds-table-row>
    <pds-table-row>
      <pds-table-cell>William Davis</pds-table-cell>
      <pds-table-cell>william.davis@example.com</pds-table-cell>
      <pds-table-cell>Subscribed</pds-table-cell>
    </pds-table-row>
    <pds-table-row>
      <pds-table-cell>Mary Wilson</pds-table-cell>
      <pds-table-cell>mary.wilson@example.com</pds-table-cell>
      <pds-table-cell>Not Subscribed</pds-table-cell>
    </pds-table-row>
    <pds-table-row>
      <pds-table-cell>James Lee</pds-table-cell>
      <pds-table-cell>james.lee@example.com</pds-table-cell>
      <pds-table-cell>Subscribed</pds-table-cell>
    </pds-table-row>
    <pds-table-row>
      <pds-table-cell>Linda Hall</pds-table-cell>
      <pds-table-cell>linda.hall@example.com</pds-table-cell>
      <pds-table-cell>Not Subscribed</pds-table-cell>
    </pds-table-row>
  </pds-table-body>
</pds-table>`;

export const Default = BaseTemplate.bind();
Default.args = {
  compact: false,
  componentId: 'default',
  fixedColumn: false,
  border: false,
  background: false,
  responsive: false,
  rowDividers: false,
  selectable: false,
};

export const Alignment = AlignmentTemplate.bind();
Alignment.args = {
  compact: false,
  componentId: 'alignment',
  fixedColumn: false,
  border: false,
  background: false,
  responsive: false,
  rowDividers: false,
  selectable: false,
};

export const Compact = BaseTemplate.bind();
Compact.args = {
  compact: true,
  componentId: 'compact',
  fixedColumn: false,
  border: false,
  background: false,
  responsive: false,
  rowDividers: false,
  selectable: false,
};

export const Selectable = BaseTemplate.bind();
Selectable.args = {
  compact: false,
  componentId: 'selectable',
  fixedColumn: false,
  border: false,
  background: false,
  responsive: false,
  rowDividers: false,
  selectable: true,
};

export const Responsive = ResponsiveTemplate.bind();
Responsive.args = {
  compact: false,
  componentId: 'responsive',
  fixedColumn: false,
  border: false,
  background: false,
  responsive: true,
  rowDividers: false,
  selectable: false,
};

export const fixedColumn = ResponsiveTemplate.bind();
fixedColumn.args = {
  compact: false,
  componentId: 'responsive',
  fixedColumn: true,
  border: false,
  background: false,
  responsive: true,
  rowDividers: false,
  selectable: false,
};

export const Sortable = SortableTemplate.bind();
Sortable.args = {
  compact: false,
  componentId: 'sortable',
  fixedColumn: false,
  border: false,
  background: false,
  responsive: false,
  rowDividers: false,
  selectable: false,
  sortable: true,
};

export const RowDividers = BaseTemplate.bind();
RowDividers.args = {
  compact: false,
  componentId: 'row-dividers',
  fixedColumn: false,
  border: false,
  background: false,
  responsive: false,
  rowDividers: true,
  selectable: false,
};
