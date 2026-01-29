import { html } from 'lit';


export default {

  component: 'pds-chip',
  parameters: {},
  title: 'components/Chip'
}

const BaseTemplate = (args) => html`
<pds-chip
  component-id="${args.componentId}"
  ?dot=${args.dot}
  icon="${args.icon}"
  ?large=${args.large}
  sentiment="${args.sentiment}"
  variant="${args.variant}"
  remove-url="${args.removeUrl}"
  remove-http-method="${args.removeHttpMethod}"
  remove-target="${args.removeTarget}"
>
  ${args.slot}
</pds-chip>`;

export const Default = BaseTemplate.bind();
Default.args = {
  dot: false,
  icon: "",
  large: false,
  sentiment: "neutral",
  slot: "label",
  variant: "text",
}

export const Sentiment = BaseTemplate.bind();
Sentiment.args = {
  dot: false,
  large: false,
  icon: "",
  sentiment: "success",
  slot: "label",
  variant: "text",
}

export const Dots = BaseTemplate.bind();
Dots.args = {
  dot: true,
  icon: "",
  large: false,
  sentiment: "neutral",
  slot: "label",
  variant: "text",
}

export const Icon = BaseTemplate.bind();
Icon.args = {
  dot: false,
  icon: "check",
  large: false,
  sentiment: "neutral",
  slot: "label",
  variant: "text",
}

export const Dropdown = BaseTemplate.bind();
Dropdown.args = {
  dot: false,
  icon: "",
  large: false,
  sentiment: "neutral",
  slot: "label",
  variant: "dropdown",
}

export const Tag = BaseTemplate.bind();
Tag.args = {
  dot: false,
  icon: "",
  large: false,
  sentiment: "neutral",
  slot: "label",
  variant: "tag",
}

export const Large = BaseTemplate.bind();
Large.args = {
  dot: false,
  icon: "",
  large: true,
  sentiment: "neutral",
  slot: "label",
  variant: "tag",
}

export const TagWithRemoveUrl = BaseTemplate.bind();
TagWithRemoveUrl.args = {
  dot: false,
  icon: "",
  large: false,
  sentiment: "neutral",
  slot: "Filter Applied",
  variant: "tag",
  removeUrl: "/filters/remove/1",
}

export const TagWithHttpMethod = BaseTemplate.bind();
TagWithHttpMethod.args = {
  dot: false,
  icon: "",
  large: false,
  sentiment: "danger",
  slot: "Delete Me",
  variant: "tag",
  removeUrl: "/tags/1",
  removeHttpMethod: "delete",
}

export const TagWithRemoveTarget = BaseTemplate.bind();
TagWithRemoveTarget.args = {
  dot: false,
  icon: "",
  large: false,
  sentiment: "info",
  slot: "Clear Filters (New Tab)",
  variant: "tag",
  removeUrl: "/clear-filters",
  removeTarget: "_blank",
}
