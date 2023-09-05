import { html } from 'lit';
import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';
import { withActions } from '@storybook/addon-actions/decorator';

export default {
  argTypes: extractArgTypes('pds-tooltip'),
  component: 'pds-tooltip',
  decorators: [withActions],
  parameters: {
    actions: {
      handles: ['mouseEnter', 'pdsTooltipShow', 'mouseLeave', 'pdsTooltipHide'],
    },
  },
  title: 'components/Tooltip'
}

const defaultParameters = {
  docs: {
    disable: true
  }
};

const BaseTemplate = (args) => html`
  <pds-tooltip content=${args.content} has-arrow=${args.hasArrow} placement=${args.placement}>${args.slot}</pds-tooltip>`;

const HTMLContentTemplate = (args) => html`
  <pds-tooltip has-arrow=${args.hasArrow} placement=${args.placement} html-content=${args.htmlContent}>
    <div slot="content">
      <p><strong>This is a tooltip</strong></p>
      <p>Tooltips are used to describe or identify an element. In most scenarios, tooltips help the user understand the meaning, function or alt-text of an element.</p>
    </div>
    <pds-button variant="secondary">Hover</pds-button>
  </pds-tooltip>`;

const PositionTemplate = (args) => html`
  <div class="demo-container" style="min-height: 50vh; width: 100%; display: flex; align-items: center; justify-content: center;">
    <div class="position-demo-grid">
      <div class="position-demo-grid-item">
        <pds-tooltip content="content 2" has-arrow=${args.hasArrow} placement="top-start" opened=${args.opened}>
          <pds-button variant="accent">t</pds-button>
        </pds-tooltip>
        <pds-tooltip content="content 2" has-arrow=${args.hasArrow} placement="top" opened=${args.opened}>
          <pds-button variant="accent">t</pds-button>
        </pds-tooltip>
        <pds-tooltip content="content 3" has-arrow=${args.hasArrow} placement="top-end" opened=${args.opened}>
          <pds-button variant="accent">te</pds-button>
        </pds-tooltip>
        </div>
        <div class="position-demo-grid-item">
          <pds-tooltip content="content 1" has-arrow=${args.hasArrow} placement="left-start" opened=${args.opened}>
            <pds-button variant="accent">ls</pds-button>
          </pds-tooltip>
          <pds-tooltip content="content 2" has-arrow=${args.hasArrow} placement="left" opened=${args.opened}>
            <pds-button variant="accent">l</pds-button>
          </pds-tooltip>
          <pds-tooltip content="content 3" has-arrow=${args.hasArrow} placement="left-end" opened=${args.opened}>
            <pds-button variant="accent">le</pds-button>
          </pds-tooltip>
        </div>
        <div class="position-demo-grid-item">
          <pds-tooltip content="content 1" has-arrow=${args.hasArrow} placement="bottom-start" opened=${args.opened}>
            <pds-button variant="accent">bs</pds-button>
          </pds-tooltip>
          <pds-tooltip content="content 2" has-arrow=${args.hasArrow} placement="bottom" opened=${args.opened}>
            <pds-button variant="accent">b</pds-button>
          </pds-tooltip>
          <pds-tooltip content="content 3" has-arrow=${args.hasArrow} placement="bottom-end" opened=${args.opened}>
            <pds-button variant="accent">be</pds-button>
          </pds-tooltip>
        </div>
        <div class="position-demo-grid-item">
          <pds-tooltip content="content 1" has-arrow=${args.hasArrow} placement="right-start" opened=${args.opened}>
            <pds-button variant="accent">rs</pds-button>
          </pds-tooltip>
          <pds-tooltip content="content 2" has-arrow=${args.hasArrow} placement="right" opened=${args.opened}>
            <pds-button variant="accent">r</pds-button>
          </pds-tooltip>
          <pds-tooltip content="content 3" has-arrow=${args.hasArrow} placement="right-end" opened=${args.opened}>
            <pds-button variant="accent">re</pds-button>
          </pds-tooltip>
      </div>
    </div>
  </div>`;

export const Default = BaseTemplate.bind({});
Default.args = {
  content: "The tooltip content",
  placement: "right",
  slot: "target text"
};
Default.parameters = { ...defaultParameters };

export const HTMLContent = HTMLContentTemplate.bind({});
HTMLContent.args = {
  htmlContent: true,
  placement: "bottom-start",
};
HTMLContent.parameters = { ...defaultParameters }


export const Positioning = PositionTemplate.bind({});
Positioning.args = {
  content: "Trigger",
};
Positioning.parameters = { ...defaultParameters }

export const NoArrow = BaseTemplate.bind({});
NoArrow.args = {
  content: "The tooltip content",
  hasArrow: false,
  placement: "bottom-start",
  slot: "target text"
};
NoArrow.parameters = { ...defaultParameters }
