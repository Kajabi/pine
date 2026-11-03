import { html } from 'lit';


export default {

  component: 'pds-tooltip',
  parameters: {},
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

const InModalTemplate = (args) => html`
  <pds-button onclick="document.querySelector('#tooltip-modal').open = true">Open modal</pds-button>
  <pds-modal id="tooltip-modal" component-id="tooltip-modal" size="sm">
    <pds-modal-header>
      <pds-box padding="md">
        <pds-text tag="h2" size="h3">Publish changes</pds-text>
      </pds-box>
    </pds-modal-header>
    <pds-modal-content>
      <pds-box padding-inline-start="md" padding-inline-end="md">
        <pds-text tag="p">Hover or focus Publish: its tooltip shows above the open modal.</pds-text>
      </pds-box>
    </pds-modal-content>
    <pds-modal-footer>
      <pds-box fit gap="sm" justify-content="end" padding="md">
        <pds-button variant="secondary" onclick="document.querySelector('#tooltip-modal').open = false">Cancel</pds-button>
        <pds-tooltip content=${args.content} ?has-arrow=${args.hasArrow} placement=${args.placement}>
          <pds-button variant="primary">Publish</pds-button>
        </pds-tooltip>
      </pds-box>
    </pds-modal-footer>
  </pds-modal>`;

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

export const InModal = InModalTemplate.bind({});
InModal.args = {
  content: "Fix the errors on the page to publish",
  hasArrow: true,
  placement: "top",
};
