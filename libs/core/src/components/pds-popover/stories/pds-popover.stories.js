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
<pds-popover component-id=${args.componentId}  popover-type=${args.popoverType} text=${args.text} has-arrow=${args.hasArrow} max-width=${args.maxWidth} placement=${args.placement} html-content=${args.htmlContent}>
	${args.slot}
</pds-popover>
`;

export const Default = BaseTemplate.bind({});
Default.args = {
	componentId: 'popover-1',
  placement: "right",
  text: "Show popover",
	slot: html`<p>Popover content</p>
    <p>Popover content</p>`
};

export const Manual = BaseTemplate.bind({});
Manual.args = {
	componentId: 'popover-1',
  placement: "right",
	popoverType: "manual",
  text: "Show popover",
	slot: html`<p>Popover content</p>
    <p>Popover content</p>`
};