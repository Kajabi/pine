import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';
import { withActions } from '@storybook/addon-actions/decorator';

export default {
	argTypes: extractArgTypes('pds-popover'),
	args: {
		popoverTargetAction: 'show',
		popoverType: 'auto',
	},
	component: 'pds-popover',
	decorators: [withActions],
	parameters: {
		actions: {
			handles: ['pdsPopoverOpen', 'pdsPopoverClose'],
		},
	},
	title: 'components/Popover'
}

const BaseTemplate = (args) => html`
<pds-popover component-id=${args.componentId}  popover-type=${args.popoverType} popover-target-action=${args.popoverTargetAction} text=${args.text} max-width=${args.maxWidth} placement=${args.placement}>
	${unsafeHTML(args.slot)}
</pds-popover>
`;

export const Default = BaseTemplate.bind({});
Default.args = {
	componentId: 'popover-1',
  placement: "right",
  text: "Show popover",
	slot: "<p>Popover content</p><p>Popover content</p>"
};

export const Toggle = BaseTemplate.bind({});
Toggle.args = {
	componentId: 'popover-1',
  placement: "bottom",
	popoverType: "manual",
	popoverTargetAction: "toggle",
  text: "Toggle popover",
	slot: "<p>Popover content</p><p>Popover content</p>"
};
