import { html } from 'lit';
import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';
import { withActions } from '@storybook/addon-actions/decorator';

export default {
	argTypes: extractArgTypes('pds-popover'),
	component: 'pds-popover',
	decorators: [withActions],
	parameters: {
		actions: {
			handles: ['mouseEnter', 'mouseLeave', 'hidePdsPopover', 'showPdsPopover'],
		},
	},
	title: 'components/Popover'
}

const BaseTemplate = (args) => html`
<pds-popover component-id=${args.componentId}  popover-type=${args.popoverType} popover-target-action=${args.popoverTargetAction} text=${args.text} max-width=${args.maxWidth} placement=${args.placement}>
	${args.slot}
</pds-popover>
`;

export const Default = BaseTemplate.bind({});
Default.args = {
	componentId: 'popover-1',
  placement: "right",
	popoverTargetAction: "show",
  text: "Show popover",
	slot: html`<p>Popover content</p>
    <p>Popover content</p>`
};

export const Toggle = BaseTemplate.bind({});
Toggle.args = {
	componentId: 'popover-1',
  placement: "right",
	popoverType: "manual",
	popoverTargetAction: "toggle",
  text: "Show popover",
	slot: html`<p>Popover content</p>
    <p>Popover content</p>`
};
