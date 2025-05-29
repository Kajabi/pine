import { html } from 'lit';
import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';
import { withActions } from '@storybook/addon-actions/decorator';

export default {
  argTypes: extractArgTypes('pds-toast'),
  component: 'pds-toast',
  title: 'components/Toast',
  decorators: [withActions],
  parameters: {
    actions: {
      handles: [
        'pdsToastDismissed'
      ],
    },
  },
}

const BaseTemplate = (args) => html`
<pds-toast
  .dismissible="${args.dismissible}"
  component-id="${args.componentId}"
  duration="${args.duration}"
  icon="${args.icon || ''}"
  type="${args.type}"
>
  ${args.content || ''}
</pds-toast>`;

const WithLinkTemplate = (args) => html`
<pds-toast
  .dismissible="${args.dismissible}"
  component-id="${args.componentId}"
  duration="${args.duration}"
  icon="${args.icon || ''}"
  type="${args.type}"
>
  New update available. <a href="#">Learn more</a>
</pds-toast>`;

export const Default = BaseTemplate.bind();
Default.args = {
  componentId: 'toast-default',
  content: 'This is a default toast message',
  dismissible: true,
  duration: 0, // Set to 0 for demo purposes
  type: 'default',
};

export const Danger = BaseTemplate.bind();
Danger.args = {
  componentId: 'toast-danger',
  content: 'An error occurred. Please try again.',
  dismissible: true,
  duration: 0,
  type: 'danger',
};

export const Loading = BaseTemplate.bind();
Loading.args = {
  componentId: 'toast-loading',
  content: 'Processing your request...',
  dismissible: false,
  duration: 0,
  type: 'loading',
};

export const WithIcon = BaseTemplate.bind();
WithIcon.args = {
  componentId: 'toast-with-icon',
  content: 'Successfully saved!',
  dismissible: true,
  duration: 0,
  icon: 'check-circle-filled',
  type: 'default',
};

export const WithLink = WithLinkTemplate.bind();
WithLink.args = {
  componentId: 'toast-with-link',
  dismissible: true,
  duration: 0,
  type: 'default',
};

export const NonDismissible = BaseTemplate.bind();
NonDismissible.args = {
  componentId: 'toast-non-dismissible',
  content: 'This toast cannot be manually dismissed and will auto-dismiss after 4.5 seconds',
  dismissible: false,
  duration: 4500,
  type: 'default',
};

export const AutoDismiss = BaseTemplate.bind();
AutoDismiss.args = {
  componentId: 'toast-auto-dismiss',
  type: 'default',
  content: 'This toast will auto-dismiss after 2 seconds',
  dismissible: true,
  duration: 2000
};

