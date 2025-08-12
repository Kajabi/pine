import { html } from 'lit';
import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';
import { withActions } from '@storybook/addon-actions/decorator';

export default {
  argTypes: extractArgTypes('pds-chip'),
  component: 'pds-chip',
  decorators: [withActions],
  parameters: {
    actions: {
      handles: ['pdsTagCloseClick'],
    },
  },
  title: 'components/Chip'
}

const BaseTemplate = (args) => html`
<pds-chip
  component-id="${args.componentId}"
  .dot=${args.dot}
  icon="${args.icon}"
  .large=${args.large}
  sentiment="${args.sentiment}"
  variant="${args.variant}"
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
