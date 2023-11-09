import { html } from 'lit-html';
import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';
import { withActions } from '@storybook/addon-actions/decorator';

export default {
  argTypes: extractArgTypes('pds-table'),
  component: 'pds-table',
  decorators: [withActions],
  parameters: {
    actions: {
      handles: ['onclick', 'pdsTableRowSelected'],
    },
  },
  title: 'components/Table',
};

const BaseTemplate = (args) => html`
<pds-table
  compact="${args.compact}"
  component-id="${args.componentId}"
  fixed-column="${args.fixedColumn}"
  responsive="${args.responsive}"
  selectable="${args.selectable}"
>
  <pds-table-head>
    <pds-table-head-cell class="${args.compact ? 'hydrated is-compact' : 'hydrated'}">Column Title</pds-table-head-cell>
    <pds-table-head-cell class="${args.compact ? 'hydrated is-compact' : 'hydrated'}">Column Title</pds-table-head-cell>
    <pds-table-head-cell class="${args.compact ? 'hydrated is-compact' : 'hydrated'}">Column Title</pds-table-head-cell>
  </pds-table-head>
  <pds-table-body>
    <pds-table-row value="row1">
      <pds-table-cell class="${args.compact ? 'hydrated is-compact' : 'hydrated'}">Row Item Alpha</pds-table-cell>
      <pds-table-cell class="${args.compact ? 'hydrated is-compact' : 'hydrated'}">Row Item Alpha</pds-table-cell>
      <pds-table-cell class="${args.compact ? 'hydrated is-compact' : 'hydrated'}">Row Item Alpha</pds-table-cell>
    </pds-table-row>
    <pds-table-row value="row2">
      <pds-table-cell class="${args.compact ? 'hydrated is-compact' : 'hydrated'}">Row Item Bravo</pds-table-cell>
      <pds-table-cell class="${args.compact ? 'hydrated is-compact' : 'hydrated'}">Row Item Bravo</pds-table-cell>
      <pds-table-cell class="${args.compact ? 'hydrated is-compact' : 'hydrated'}">Row Item Bravo</pds-table-cell>
    </pds-table-row>
    <pds-table-row value="row3">
      <pds-table-cell class="${args.compact ? 'hydrated is-compact' : 'hydrated'}">Row Item Charlie</pds-table-cell>
      <pds-table-cell class="${args.compact ? 'hydrated is-compact' : 'hydrated'}">Row Item Charlie</pds-table-cell>
      <pds-table-cell class="${args.compact ? 'hydrated is-compact' : 'hydrated'}">Row Item Charlie</pds-table-cell>
    </pds-table-row>
  </pds-table-body>
</pds-table>`;

