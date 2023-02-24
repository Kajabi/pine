import { html } from 'lit-html';

const BaseTemplate = (args) => html`<sage-tooltip content=${args.content} hasArrow=${args.hasArrow} placement=${args.placement} open=${args.open}>${args.slot}</sage-tooltip>`;

const defaultParameters = {
  docs: {
    disable: true
  }
};

export const Default = BaseTemplate.bind({});
Default.args = {
  hasArrow: true,
  slot: 'This is tooltip text'
};
Default.parameters = { ...defaultParameters }
