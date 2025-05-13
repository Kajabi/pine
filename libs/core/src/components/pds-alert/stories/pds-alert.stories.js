import { html } from 'lit';
import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';
import { withActions } from '@storybook/addon-actions/decorator';

export default {
  argTypes: extractArgTypes('pds-alert'),
  component: 'pds-alert',
  decorators: [withActions],
  parameters: {
    actions: {
      handles: ['onclick', 'pdsAlertCloseClick'],
    },
  },
  title: 'components/Alert',
};

const BaseTemplate = (args) => html` <pds-alert
  component-id="${args.componentId}"
  variant="${args.variant}"
  heading="${args.heading}"
  description="${args.description}"
  small="${args.small}"
  dismissible="${args.dismissible}"
></pds-alert>`;

const ActionsTemplate = (args) => html` <pds-alert
  component-id="${args.componentId}"
  variant="${args.variant}"
  heading="${args.heading}"
  description="${args.description}"
  small="${args.small}"
  dismissible="${args.dismissible}"
>
  <pds-button slot="actions" variant="primary">Button</pds-button>
  <pds-link slot="actions" variant="plain" href="#">Link</pds-link>
</pds-alert>`;

const SmallActionsTemplate = (args) => html` <pds-alert
  component-id="${args.componentId}"
  variant="${args.variant}"
  heading="${args.heading}"
  description="${args.description}"
  small="${args.small}"
  dismissible="${args.dismissible}"
>
  <pds-link slot="actions" variant="plain" href="#">Link</pds-link>
  <pds-link slot="actions" variant="plain" href="#">Link</pds-link>
</pds-alert>`;

export const Default = BaseTemplate.bind();
Default.args = {
  componentId: 'default-alert',
  variant: 'default',
  heading: 'Default alert heading',
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
  small: false,
  dismissible: false,
};

export const Small = BaseTemplate.bind();
Small.args = {
  componentId: 'small-alert',
  variant: 'default',
  heading: 'Small alert heading',
  description:'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  small: true,
  dismissible: true,
};

export const Actions = ActionsTemplate.bind();
Actions.args = {
  componentId: 'actions-alert',
  variant: 'default',
  heading: 'Alert with actions',
  description: 'This alert includes action button and link in the actions slot',
  small: false,
  dismissible: true,
};

export const SmallActions = SmallActionsTemplate.bind();
SmallActions.args = {
  componentId: 'small-actions-alert',
  variant: 'default',
  heading: 'Small alert with actions',
  description: 'This small alert has an inline action link which is displayed on the same line as the description.',
  small: true,
  dismissible: false,
};

export const Dismissible = BaseTemplate.bind();
Dismissible.args = {
  componentId: 'dismissible-alert',
  variant: 'success',
  heading: 'Dismissible alert',
  description: 'This alert can be dismissed by the user.',
  small: false,
  dismissible: true,
};
