import { html } from 'lit';


export default {
  argTypes: {
    sentiment: {
      control: { type: 'select' },
      options: ['accent', 'brand', 'danger', 'info', 'neutral', 'success', 'warning'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    variant: {
      control: { type: 'select' },
      options: ['text', 'tag', 'dropdown'],
    },
  },
  component: 'pds-chip',
  parameters: {},
  title: 'components/Chip'
}

const BaseTemplate = (args) => html`
<pds-chip
  component-id="${args.componentId}"
  ?dot=${args.dot}
  icon="${args.icon}"
  size="${args.size}"
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
  size: "md",
  sentiment: "neutral",
  slot: "label",
  variant: "text",
}

export const Sentiment = BaseTemplate.bind();
Sentiment.args = {
  dot: false,
  size: "md",
  icon: "",
  sentiment: "success",
  slot: "label",
  variant: "text",
}

export const Dots = BaseTemplate.bind();
Dots.args = {
  dot: true,
  icon: "",
  size: "md",
  sentiment: "neutral",
  slot: "label",
  variant: "text",
}

export const Icon = BaseTemplate.bind();
Icon.args = {
  dot: false,
  icon: "check",
  size: "md",
  sentiment: "neutral",
  slot: "label",
  variant: "text",
}

export const Dropdown = BaseTemplate.bind();
Dropdown.args = {
  dot: false,
  icon: "",
  size: "md",
  sentiment: "neutral",
  slot: "label",
  variant: "dropdown",
}

export const Tag = BaseTemplate.bind();
Tag.args = {
  dot: false,
  icon: "",
  size: "md",
  sentiment: "neutral",
  slot: "label",
  variant: "tag",
}

export const Small = BaseTemplate.bind();
Small.args = {
  dot: false,
  icon: "",
  size: "sm",
  sentiment: "neutral",
  slot: "label",
  variant: "text",
}

export const Large = BaseTemplate.bind();
Large.args = {
  dot: false,
  icon: "",
  size: "lg",
  sentiment: "neutral",
  slot: "label",
  variant: "text",
}

export const TagWithRemoveUrl = BaseTemplate.bind();
TagWithRemoveUrl.args = {
  dot: false,
  icon: "",
  size: "md",
  sentiment: "neutral",
  slot: "Filter Applied",
  variant: "tag",
  removeUrl: "/filters/remove/1",
}

export const TagWithHttpMethod = BaseTemplate.bind();
TagWithHttpMethod.args = {
  dot: false,
  icon: "",
  size: "md",
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
  size: "md",
  sentiment: "info",
  slot: "Clear Filters (New Tab)",
  variant: "tag",
  removeUrl: "/clear-filters",
  removeTarget: "_blank",
}
