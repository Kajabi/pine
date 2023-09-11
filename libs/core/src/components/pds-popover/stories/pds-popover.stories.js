import { html } from 'lit';
import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';
import { withActions } from '@storybook/addon-actions/decorator';

export default {
  argTypes: extractArgTypes('pds-popover'),
  args: {
    hasArrow: false
  },
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
    <div slot="content">
      <p>Pastrami chuck leberkas, swine biltong tail fatback jowl landjaeger ground round strip steak t-bone cow beef. Filet mignon bresaola pastrami, beef salami hamburger short ribs. Strip steak picanha pork loin tri-tip, prosciutto frankfurter turducken cupim sausage corned beef spare ribs sirloin fatback t-bone bacon. Boudin pork chop capicola short ribs flank rump. Fatback andouille chuck, pork venison t-bone bacon cupim turducken brisket sausage pork loin. Shank buffalo sirloin swine shoulder sausage prosciutto fatback.</p>
      <div>
        <pds-button>Get Started</pds-button>
      </div>
    </div>
    <pds-button variant="secondary">Help</pds-button>
  </pds-popover>`;

export const Default = BaseTemplate.bind({});
Default.args = {
  hasArrow: false,
  htmlContent: true,
  placement: "bottom-start",
};
