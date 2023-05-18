import { html } from 'lit-html';

const BaseTemplate = (args) => html`
<sage-chip
  color="${args.color}"
  label="${args.label}"
  status="${args.status}"
  variant="${args.variant}"
/>`;

const defaultParameters = { docs: { disable: true } };

export const Default = BaseTemplate.bind();
Default.args = {
  variant: "text",
  color: "draft",
}
Default.parameters = { ...defaultParameters };
