import { html } from 'lit';


export default {

  component: 'pds-tooltip',
  parameters: {
    actions: {
      handles: [],
    },
  },
  title: 'components/Tooltip'
}

const BaseTemplate = (args) => html`
  <pds-tooltip content=${args.content} max-width=${args.maxWidth} ?has-arrow=${args.hasArrow} placement=${args.placement} ?opened=${args.opened}>${args.slot}</pds-tooltip>`;

const HTMLContentTemplate = (args) => html`
  <pds-tooltip ?has-arrow=${args.hasArrow} max-width=${args.maxWidth} placement=${args.placement} ?html-content=${args.htmlContent} ?opened=${args.opened}>
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
        <pds-tooltip content="content 2" ?has-arrow=${args.hasArrow} max-width=${args.maxWidth} placement="top-start" ?opened=${args.opened}>
          <pds-button variant="accent">t</pds-button>
        </pds-tooltip>
        <pds-tooltip content="content 2" ?has-arrow=${args.hasArrow} max-width=${args.maxWidth} placement="top" ?opened=${args.opened}>
          <pds-button variant="accent">t</pds-button>
        </pds-tooltip>
        <pds-tooltip content="content 3" ?has-arrow=${args.hasArrow} max-width=${args.maxWidth} placement="top-end" ?opened=${args.opened}>
          <pds-button variant="accent">te</pds-button>
        </pds-tooltip>
        </div>
        <div class="position-demo-grid-item">
          <pds-tooltip content="content 1" ?has-arrow=${args.hasArrow} max-width=${args.maxWidth} placement="left-start" ?opened=${args.opened}>
            <pds-button variant="accent">ls</pds-button>
          </pds-tooltip>
          <pds-tooltip content="content 2" ?has-arrow=${args.hasArrow} max-width=${args.maxWidth} placement="left" ?opened=${args.opened}>
            <pds-button variant="accent">l</pds-button>
          </pds-tooltip>
          <pds-tooltip content="content 3" ?has-arrow=${args.hasArrow} max-width=${args.maxWidth} placement="left-end" ?opened=${args.opened}>
            <pds-button variant="accent">le</pds-button>
          </pds-tooltip>
        </div>
        <div class="position-demo-grid-item">
          <pds-tooltip content="content 1" ?has-arrow=${args.hasArrow} max-width=${args.maxWidth} placement="bottom-start" ?opened=${args.opened}>
            <pds-button variant="accent">bs</pds-button>
          </pds-tooltip>
          <pds-tooltip content="content 2" ?has-arrow=${args.hasArrow} max-width=${args.maxWidth} placement="bottom" ?opened=${args.opened}>
            <pds-button variant="accent">b</pds-button>
          </pds-tooltip>
          <pds-tooltip content="content 3" ?has-arrow=${args.hasArrow} max-width=${args.maxWidth} placement="bottom-end" ?opened=${args.opened}>
            <pds-button variant="accent">be</pds-button>
          </pds-tooltip>
        </div>
        <div class="position-demo-grid-item">
          <pds-tooltip content="content 1" ?has-arrow=${args.hasArrow} max-width=${args.maxWidth} placement="right-start" ?opened=${args.opened}>
            <pds-button variant="accent">rs</pds-button>
          </pds-tooltip>
          <pds-tooltip content="content 2" ?has-arrow=${args.hasArrow} max-width=${args.maxWidth} placement="right" ?opened=${args.opened}>
            <pds-button variant="accent">r</pds-button>
          </pds-tooltip>
          <pds-tooltip content="content 3" ?has-arrow=${args.hasArrow} max-width=${args.maxWidth} placement="right-end" ?opened=${args.opened}>
            <pds-button variant="accent">re</pds-button>
          </pds-tooltip>
      </div>
    </div>
  </div>`;

export const Default = BaseTemplate.bind({});
Default.args = {
  content: "The tooltip content",
  opened: false,
  placement: "right",
  slot: "target text",
};

export const HTMLContent = HTMLContentTemplate.bind({});
HTMLContent.args = {
  htmlContent: true,
  opened: false,
  placement: "bottom-start",
};

export const Positioning = PositionTemplate.bind({});
Positioning.args = {
  content: "Trigger",
  opened: false
};

export const NoArrow = BaseTemplate.bind({});
NoArrow.args = {
  content: "The tooltip content",
  hasArrow: false,
  opened: false,
  placement: "bottom-start",
  slot: "target text"
};
