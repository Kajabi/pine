import { html } from 'lit';
import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';
import { withActions } from '@storybook/addon-actions/decorator';

export default {
  argTypes: extractArgTypes('pds-chip'),
  component: 'pds-chip',
  decorators: [withActions],
  parameters: {
    actions: {
      handles: ['onclick', 'pdsTagCloseClick'],
    },
  },
  title: 'components/Chip'
}

const BaseTemplate = (args) => html`
<pds-chip
  component-id="${args.componentId}"
  dot="${args.dot}"
  label="${args.label}"
  large="${args.large}"
  sentiment="${args.sentiment}"
  variant="${args.variant}"
/>`;

export const Default = BaseTemplate.bind();
Default.args = {
  dot: false,
  label: "label",
  large: false,
  sentiment: "neutral",
  variant: "text",
}

export const Sentiment = BaseTemplate.bind();
Sentiment.args = {
  dot: false,
  label: "label",
  large: false,
  sentiment: "success",
  variant: "text",
}

export const Dots = BaseTemplate.bind();
Dots.args = {
  dot: true,
  label: "label",
  large: false,
  sentiment: "neutral",
  variant: "text",
}

export const Dropdown = BaseTemplate.bind();
Dropdown.args = {
  dot: false,
  label: "label",
  large: false,
  sentiment: "neutral",
  variant: "dropdown",
}

export const Tag = BaseTemplate.bind();
Tag.args = {
  dot: false,
  label: "label",
  large: false,
  sentiment: "neutral",
  variant: "tag",
}

export const Large = BaseTemplate.bind();
Large.args = {
  dot: false,
  label: "label",
  large: true,
  sentiment: "neutral",
  variant: "tag",
}
