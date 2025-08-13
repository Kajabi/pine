import { html } from 'lit-html';
import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';
import { withActions } from '@storybook/addon-actions/decorator';

export default {
  argTypes: extractArgTypes('pds-table'),
  component: 'pds-table',
  decorators: [withActions],
  parameters: {
    actions: {
      handles: ['onclick', 'pdsTableRowSelected', 'onclick', 'pdsTableSelectAll', 'pdsTableSort'],
    },
  },
  title: 'components/Table',
};

const BaseTemplate = (args) => html`
<pds-table
  ?compact=${args.compact}
  component-id="${args.componentId}"
  ?fixed-column=${args.fixedColumn}
  ?responsive=${args.responsive}
  ?selectable=${args.selectable}
>
  <pds-table-head>
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

const ResponsiveTemplate = (args) => html`
<pds-table
  ?compact=${args.compact}
  component-id="${args.componentId}"
  ?fixed-column=${args.fixedColumn}
  ?responsive=${args.responsive}
  ?selectable=${args.selectable}
>
  <pds-table-head>
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
  ?selectable=${args.selectable}
>
  <pds-table-head>
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
  responsive: false,
  selectable: false,
};

export const Compact = BaseTemplate.bind();
Compact.args = {
  compact: true,
  componentId: 'compact',
  fixedColumn: false,
  responsive: false,
  selectable: false,
};

export const Selectable = BaseTemplate.bind();
Selectable.args = {
  compact: false,
  componentId: 'selectable',
  fixedColumn: false,
  responsive: false,
  selectable: true,
};

export const Responsive = ResponsiveTemplate.bind();
Responsive.args = {
  compact: false,
  componentId: 'responsive',
  fixedColumn: false,
  responsive: true,
  selectable: false,
};

export const fixedColumn = ResponsiveTemplate.bind();
fixedColumn.args = {
  compact: false,
  componentId: 'responsive',
  fixedColumn: true,
  responsive: true,
  selectable: false,
};

export const Sortable = SortableTemplate.bind();
Sortable.args = {
  compact: false,
  componentId: 'sortable',
  fixedColumn: false,
  responsive: false,
  selectable: false,
  sortable: true,
};
