import { html } from 'lit';
import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';
import { withActions } from '@storybook/addon-actions/decorator';

export default {
  argTypes: extractArgTypes('pds-popover'),
  component: 'pds-popover',
  decorators: [withActions],
  parameters: {
    actions: {
      handles: ['pdsPopoverShow', 'pdsPopoverHide'],
    },
  },
  title: 'components/Popover'
}

const BaseTemplate = (args) => html`
  <pds-popover has-arrow=${args.hasArrow} placement=${args.placement}>
		${args.slot}
  </pds-popover>`;

export const Default = BaseTemplate.bind({});
Default.args = {
	hasArrow: true,
	placement: "right-start",
	slot: html`
		<div slot="trigger">
			<pds-button variant="secondary">Popover</pds-button>
		</div>
		<div slot="content">
			<p>This is a Popover</p>
		</div>
	`
};