const ResponsiveTemplate = (args) => html`
<pds-table
  compact="${args.compact}"
  component-id="${args.componentId}"
  fixed-column="${args.fixedColumn}"
  responsive="${args.responsive}"
  selectable="${args.selectable}"
>
  <pds-table-head>
    <pds-table-head-cell class="${args.compact ? 'hydrated is-compact' : 'hydrated'}">Column Title</pds-table-head-cell>
    <pds-table-head-cell class="${args.compact ? 'hydrated is-compact' : 'hydrated'}">Column Title</pds-table-head-cell>
    <pds-table-head-cell class="${args.compact ? 'hydrated is-compact' : 'hydrated'}">Column Title</pds-table-head-cell>
    <pds-table-head-cell class="${args.compact ? 'hydrated is-compact' : 'hydrated'}">Column Title</pds-table-head-cell>
    <pds-table-head-cell class="${args.compact ? 'hydrated is-compact' : 'hydrated'}">Column Title</pds-table-head-cell>
    <pds-table-head-cell class="${args.compact ? 'hydrated is-compact' : 'hydrated'}">Column Title</pds-table-head-cell>
    <pds-table-head-cell class="${args.compact ? 'hydrated is-compact' : 'hydrated'}">Column Title</pds-table-head-cell>
    <pds-table-head-cell class="${args.compact ? 'hydrated is-compact' : 'hydrated'}">Column Title</pds-table-head-cell>
    <pds-table-head-cell class="${args.compact ? 'hydrated is-compact' : 'hydrated'}">Column Title</pds-table-head-cell>
    <pds-table-head-cell class="${args.compact ? 'hydrated is-compact' : 'hydrated'}">Column Title</pds-table-head-cell>
    <pds-table-head-cell class="${args.compact ? 'hydrated is-compact' : 'hydrated'}">Column Title</pds-table-head-cell>
    <pds-table-head-cell class="${args.compact ? 'hydrated is-compact' : 'hydrated'}">Column Title</pds-table-head-cell>
  </pds-table-head>
  <pds-table-body>
    <pds-table-row value="responsive1">
      <pds-table-cell class="${args.compact ? 'hydrated is-compact' : 'hydrated'}">Row Item Alpha</pds-table-cell>
      <pds-table-cell class="${args.compact ? 'hydrated is-compact' : 'hydrated'}">Row Item Beta</pds-table-cell>
      <pds-table-cell class="${args.compact ? 'hydrated is-compact' : 'hydrated'}">Row Item Charlie</pds-table-cell>
      <pds-table-cell class="${args.compact ? 'hydrated is-compact' : 'hydrated'}">Row Item Delta</pds-table-cell>
      <pds-table-cell class="${args.compact ? 'hydrated is-compact' : 'hydrated'}">Row Item Echo</pds-table-cell>
      <pds-table-cell class="${args.compact ? 'hydrated is-compact' : 'hydrated'}">Row Item Foxtrot</pds-table-cell>
      <pds-table-cell class="${args.compact ? 'hydrated is-compact' : 'hydrated'}">Row Item Golf</pds-table-cell>
      <pds-table-cell class="${args.compact ? 'hydrated is-compact' : 'hydrated'}">Row Item Hotel</pds-table-cell>
      <pds-table-cell class="${args.compact ? 'hydrated is-compact' : 'hydrated'}">Row Item Juliett</pds-table-cell>
      <pds-table-cell class="${args.compact ? 'hydrated is-compact' : 'hydrated'}">Row Item Kilo</pds-table-cell>
      <pds-table-cell class="${args.compact ? 'hydrated is-compact' : 'hydrated'}">Row Item Lima</pds-table-cell>
      <pds-table-cell class="${args.compact ? 'hydrated is-compact' : 'hydrated'}">Row Item Mike</pds-table-cell>
    </pds-table-row>
    <pds-table-row value="responsive2">
      <pds-table-cell class="${args.compact ? 'hydrated is-compact' : 'hydrated'}">Row Item Alpha</pds-table-cell>
      <pds-table-cell class="${args.compact ? 'hydrated is-compact' : 'hydrated'}">Row Item Beta</pds-table-cell>
      <pds-table-cell class="${args.compact ? 'hydrated is-compact' : 'hydrated'}">Row Item Charlie</pds-table-cell>
      <pds-table-cell class="${args.compact ? 'hydrated is-compact' : 'hydrated'}">Row Item Delta</pds-table-cell>
      <pds-table-cell class="${args.compact ? 'hydrated is-compact' : 'hydrated'}">Row Item Echo</pds-table-cell>
      <pds-table-cell class="${args.compact ? 'hydrated is-compact' : 'hydrated'}">Row Item Foxtrot</pds-table-cell>
      <pds-table-cell class="${args.compact ? 'hydrated is-compact' : 'hydrated'}">Row Item Golf</pds-table-cell>
      <pds-table-cell class="${args.compact ? 'hydrated is-compact' : 'hydrated'}">Row Item Hotel</pds-table-cell>
      <pds-table-cell class="${args.compact ? 'hydrated is-compact' : 'hydrated'}">Row Item Juliett</pds-table-cell>
      <pds-table-cell class="${args.compact ? 'hydrated is-compact' : 'hydrated'}">Row Item Kilo</pds-table-cell>
      <pds-table-cell class="${args.compact ? 'hydrated is-compact' : 'hydrated'}">Row Item Lima</pds-table-cell>
      <pds-table-cell class="${args.compact ? 'hydrated is-compact' : 'hydrated'}">Row Item Mike</pds-table-cell>
    </pds-table-row>
    <pds-table-row value="responsive3">
      <pds-table-cell class="${args.compact ? 'hydrated is-compact' : 'hydrated'}">Row Item Alpha</pds-table-cell>
      <pds-table-cell class="${args.compact ? 'hydrated is-compact' : 'hydrated'}">Row Item Beta</pds-table-cell>
      <pds-table-cell class="${args.compact ? 'hydrated is-compact' : 'hydrated'}">Row Item Charlie</pds-table-cell>
      <pds-table-cell class="${args.compact ? 'hydrated is-compact' : 'hydrated'}">Row Item Delta</pds-table-cell>
      <pds-table-cell class="${args.compact ? 'hydrated is-compact' : 'hydrated'}">Row Item Echo</pds-table-cell>
      <pds-table-cell class="${args.compact ? 'hydrated is-compact' : 'hydrated'}">Row Item Foxtrot</pds-table-cell>
      <pds-table-cell class="${args.compact ? 'hydrated is-compact' : 'hydrated'}">Row Item Golf</pds-table-cell>
      <pds-table-cell class="${args.compact ? 'hydrated is-compact' : 'hydrated'}">Row Item Hotel</pds-table-cell>
      <pds-table-cell class="${args.compact ? 'hydrated is-compact' : 'hydrated'}">Row Item Juliett</pds-table-cell>
      <pds-table-cell class="${args.compact ? 'hydrated is-compact' : 'hydrated'}">Row Item Kilo</pds-table-cell>
      <pds-table-cell class="${args.compact ? 'hydrated is-compact' : 'hydrated'}">Row Item Lima</pds-table-cell>
      <pds-table-cell class="${args.compact ? 'hydrated is-compact' : 'hydrated'}">Row Item Mike</pds-table-cell>
    </pds-table-row>
  </pds-table-body>
</pds-table>`;

