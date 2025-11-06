import { html } from 'lit';
import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';
import { withActions } from '@storybook/addon-actions/decorator';

export default {
	argTypes: extractArgTypes('pds-popover'),
	args: {
		popoverTargetAction: 'toggle',
		popoverType: 'auto',
		placement: 'bottom-start',
		componentId: 'popover-playground',
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
	<pds-popover
		component-id=${args.componentId}
		popover-target-action=${args.popoverTargetAction}
		popover-type=${args.popoverType}
		placement=${args.placement}
		.maxWidth=${args.maxWidth}
	>
		<pds-button slot="trigger">Show popover</pds-button>
		<p>This is popover content that can be configured using the controls below.</p>
	</pds-popover>
`;

export const Default = BaseTemplate.bind({});

export const Toggle = (args) => html`
	<pds-popover
		component-id=${args.componentId || 'popover-toggle'}
		popover-target-action=${args.popoverTargetAction}
		popover-type=${args.popoverType}
		placement=${args.placement}
		.maxWidth=${args.maxWidth}
	>
		<pds-button slot="trigger">Toggle popover</pds-button>
		<p>Click the trigger again to close this popover.</p>
	</pds-popover>
`;
Toggle.args = {
	componentId: 'popover-toggle'
};

export const WithContent = (args) => html`
	<pds-popover
		component-id=${args.componentId || 'popover-rich'}
		popover-target-action=${args.popoverTargetAction}
		popover-type=${args.popoverType}
		placement=${args.placement}
		.maxWidth=${args.maxWidth}
	>
		<pds-button slot="trigger" variant="accent">Popover trigger</pds-button>
		<pds-box direction="column" gap="md" fit="true">
			<!-- Header with title and close button -->
			<pds-box direction="column" gap="xs">
				<pds-box display="flex" direction="row" justify-content="space-between" align-items="center" gap="300">
					<pds-text tag="h3" size="xl" weight="semibold">Popover Heading</pds-text>
					<pds-button
						variant="unstyled"
						icon-only
						onclick="document.getElementById('${args.componentId || 'popover-rich'}').hide()"
						aria-label="Close"
					>
						<pds-icon slot="start" name="remove"></pds-icon>
						Close
					</pds-button>
				</pds-box>
				<pds-text tag="p" size="sm" color="secondary">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</pds-text>
			</pds-box>

			<!-- Footer with buttons and page indicator -->
			<pds-box justify-content="space-between" align-items="center" gap="200">
				<pds-button variant="secondary" size="small">Previous</pds-button>
				<pds-text tag="span" size="sm" weight="medium" color="secondary">1 / 3</pds-text>
				<pds-button variant="primary" size="small">Next</pds-button>
			</pds-box>
		</pds-box>
	</pds-popover>
`;
WithContent.args = {
	componentId: 'popover-rich'
};
