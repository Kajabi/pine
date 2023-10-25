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
<pds-table component-id=${args.componentId} selectable=${args.selectable} compact=${args.compact}>
  <pds-table-head selectable=${args.selectable}>
    <pds-table-head-cell compact=${args.compact}>Column Title</pds-table-head-cell>
    <pds-table-head-cell compact=${args.compact}>Column Title</pds-table-head-cell>
    <pds-table-head-cell compact=${args.compact}>Column Title</pds-table-head-cell>
  </pds-table-head>
  <pds-table-body>
    <pds-table-row value="row1" selectable=${args.selectable}>
      <pds-table-cell compact=${args.compact}>Row Item Alpha</pds-table-cell>
      <pds-table-cell compact=${args.compact} >Row Item Alpha</pds-table-cell>
      <pds-table-cell compact=${args.compact} >Row Item Alpha</pds-table-cell>
    </pds-table-row>
    <pds-table-row value="row2" selectable=${args.selectable}>
      <pds-table-cell compact=${args.compact}>Row Item Bravo</pds-table-cell>
      <pds-table-cell compact=${args.compact}>Row Item Bravo</pds-table-cell>
      <pds-table-cell compact=${args.compact}>Row Item Bravo</pds-table-cell>
    </pds-table-row>
    <pds-table-row value="row3" selectable=${args.selectable}>
      <pds-table-cell compact=${args.compact}>Row Item Charlie</pds-table-cell>
      <pds-table-cell compact=${args.compact}>Row Item Charlie</pds-table-cell>
      <pds-table-cell compact=${args.compact}>Row Item Charlie</pds-table-cell>
    </pds-table-row>
  </pds-table-body>
</pds-table>`;


export const Default = BaseTemplate.bind();
Default.args = {
  compact: false,
  componentId: 'default',
  selectable: false,
};

export const Compact = BaseTemplate.bind();
Compact.args = {
  compact: true,
  componentId: 'compact',
  selectable: false,
};

export const Selectable = BaseTemplate.bind();
Selectable.args = {
  compact: false,
  componentId: 'selectable',
  selectable: true,
};
