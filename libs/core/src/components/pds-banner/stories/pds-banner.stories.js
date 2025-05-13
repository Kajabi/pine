import { html } from 'lit';

import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';

export default {
  args: {
    variant: 'default',
  },
  argTypes: extractArgTypes('pds-banner'),
  component: 'pds-banner',
  title: 'components/Banner',
}

const BaseTemplate = (args) => html`
<pds-banner
  component-id="${args.componentId}"
  variant="${args.variant}"
>
  <span slot="text">This might be a Banner component. Maybe.</span>
  <pds-link slot="actions" href="#">Link</pds-link>
</pds-banner>`;

export const Default = BaseTemplate.bind();

export const Secondary = BaseTemplate.bind();
Secondary.args = {
  variant: 'secondary',
};

export const Warning = BaseTemplate.bind();
Warning.args = {
  variant: 'warning',
};

export const Danger = BaseTemplate.bind();
Danger.args = {
  variant: 'danger',
};
