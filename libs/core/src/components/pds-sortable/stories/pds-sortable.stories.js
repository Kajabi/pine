import { html } from 'lit-html';
import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';
import { withActions } from '@storybook/addon-actions/decorator';

export default {
  argTypes: extractArgTypes('pds-sortable'),
  component: 'pds-sortable',
  decorators: [withActions],
  parameters: {
    actions: {
      handles: ['onchange', 'pdsSortableItemMoved'],
    },
  },
  title: 'components/Sortable',
};

const BaseTemplate = (args) => html`
<pds-sortable border="${args.border}" component-id="${args.componentId}" .dividers=${args.dividers} handle-type="${args.handleType}">
  <pds-sortable-item>Item 1</pds-sortable-item>
  <pds-sortable-item>Item 2</pds-sortable-item>
  <pds-sortable-item>Item 3</pds-sortable-item>
</pds-sortable>`;

const HandleTemplate = (args) => html`
<pds-sortable border="${args.border}" component-id="${args.componentId}" .dividers=${args.dividers} handle-type="${args.handleType}">
  <pds-sortable-item>Item 1</pds-sortable-item>
  <pds-sortable-item>Item 2</pds-sortable-item>
  <pds-sortable-item>Item 3</pds-sortable-item>
</pds-sortable>`;

const ActionsTemplate = (args) => html`
<pds-sortable border="${args.border}" component-id="${args.componentId}" .dividers=${args.dividers} handle-type="${args.handleType}">
  <pds-sortable-item enable-actions>
    <div>Item 1</div>
    <div slot="sortable-item-actions">
      <pds-link href="#" variant="plain">action</pds-link>
    </div>
  </pds-sortable-item>
  <pds-sortable-item enable-actions>
    <div>Item 2</div>
    <div slot="sortable-item-actions">
      <pds-link href="#" variant="plain">action</pds-link>
    </div>
  </pds-sortable-item>
  <pds-sortable-item enable-actions>
    <div>Item 3</div>
    <div slot="sortable-item-actions">
      <pds-link href="#" variant="plain">action</pds-link>
    </div>
  </pds-sortable-item>
</pds-sortable>`;

const FullDemoTemplate = (args) => html`
<pds-sortable border="${args.border}" component-id="${args.componentId}" .dividers=${args.dividers} handle-type="${args.handleType}">
  <pds-sortable-item enable-actions>
    <div>
      <div><strong>Item 1</strong></div>
      <div>Item 1 description copy text</div>
    </div>
    <div slot="sortable-item-actions">
      <pds-link href="#" variant="plain">action</pds-link>
    </div>
  </pds-sortable-item>
  <pds-sortable-item enable-actions>
    <div>
      <div><strong>Item 2</strong></div>
      <div>Item 2 description copy text</div>
    </div>
    <div slot="sortable-item-actions">
      <pds-link href="#" variant="plain">action</pds-link>
    </div>
  </pds-sortable-item>
  <pds-sortable-item enable-actions>
    <div>
      <div><strong>Item 3</strong></div>
      <div>Item 3 description copy text</div>
    </div>
    <div slot="sortable-item-actions">
      <pds-link href="#" variant="plain">action</pds-link>
    </div>
  </pds-sortable-item>
</pds-sortable>`;

export const Default = BaseTemplate.bind();
Default.args = {
  componentId: 'default',
  border: false,
  dividers: false,
  handleType: 'row',
};

export const Bordered = BaseTemplate.bind();
Bordered.args = {
  componentId: 'bordered',
  border: true,
  dividers: false,
  handleType: 'row',
};

export const Dividers = BaseTemplate.bind();
Dividers.args = {
  componentId: 'dividers',
  border: false,
  dividers: true,
  handleType: 'row',
};

export const Handle = HandleTemplate.bind();
Handle.args = {
  componentId: 'handle',
  border: false,
  dividers: false,
  handleType: 'handle',
};

export const Actions = ActionsTemplate.bind();
Actions.args = {
  componentId: 'actions',
  border: false,
  dividers: false,
  handleType: 'row',
};

export const FullDemo = FullDemoTemplate.bind();
FullDemo.args = {
  componentId: 'demo',
  border: true,
  dividers: true,
  handleType: 'row',
};
