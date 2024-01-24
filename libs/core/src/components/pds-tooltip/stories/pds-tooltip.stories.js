import { html } from 'lit';
import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';
import { withActions } from '@storybook/addon-actions/decorator';

export default {
  argTypes: extractArgTypes('pds-tooltip'),
  component: 'pds-tooltip',
  decorators: [withActions],
  parameters: {
    actions: {
      handles: ['mouseEnter', 'pdsTooltipShow', 'mouseLeave', 'pdsTooltipHide'],
    },
  },
  title: 'components/Tooltip'
}

const defaultParameters = {
  docs: {
    disable: true
  }
};

const BaseTemplate = (args) => html`
  <pds-tooltip content=${args.content} has-arrow=${args.hasArrow} hoisted=${args.hoisted} opened=${args.opened} placement=${args.placement}>${args.slot}</pds-tooltip>`;

const HTMLContentTemplate = (args) => html`
  <pds-tooltip has-arrow=${args.hasArrow} placement=${args.placement} hoisted=${args.hoisted} opened=${args.opened} html-content=${args.htmlContent}>
    <div slot="content">
      <p><strong>This is a tooltip</strong></p>
      <p>Tooltips are used to describe or identify an element. In most scenarios, tooltips help the user understand the meaning, function or alt-text of an element.</p>
    </div>
    <pds-button variant="secondary">Hover</pds-button>
  </pds-tooltip>`;

export const Default = BaseTemplate.bind({});
Default.args = {
  content: "The tooltip content",
  placement: "right",
  slot: "target text"
};
Default.parameters = { ...defaultParameters };

export const HTMLContent = HTMLContentTemplate.bind({});
HTMLContent.args = {
  htmlContent: true,
  placement: "bottom-start",
};
HTMLContent.parameters = { ...defaultParameters }

export const NoArrow = BaseTemplate.bind({});
NoArrow.args = {
  content: "The tooltip content",
  hasArrow: false,
  placement: "bottom-start",
  slot: "target text"
};
NoArrow.parameters = { ...defaultParameters }
