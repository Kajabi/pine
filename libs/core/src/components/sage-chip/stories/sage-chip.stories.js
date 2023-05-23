import { html } from 'lit-html';

const BaseTemplate = (args) => html`
<sage-chip
  dot="${args.dot}"
  label="${args.label}"
  large="${args.large}"
  sentiment="${args.sentiment}"
  variant="${args.variant}"
/>`;

const defaultParameters = { docs: { disable: true } };

export const Default = BaseTemplate.bind();
Default.args = {
  sentiment: "neutral",
  dot: false,
  label: "label",
  large: false,
  variant: "text",
}
Default.parameters = { ...defaultParameters };

export const Sentiment = BaseTemplate.bind();
Sentiment.args = {
  sentiment: "success",
  dot: false,
  label: "label",
  large: false,
  variant: "text",
}
Sentiment.parameters = { ...defaultParameters };

export const Dots = BaseTemplate.bind();
Dots.args = {
  sentiment: "neutral",
  dot: true,
  label: "label",
  large: false,
  variant: "text",
}
Dots.parameters = { ...defaultParameters };

export const Dropdown = BaseTemplate.bind();
Dropdown.args = {
  sentiment: "neutral",
  dot: false,
  label: "label",
  large: false,
  variant: "dropdown",
}
Dropdown.parameters = { ...defaultParameters };

export const Tag = BaseTemplate.bind();
Tag.args = {
  sentiment: "neutral",
  dot: false,
  label: "label",
  large: false,
  variant: "tag",
}
Tag.parameters = { ...defaultParameters };

export const Large = BaseTemplate.bind();
Large.args = {
  sentiment: "neutral",
  dot: false,
  label: "label",
  large: true,
  variant: "tag",
}
Large.parameters = { ...defaultParameters };
