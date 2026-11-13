import { html } from 'lit';


export default {

  component: 'pds-dropdown-menu',
  title: 'components/Dropdown Menu',
  parameters: {}
}

const BaseTemplate = (args) => html`
<div style="height: 200px">
  <pds-dropdown-menu
    component-id=${args.componentId}
    placement=${args.placement}
  >
    <pds-button slot="trigger">My Trigger</pds-button>
    <pds-dropdown-menu-item>Item 1</pds-dropdown-menu-item>
    <pds-dropdown-menu-item>Item 2</pds-dropdown-menu-item>
    <pds-dropdown-menu-item>Item 3</pds-dropdown-menu-item>
    <pds-dropdown-menu-item>Item 4</pds-dropdown-menu-item>
    <pds-dropdown-menu-separator></pds-dropdown-menu-separator>
    <pds-dropdown-menu-item>Item 5</pds-dropdown-menu-item>
    <pds-dropdown-menu-item>Item 6</pds-dropdown-menu-item>
    <pds-dropdown-menu-separator></pds-dropdown-menu-separator>
    <pds-dropdown-menu-item disabled>disabled</pds-dropdown-menu-item>
    <pds-dropdown-menu-separator></pds-dropdown-menu-separator>
    <pds-dropdown-menu-item destructive><pds-icon slot="start" name="trash"></pds-icon>Delete</pds-dropdown-menu-item>
    <pds-dropdown-menu-item href="https://wwww.google.com">Go to Google</pds-dropdown-menu-item>
    <pds-dropdown-menu-item href="https://wwww.google.com" disabled>Go to Google</pds-dropdown-menu-item>
  </pds-dropdown-menu></div>`;


export const Default = BaseTemplate.bind();
Default.args = {
  componentId: 'base-dropdown',
  placement: 'bottom-start',
}

const InformationalTemplate = (args) => html`
<div style="height: 200px">
  <pds-dropdown-menu
    component-id=${args.componentId}
    placement=${args.placement}
  >
    <pds-button slot="trigger" variant="secondary">Used on</pds-button>
    <pds-dropdown-menu-item href="#products">3 products</pds-dropdown-menu-item>
    <pds-dropdown-menu-item informational>2 forms</pds-dropdown-menu-item>
    <pds-dropdown-menu-item href="#emails">5 emails</pds-dropdown-menu-item>
    <pds-dropdown-menu-item informational href="#pages">1 page</pds-dropdown-menu-item>
  </pds-dropdown-menu>
</div>`;

export const Informational = InformationalTemplate.bind();
Informational.args = {
  componentId: 'informational-dropdown',
  placement: 'bottom-start',
}

const InformationalOnlyTemplate = (args) => html`
<div style="height: 200px">
  <pds-dropdown-menu
    component-id=${args.componentId}
    placement=${args.placement}
  >
    <pds-button slot="trigger" variant="secondary">Used on</pds-button>
    <pds-dropdown-menu-item informational>3 products</pds-dropdown-menu-item>
    <pds-dropdown-menu-item informational>2 forms</pds-dropdown-menu-item>
    <pds-dropdown-menu-item informational>5 emails</pds-dropdown-menu-item>
  </pds-dropdown-menu>
</div>`;

export const InformationalOnly = InformationalOnlyTemplate.bind();
InformationalOnly.args = {
  componentId: 'informational-only-dropdown',
  placement: 'bottom-start',
}

const WithIconsTemplate = (args) => html`
<div style="height: 250px">
  <pds-dropdown-menu
    component-id=${args.componentId}
    placement=${args.placement}
  >
    <pds-button slot="trigger">Actions</pds-button>
    <pds-dropdown-menu-item><pds-icon slot="start" name="pen"></pds-icon>Edit</pds-dropdown-menu-item>
    <pds-dropdown-menu-item><pds-icon slot="start" name="duplicate"></pds-icon>Duplicate</pds-dropdown-menu-item>
    <pds-dropdown-menu-item href="#export"><pds-icon slot="start" name="download"></pds-icon>Download</pds-dropdown-menu-item>
    <pds-dropdown-menu-item disabled><pds-icon slot="start" name="archive"></pds-icon>Archive</pds-dropdown-menu-item>
    <pds-dropdown-menu-item informational><pds-icon slot="start" name="gear"></pds-icon>Managed in settings</pds-dropdown-menu-item>
    <pds-dropdown-menu-separator></pds-dropdown-menu-separator>
    <pds-dropdown-menu-item destructive><pds-icon slot="start" name="trash"></pds-icon>Delete</pds-dropdown-menu-item>
  </pds-dropdown-menu>
</div>`;

export const WithIcons = WithIconsTemplate.bind();
WithIcons.args = {
  componentId: 'icons-dropdown',
  placement: 'bottom-start',
}
