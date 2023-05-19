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
  color: "neutral",
  label: "label",
  status: false,
  variant: "text",
}
Default.parameters = { ...defaultParameters };


export const Colors = BaseTemplate.bind();
Colors.args = {
  color: "success",
  label: "label",
  status: false,
  variant: "text",
}
Colors.parameters = { ...defaultParameters };


export const Status = BaseTemplate.bind();
Status.args = {
  color: "neutral",
  label: "label",
  status: true,
  variant: "text",
}
Status.parameters = { ...defaultParameters };


export const Dropdown = BaseTemplate.bind();
Dropdown.args = {
  color: "neutral",
  label: "label",
  status: false,
  variant: "dropdown",
}
Dropdown.parameters = { ...defaultParameters };

export const Tag = BaseTemplate.bind();
Tag.args = {
  color: "neutral",
  label: "label",
  status: false,
  variant: "tag",
}
Tag.parameters = { ...defaultParameters };
