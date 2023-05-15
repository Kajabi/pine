import { html } from 'lit-html';

const defaultParameters = {
  docs: {
    disable: true
  }
};

const BaseTemplate = (args) => html`
  <sage-tooltip content=${args.content} has-arrow=${args.hasArrow} placement=${args.placement}>${args.slot}</sage-tooltip>`;

const HTMLContentTemplate = (args) => html`
  <sage-tooltip has-arrow=${args.hasArrow} placement=${args.placement} html-content=${args.htmlContent}>
    <div slot="content">
      <p><strong>This is a tooltip</strong></p>
      <p>Tooltips are used to describe or identify an element. In most scenarios, tooltips help the user understand the meaning, function or alt-text of an element.</p>
    </div>
    <sage-button variant="secondary">Hover</sage-button>
  </sage-tooltip>`;

const PositionTemplate = (args) => html`
  <div class="demo-container" style="min-height: 50vh; width: 100%; display: flex; align-items: center; justify-content: center;">
    <div class="position-demo-grid">
      <div class="position-demo-grid-item">
        <sage-tooltip content="content 2" has-arrow=${args.hasArrow} placement="top-start" opened=${args.opened}>
          <sage-button variant="accent">t</sage-button>
        </sage-tooltip>
        <sage-tooltip content="content 2" has-arrow=${args.hasArrow} placement="top" opened=${args.opened}>
          <sage-button variant="accent">t</sage-button>
        </sage-tooltip>
        <sage-tooltip content="content 3" has-arrow=${args.hasArrow} placement="top-end" opened=${args.opened}>
          <sage-button variant="accent">te</sage-button>
        </sage-tooltip>
        </div>
        <div class="position-demo-grid-item">
          <sage-tooltip content="content 1" has-arrow=${args.hasArrow} placement="left-start" opened=${args.opened}>
            <sage-button variant="accent">ls</sage-button>
          </sage-tooltip>
          <sage-tooltip content="content 2" has-arrow=${args.hasArrow} placement="left" opened=${args.opened}>
            <sage-button variant="accent">l</sage-button>
          </sage-tooltip>
          <sage-tooltip content="content 3" has-arrow=${args.hasArrow} placement="left-end" opened=${args.opened}>
            <sage-button variant="accent">le</sage-button>
          </sage-tooltip>
        </div>
        <div class="position-demo-grid-item">
          <sage-tooltip content="content 1" has-arrow=${args.hasArrow} placement="bottom-start" opened=${args.opened}>
            <sage-button variant="accent">bs</sage-button>
          </sage-tooltip>
          <sage-tooltip content="content 2" has-arrow=${args.hasArrow} placement="bottom" opened=${args.opened}>
            <sage-button variant="accent">b</sage-button>
          </sage-tooltip>
          <sage-tooltip content="content 3" has-arrow=${args.hasArrow} placement="bottom-end" opened=${args.opened}>
            <sage-button variant="accent">be</sage-button>
          </sage-tooltip>
        </div>
        <div class="position-demo-grid-item">
          <sage-tooltip content="content 1" has-arrow=${args.hasArrow} placement="right-start" opened=${args.opened}>
            <sage-button variant="accent">rs</sage-button>
          </sage-tooltip>
          <sage-tooltip content="content 2" has-arrow=${args.hasArrow} placement="right" opened=${args.opened}>
            <sage-button variant="accent">r</sage-button>
          </sage-tooltip>
          <sage-tooltip content="content 3" has-arrow=${args.hasArrow} placement="right-end" opened=${args.opened}>
            <sage-button variant="accent">re</sage-button>
          </sage-tooltip>
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
