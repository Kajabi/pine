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

}
Default.parameters = { ...defaultParameters };


export const Colors = BaseTemplate.bind();
Colors.args = {
  variant: "text",
  color: "draft",
}
Colors.parameters = { ...defaultParameters };


export const Status = BaseTemplate.bind();
Status.args = {
  variant: "text",
  color: "draft",
  status: true,
}
Status.parameters = { ...defaultParameters };
