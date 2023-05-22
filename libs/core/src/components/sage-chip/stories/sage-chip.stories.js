import { html } from 'lit-html';

const BaseTemplate = (args) => html`
<sage-chip
  color="${args.color}"
  label="${args.label}"
  large="${args.large}"
  dot="${args.dot}"
  variant="${args.variant}"
/>`;

const defaultParameters = { docs: { disable: true } };

export const Default = BaseTemplate.bind();
Default.args = {
  color: "neutral",
  dot: false,
  label: "label",
  variant: "text",
}
Default.parameters = { ...defaultParameters };


export const Colors = BaseTemplate.bind();
Colors.args = {
  color: "success",
  dot: false,
  label: "label",
  variant: "text",
}
Colors.parameters = { ...defaultParameters };


export const Dots = BaseTemplate.bind();
Dots.args = {
  color: "neutral",
  dot: true,
  label: "label",
  variant: "text",
}
Dots.parameters = { ...defaultParameters };

export const Dropdown = BaseTemplate.bind();
Dropdown.args = {
  color: "neutral",
  dot: false,
  label: "label",
  variant: "dropdown",
}
Dropdown.parameters = { ...defaultParameters };

export const Tag = BaseTemplate.bind();
Tag.args = {
  color: "neutral",
  dot: false,
  label: "label",
  variant: "tag",
}
Tag.parameters = { ...defaultParameters };

export const Large = BaseTemplate.bind();
Large.args = {
  color: "neutral",
  dot: false,
  label: "label",
  large: true,
  variant: "tag",
}
Large.parameters = { ...defaultParameters };
