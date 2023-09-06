import { html } from 'lit';
import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';
import { withActions } from '@storybook/addon-actions/decorator';

export default {
  argTypes: extractArgTypes('pds-popover'),
  args: {
    hasArrow: false,
    opened: false
  },
  component: 'pds-popover',
  decorators: [withActions],
  parameters: {
    actions: {
      handles: ['pdsPopoverShow', 'pdsPopoverHide'],
    },
  },
  title: 'components/Popover'
}

const BaseTemplate = (args) => html`
  <pds-popover component-id="${args.componentId}" has-arrow=${args.hasArrow} opened=${args.opened} placement=${args.placement}>
    <div slot="content">
      <p>Pastrami chuck leberkas, swine biltong tail fatback</p>
      <div>
        <pds-button variant="secondary">Cancel</pds-button>
        <pds-button>Get Started</pds-button>
      </div>
    </div>
    <pds-button variant="secondary">Help</pds-button>
  </pds-popover>`;

const AvatarDropdownTemplate = (args) => html`
  <pds-popover component-id="${args.componentId}" has-arrow=${args.hasArrow} opened=${args.opened} placement=${args.placement}>
    <div slot="content">
      <p>Pastrami chuck leberkas, swine biltong tail fatback jowl.</p>
      <div>
        <pds-button variant="secondary">Cancel</pds-button>
        <pds-button>Get Started</pds-button>
      </div>
    </div>
    <pds-avatar dropdown="true"></pds-avatar>
  </pds-popover>`;

const ListTemplate = (args) => html`
  <pds-popover has-arrow=${args.hasArrow} placement=${args.placement}>
    <pds-button variant="secondary">Menu</pds-button>
    <div slot="content">
      <pds-list-options>
        <pds-list-option>Item 1</pds-list-option>
        <pds-list-option>Item 2</pds-list-option>
        <pds-list-option>Item 3</pds-list-option>
      </pds-list-options>

  </pds-popover>
`;

export const Default = BaseTemplate.bind({});
Default.args = {
  componentId: "default",
  hasArrow: false,
  htmlContent: true,
  placement: "bottom-start",
};

export const AvatarPopover = AvatarDropdownTemplate.bind({});
AvatarPopover.args = {
  hasArrow: false,
  htmlContent: true,
  placement: "bottom-start",
};

export const WithList = ListTemplate.bind({});
WithList.args = {
  hasArrow: false,
  placement: "bottom-start",
};
