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
    <div slot="content">
      <p><strong>This is a popover</strong></p>
      <p><strong>This is a popover</strong></p>
    </div>
    <pds-button variant="secondary">Click</pds-button>
  </pds-popover>`;

export const Default = BaseTemplate.bind({});
Default.args = {
  htmlContent: true,
  placement: "bottom-start",
};
