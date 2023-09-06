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

const ListTemplate = (args) => html`
  <pds-popover options={['sOption 1', 'Option 2', 'Option 3']}>
    <pds-button variant="secondary">Click</pds-button>
    <div slot="content">
      <pds-list-options>
        <pds-list-option-item>Item 1</pds-list-option-item>
        <pds-list-option-item>Item 2</pds-list-option-item>
        <pds-list-option-item>Item 3</pds-list-option-item>
      </pds-list-options>
    </div>
  </pds-popover>
`;

export const Default = BaseTemplate.bind({});
Default.args = {
  htmlContent: true,
  placement: "bottom-start",
};

export const Options = ListTemplate.bind({});
Options.args = {
  htmlContent: true,
  placement: "bottom-start",
};

