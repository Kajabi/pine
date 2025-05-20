import { html } from 'lit';
import { withActions } from '@storybook/addon-actions/decorator';

import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';

export default {
  args: {
    variant: 'default',
    componentId: 'default-banner',
  },
  argTypes: extractArgTypes('pds-banner'),
  component: 'pds-banner',
  decorators: [withActions],
  title: 'components/Banner',
  parameters: {
    actions: {
      handles: ['pdsBannerActivated', 'pdsDismiss'],
    }
  }
}

const BaseTemplate = (args) => html`
<div style="margin-block-start: var(--pine-dimension-xl);">
  <pds-banner
    component-id="${args.componentId}"
    variant="${args.variant}"
    dismissable="${args.dismissable}"
  >
    <span slot="text">This might be a Banner component. Maybe.</span>
    <pds-link slot="actions" href="#">Link</pds-link>
  </pds-banner>
  <pds-button @click=${() => document.querySelector(`#${args.componentId}`).toggleAttribute('active')}>Toggle Banner</pds-button>
</div>`;

export const Default = BaseTemplate.bind();

export const Secondary = BaseTemplate.bind();
Secondary.args = {
  componentId: 'secondary-banner',
  variant: 'secondary',
};

export const Warning = BaseTemplate.bind();
Warning.args = {
  componentId: 'warning-banner',
  variant: 'warning',
};

export const Danger = BaseTemplate.bind();
Danger.args = {
  componentId: 'danger-banner',
  variant: 'danger',
};

export const Dismissable = BaseTemplate.bind();
Dismissable.args = {
  componentId: 'dismissable-banner',
  variant: 'default',
  dismissable: true,
};
