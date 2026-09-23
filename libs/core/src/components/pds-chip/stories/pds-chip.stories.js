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

// A long label truncates only when both the host and the slotted label opt
// in: max-width/min-width: 0 on the host (pds-chip has no width of its own),
// and overflow/text-overflow/white-space/min-width: 0 on the slotted node
// (pds-chip only owns markup up to the default slot). Neither alone is
// enough — see pds-chip.scss for why .pds-chip__label needs min-width: 0
// to let either work at all.
export const TruncatedLabel = () => html`
<pds-chip variant="tag" style="max-width: 200px; min-width: 0;">
  <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; min-width: 0;">
    A very long label that would otherwise overflow the chip
  </span>
</pds-chip>`;
