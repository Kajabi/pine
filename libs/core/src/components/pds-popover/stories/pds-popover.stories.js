import { html } from 'lit';
import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';
import { withActions } from '@storybook/addon-actions/decorator';

export default {
  argTypes: extractArgTypes('pds-popover'),
  component: 'pds-popover',
  decorators: [withActions],
  parameters: {
    actions: {
      handles: ['mouseEnter', 'pdsPopoverShow', 'mouseLeave', 'pdsPopoverHide'],
    },
  },
  title: 'components/Popover'
}

const BaseTemplate = (args) => html`
  <pds-popover has-arrow=${args.hasArrow} placement=${args.placement} html-content=${args.htmlContent}>
    <div slot="trigger">
      <pds-button variant="accent">Click</pds-button>
    </div>
    <div slot="content">
      <p><strong>This is a Popover</strong></p>
    </div>
  </pds-popover>`;

export const Default = BaseTemplate.bind({});
Default.args = {
  content: "The popover content",
  placement: "right",
  slot: "target text"
};