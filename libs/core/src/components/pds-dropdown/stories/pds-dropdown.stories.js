import { html } from 'lit';
import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';

export default {
  argTypes: extractArgTypes('pds-dropdown'),
  component: 'pds-dropdown',
  title: 'components/Dropdown'
}

const BaseTemplate = (args) => html`
  <pds-dropdown
    component-id=${args.componentId}
  >
    <pds-button slot="trigger">My Trigger</pds-button>
    <h1>Hello!!!!</h1>
  </pds-dropdown>`;


export const Default = BaseTemplate.bind();
Default.args = {
  componentId: 'base-dropdown',
}
