import { html } from 'lit-html';
import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';
// import { withActions } from '@storybook/addon-actions/decorator';

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
<pds-table component-id=${args.componentId} selectable=${args.selectable}>
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


export const Default = BaseTemplate.bind();
Default.args = {
  componentId: 'default',
  selectable: false,
};

export const Selectable = BaseTemplate.bind();
Selectable.args = {
  componentId: 'selectable',
  selectable: true,
};
