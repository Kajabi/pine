import { html } from 'lit';

export default {
  component: 'pds-divider',
  title: 'components/Divider'
}

const BaseTemplate = (args) => html`
  <pds-divider
    component-id=${args.componentId}
    offset=${args.offset}
    vertical=${args.vertical}
  />`;

export const Default = BaseTemplate.bind();
Default.args = {
  vertical: false,
}

export const Vertical = BaseTemplate.bind();
Vertical.args = {
  vertical: true,
}
