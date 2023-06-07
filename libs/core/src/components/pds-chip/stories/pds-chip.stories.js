import { html } from 'lit-html';

const BaseTemplate = (args) => html`
<pds-chip
  dot="${args.dot}"
  label="${args.label}"
  large="${args.large}"
  sentiment="${args.sentiment}"
  variant="${args.variant}"
/>`;

const defaultParameters = { docs: { disable: true } };

export const Default = BaseTemplate.bind();
Default.args = {
  dot: false,
  label: "label",
  large: false,
  sentiment: "neutral",
  variant: "text",
}
Default.parameters = { ...defaultParameters };

export const Sentiment = BaseTemplate.bind();
Sentiment.args = {
  dot: false,
  label: "label",
  large: false,
  sentiment: "success",
  variant: "text",
}
Sentiment.parameters = { ...defaultParameters };

export const Dots = BaseTemplate.bind();
Dots.args = {
  dot: true,
  label: "label",
  large: false,
  sentiment: "neutral",
  variant: "text",
}
Dots.parameters = { ...defaultParameters };

export const Dropdown = BaseTemplate.bind();
Dropdown.args = {
  dot: false,
  label: "label",
  large: false,
  sentiment: "neutral",
  variant: "dropdown",
}
Dropdown.parameters = { ...defaultParameters };

export const Tag = BaseTemplate.bind();
Tag.args = {
  dot: false,
  label: "label",
  large: false,
  sentiment: "neutral",
  variant: "tag",
}
Tag.parameters = { ...defaultParameters };

export const Large = BaseTemplate.bind();
Large.args = {
  dot: false,
  label: "label",
  large: true,
  sentiment: "neutral",
  variant: "tag",
}
Large.parameters = { ...defaultParameters };
