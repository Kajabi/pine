import { html } from 'lit-html';

const defaultParameters = {
  docs: {
    disable: true
  }
};

const BaseTemplate = (args) => html`
<sage-tooltip content=${args.content} has-arrow=${args.hasArrow} placement=${args.placement} open=${args.open}>
</sage-tooltip>`;

const SlottedTemplate = (args) => html`
<sage-tooltip content=${args.content} has-arrow=${args.hasArrow} placement=${args.placement} open=${args.open}>
  <div slot="content">
    <p>this is s a</p>
    <p>this is s a</p>
  </div>
  <sage-button slot="target" variant="accent">Hey there</sage-button>
</sage-tooltip>`;

const PositionTemplate = (args) => html`
<div class="demo-container" style="min-height: 100vh; width: 100%; display: flex; align-items: center; justify-content: center;">
<div>
<sage-tooltip content="content 1" has-arrow=${args.hasArrow} placement="top-start" open=${args.open}>
  <sage-button variant="accent">ts</sage-button>
</sage-tooltip>
<sage-tooltip content="content 2" has-arrow=${args.hasArrow} placement="top" open=${args.open}>
  <sage-button variant="accent">t</sage-button>
</sage-tooltip>
<sage-tooltip content="content 3" has-arrow=${args.hasArrow} placement="top-end" open=${args.open}>
  <sage-button variant="accent">te</sage-button>
</sage-tooltip>
<div>
<sage-tooltip content="content 1" has-arrow=${args.hasArrow} placement="left-start" open=${args.open}>
  <sage-button variant="accent">ls</sage-button>
</sage-tooltip>
<sage-tooltip content="content 2" has-arrow=${args.hasArrow} placement="left" open=${args.open}>
  <sage-button variant="accent">l</sage-button>
</sage-tooltip>
<sage-tooltip content="content 3" has-arrow=${args.hasArrow} placement="left-end" open=${args.open}>
  <sage-button variant="accent">le</sage-button>
</sage-tooltip>
</div>
<sage-tooltip content="content 1" has-arrow=${args.hasArrow} placement="bottom-start" open=${args.open}>
  <sage-button variant="accent">bs</sage-button>
</sage-tooltip>
<sage-tooltip content="content 2" has-arrow=${args.hasArrow} placement="bottom" open=${args.open}>
  <sage-button variant="accent">b</sage-button>
</sage-tooltip>
<sage-tooltip content="content 3" has-arrow=${args.hasArrow} placement="bottom-end" open=${args.open}>
  <sage-button variant="accent">be</sage-button>
</sage-tooltip>
<div>
<sage-tooltip content="content 1" has-arrow=${args.hasArrow} placement="right-start" open=${args.open}>
  <sage-button variant="accent">rs</sage-button>
</sage-tooltip>
<sage-tooltip content="content 2" has-arrow=${args.hasArrow} placement="right" open=${args.open}>
  <sage-button variant="accent">r</sage-button>
</sage-tooltip>
<sage-tooltip content="content 3" has-arrow=${args.hasArrow} placement="right-end" open=${args.open}>
  <sage-button variant="accent">re</sage-button>
</sage-tooltip>
</div>
</div>
</div>`;

export const Default = PositionTemplate.bind({});
Default.args = {
  content: "The tooltip content",
  // hasArrow: true,
  // placement: "top"
};
Default.parameters = { ...defaultParameters };

export const Slotted = SlottedTemplate.bind({});
Slotted.args = {
  // TODO Find way to return 10 - 13 in args <- slot="content"
};
Slotted.parameters = { ...defaultParameters }



PositionTemplate.args = {
  content: "Trigger"
};
PositionTemplate.parameters = { ...defaultParameters }
