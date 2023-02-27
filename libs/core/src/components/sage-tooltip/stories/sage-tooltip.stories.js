import { html } from 'lit-html';

const defaultParameters = {
  docs: {
    disable: true
  }
};

const BaseTemplate = (args) => html`
<sage-tooltip content=${args.content} hasArrow=${args.hasArrow} placement=${args.placement} open=${args.open}>
  ${args.slot}
</sage-tooltip>`;

const SlottedTemplate = (args) => html`
<sage-tooltip content=${args.content} hasArrow=${args.hasArrow} placement=${args.placement} open=${args.open}>
  <div slot="content">
    <p>this is s a</p>
    <p>this is s a</p>
  </div>
  <sage-button slot="target" variant="accent">Hey there</sage-button>
</sage-tooltip>`;


export const Default = SlottedTemplate.bind({});
Default.args = {

};
Default.parameters = { ...defaultParameters }

// export const Slotted = SlottedTemplate.bind({});
// Slotted.args = {
//   // TODO Find way to return 10 - 13 in args <- slot="content"
// };
// Slotted.parameters = { ...defaultParameters }
