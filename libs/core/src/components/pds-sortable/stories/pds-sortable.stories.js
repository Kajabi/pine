import { html } from 'lit-html';
import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';
import { withActions } from '@storybook/addon-actions/decorator';

export default {
  argTypes: extractArgTypes('pds-sortable'),
  component: 'pds-sortable',
  decorators: [withActions],
  parameters: {
    actions: {
      handles: ['pdsSortableChange'],
    },
  },
  title: 'components/Sortable',
};

const BaseTemplate = (args) => html`
<pds-sortable .border=${args.border} component-id="${args.componentId}" .dividers=${args.dividers} handle-type="${args.handleType}">
  <pds-sortable-item>Item 1</pds-sortable-item>
  <pds-sortable-item>Item 2</pds-sortable-item>
  <pds-sortable-item>Item 3</pds-sortable-item>
</pds-sortable>`;

const HandleTemplate = (args) => html`
<pds-sortable .border=${args.border} component-id="${args.componentId}" .dividers=${args.dividers} handle-type="${args.handleType}">
  <pds-sortable-item>Item 1</pds-sortable-item>
  <pds-sortable-item>Item 2</pds-sortable-item>
  <pds-sortable-item>Item 3</pds-sortable-item>
</pds-sortable>`;

const ActionsTemplate = (args) => html`
<pds-sortable .border=${args.border} component-id="${args.componentId}" .dividers=${args.dividers} handle-type="${args.handleType}">
  <pds-sortable-item .enable-actions=${true}>
    <div>Item 1</div>
    <div slot="sortable-item-actions">
      <pds-button variant="plain" size="sm">
        <pds-icon name="trash"></pds-icon>
      </pds-button>
    </div>
  </pds-sortable-item>
  <pds-sortable-item .enable-actions=${true}>
    <div>Item 2</div>
    <div slot="sortable-item-actions">
      <pds-button variant="plain" size="sm">
        <pds-icon name="trash"></pds-icon>
      </pds-button>
    </div>
  </pds-sortable-item>
  <pds-sortable-item .enable-actions=${true}>
    <div>Item 3</div>
    <div slot="sortable-item-actions">
      <pds-button variant="plain" size="sm">
        <pds-icon name="trash"></pds-icon>
      </pds-button>
    </div>
  </pds-sortable-item>
</pds-sortable>`;

export const Default = BaseTemplate.bind();
Default.args = {
  border: true,
  componentId: 'default-sortable',
  dividers: true,
  handleType: 'default',
};

export const Handle = HandleTemplate.bind();
Handle.args = {
  border: true,
  componentId: 'handle-sortable',
  dividers: true,
  handleType: 'handle',
};

export const Actions = ActionsTemplate.bind();
Actions.args = {
  border: true,
  componentId: 'actions-sortable',
  dividers: true,
  handleType: 'default',
};

