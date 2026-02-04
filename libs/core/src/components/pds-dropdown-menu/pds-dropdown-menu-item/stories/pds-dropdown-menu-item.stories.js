import { html } from 'lit';

export default {
  component: 'pds-dropdown-menu-item',
  title: 'components/Dropdown Menu/Dropdown Menu Item',
  parameters: {
    docs: {
      description: {
        component: 'Individual menu items for use within pds-dropdown-menu. Supports links, buttons, destructive actions, and HTTP method handling for non-GET requests.',
      },
    },
  },
};

const Template = (args) => html`
<div style="height: 250px">
  <pds-dropdown-menu>
    <pds-button slot="trigger">Open Menu</pds-button>
    <pds-dropdown-menu-item
      component-id=${args.componentId}
      href=${args.href}
    >
      ${args.label}
    </pds-dropdown-menu-item>
    <pds-dropdown-menu-item>Another Item</pds-dropdown-menu-item>
  </pds-dropdown-menu>
</div>`;

export const Default = Template.bind({});
Default.args = {
  componentId: 'menu-item-default',
  label: 'Menu Item',
  href: undefined,
};
