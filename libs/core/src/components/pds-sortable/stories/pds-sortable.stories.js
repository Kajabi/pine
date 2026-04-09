import { html } from 'lit-html';


export default {

  component: 'pds-sortable',
  parameters: {},
  title: 'components/Sortable',
};

const BaseTemplate = (args) => html`
<pds-sortable ?border=${args.border} component-id="${args.componentId}" ?disabled=${args.disabled} ?dividers=${args.dividers} handle-type="${args.handleType}">
  <pds-sortable-item>Item 1</pds-sortable-item>
  <pds-sortable-item>Item 2</pds-sortable-item>
  <pds-sortable-item>Item 3</pds-sortable-item>
</pds-sortable>`;

const HandleTemplate = (args) => html`
<pds-sortable ?border=${args.border} component-id="${args.componentId}" ?disabled=${args.disabled} ?dividers=${args.dividers} handle-type="${args.handleType}">
  <pds-sortable-item>Item 1</pds-sortable-item>
  <pds-sortable-item>Item 2</pds-sortable-item>
  <pds-sortable-item>Item 3</pds-sortable-item>
</pds-sortable>`;

const ActionsTemplate = (args) => html`
<pds-sortable ?border=${args.border} component-id="${args.componentId}" ?disabled=${args.disabled} ?dividers=${args.dividers} handle-type="${args.handleType}">
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
<pds-sortable ?border=${args.border} component-id="${args.componentId}" ?disabled=${args.disabled} ?dividers=${args.dividers} handle-type="${args.handleType}">
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
  disabled: false,
  dividers: false,
  handleType: 'row',
};

export const Bordered = BaseTemplate.bind();
Bordered.args = {
  componentId: 'bordered',
  border: true,
  disabled: false,
  dividers: false,
  handleType: 'row',
};

export const Disabled = BaseTemplate.bind();
Disabled.args = {
  componentId: 'disabled',
  border: true,
  disabled: true,
  dividers: true,
  handleType: 'row',
};

export const Dividers = BaseTemplate.bind();
Dividers.args = {
  componentId: 'dividers',
  border: false,
  disabled: false,
  dividers: true,
  handleType: 'row',
};

export const Handle = HandleTemplate.bind();
Handle.args = {
  componentId: 'handle',
  border: false,
  disabled: false,
  dividers: false,
  handleType: 'handle',
};

export const Actions = ActionsTemplate.bind();
Actions.args = {
  componentId: 'actions',
  border: false,
  disabled: false,
  dividers: false,
  handleType: 'row',
};

export const FullDemo = FullDemoTemplate.bind();
FullDemo.args = {
  componentId: 'demo',
  border: true,
  disabled: false,
  dividers: true,
  handleType: 'row',
};
