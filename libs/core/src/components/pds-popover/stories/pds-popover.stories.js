import { html } from 'lit';
import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';
import { withActions } from '@storybook/addon-actions/decorator';

export default {
	argTypes: extractArgTypes('pds-popover'),
	component: 'pds-popover',
	decorators: [withActions],
	parameters: {
		actions: {
			handles: ['mouseEnter', 'mouseLeave'],
		},
	},
	title: 'components/Popover'
}

const BaseTemplate = (args) => html`
<pds-popover has-arrow=${args.hasArrow} max-width=${args.maxWidth} placement=${args.placement} html-content=${args.htmlContent}>
	<div slot="trigger">
		<pds-button variant="accent">Click</pds-button>
	</div>
	<div slot="content">
		<p><strong>This is a popover</strong></p>
		<p>Popovers are used to describe or identify an element. In most scenarios, popovers help the user understand the meaning, function or alt-text of an element.</p>
	</div>
</pds-popover>`;

export const Default = BaseTemplate.bind({});
Default.args = {
  placement: "bottom-start",
};