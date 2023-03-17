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
<div>
<sage-tooltip content="content 1" has-arrow=${args.hasArrow} placement="top" open=${args.open}>
  <sage-button variant="accent">Trigger</sage-button>
</sage-tooltip>
<sage-tooltip content="content 2" has-arrow=${args.hasArrow} placement="right" open=${args.open}>
  <sage-button variant="accent">Trigger</sage-button>
</sage-tooltip>
<sage-tooltip content="content 3" has-arrow=${args.hasArrow} placement="bottom" open=${args.open}>
  <sage-button variant="accent">Trigger</sage-button>
</sage-tooltip>
<sage-tooltip content="content 4" has-arrow=${args.hasArrow} placement="left" open=${args.open}>
  <sage-button variant="accent">Trigger</sage-button>
</sage-tooltip></div>`;

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
