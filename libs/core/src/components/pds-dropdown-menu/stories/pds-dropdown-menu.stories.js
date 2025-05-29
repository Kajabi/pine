import { html } from 'lit';
import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';
import { withActions } from '@storybook/addon-actions/decorator';

export default {
  argTypes: extractArgTypes('pds-dropdown-menu'),
  component: 'pds-dropdown-menu',
  title: 'components/Dropdown Menu',
  decorators: [withActions],
  parameters: {
    actions: {
      handles: ['pdsClick'],
    }
  }
}

const BaseTemplate = (args) => html`
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
    <pds-dropdown-menu-item destructive><pds-icon name="trash"></pds-icon> Delete</pds-dropdown-menu-item>
    <pds-dropdown-menu-item href="https://wwww.google.com">Go to Google</pds-dropdown-menu-item>
    <pds-dropdown-menu-item href="https://wwww.google.com" disabled>Go to Google</pds-dropdown-menu-item>
  </pds-dropdown-menu>`;


export const Default = BaseTemplate.bind();
Default.args = {
  componentId: 'base-dropdown',
  placement: 'bottom-start',
}