const SortableTemplate = (args) => html`
<pds-table
  compact="${args.compact}"
  component-id="${args.componentId}"
  fixed-column="${args.fixedColumn}"
  responsive="${args.responsive}"
  selectable="${args.selectable}"
>
  <pds-table-head>
    <pds-table-head-cell class="${args.compact ? 'hydrated is-compact' : 'hydrated'}" sortable=${args.sortable}>Name</pds-table-head-cell>
    <pds-table-head-cell class="${args.compact ? 'hydrated is-compact' : 'hydrated'}" sortable=${args.sortable}>Email</pds-table-head-cell>
    <pds-table-head-cell class="${args.compact ? 'hydrated is-compact' : 'hydrated'}" sortable=${args.sortable}>Email Marketing</pds-table-head-cell>
  </pds-table-head>
  <pds-table-body>
    <pds-table-row>
      <pds-table-cell class="${args.compact ? 'hydrated is-compact' : 'hydrated'}">John Doe</pds-table-cell>
      <pds-table-cell class="${args.compact ? 'hydrated is-compact' : 'hydrated'}">john.doe@example.com</pds-table-cell>
      <pds-table-cell class="${args.compact ? 'hydrated is-compact' : 'hydrated'}">Subscribed</pds-table-cell>
    </pds-table-row>
    <pds-table-row>
      <pds-table-cell class="${args.compact ? 'hydrated is-compact' : 'hydrated'}">Jane Smith</pds-table-cell>
      <pds-table-cell class="${args.compact ? 'hydrated is-compact' : 'hydrated'}">jane.smith@example.com</pds-table-cell>
      <pds-table-cell class="${args.compact ? 'hydrated is-compact' : 'hydrated'}">Not Subscribed</pds-table-cell>
    </pds-table-row>
    <pds-table-row>
      <pds-table-cell class="${args.compact ? 'hydrated is-compact' : 'hydrated'}">Michael Johnson</pds-table-cell>
      <pds-table-cell class="${args.compact ? 'hydrated is-compact' : 'hydrated'}">michael.johnson@example.com</pds-table-cell>
      <pds-table-cell class="${args.compact ? 'hydrated is-compact' : 'hydrated'}">Subscribed</pds-table-cell>
    </pds-table-row>
    <pds-table-row>
      <pds-table-cell class="${args.compact ? 'hydrated is-compact' : 'hydrated'}">Susan Brown</pds-table-cell>
      <pds-table-cell class="${args.compact ? 'hydrated is-compact' : 'hydrated'}">susan.brown@example.com</pds-table-cell>
      <pds-table-cell class="${args.compact ? 'hydrated is-compact' : 'hydrated'}">Not Subscribed</pds-table-cell>
    </pds-table-row>
    <pds-table-row>
      <pds-table-cell class="${args.compact ? 'hydrated is-compact' : 'hydrated'}">William Davis</pds-table-cell>
      <pds-table-cell class="${args.compact ? 'hydrated is-compact' : 'hydrated'}">william.davis@example.com</pds-table-cell>
      <pds-table-cell class="${args.compact ? 'hydrated is-compact' : 'hydrated'}">Subscribed</pds-table-cell>
    </pds-table-row>
    <pds-table-row>
      <pds-table-cell class="${args.compact ? 'hydrated is-compact' : 'hydrated'}">Mary Wilson</pds-table-cell>
      <pds-table-cell class="${args.compact ? 'hydrated is-compact' : 'hydrated'}">mary.wilson@example.com</pds-table-cell>
      <pds-table-cell class="${args.compact ? 'hydrated is-compact' : 'hydrated'}">Not Subscribed</pds-table-cell>
    </pds-table-row>
    <pds-table-row>
      <pds-table-cell class="${args.compact ? 'hydrated is-compact' : 'hydrated'}">James Lee</pds-table-cell>
      <pds-table-cell class="${args.compact ? 'hydrated is-compact' : 'hydrated'}">james.lee@example.com</pds-table-cell>
      <pds-table-cell class="${args.compact ? 'hydrated is-compact' : 'hydrated'}">Subscribed</pds-table-cell>
    </pds-table-row>
    <pds-table-row>
      <pds-table-cell class="${args.compact ? 'hydrated is-compact' : 'hydrated'}">Linda Hall</pds-table-cell>
      <pds-table-cell class="${args.compact ? 'hydrated is-compact' : 'hydrated'}">linda.hall@example.com</pds-table-cell>
      <pds-table-cell class="${args.compact ? 'hydrated is-compact' : 'hydrated'}">Not Subscribed</pds-table-cell>
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
