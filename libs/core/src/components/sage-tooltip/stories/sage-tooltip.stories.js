import { html } from 'lit-html';

const BaseTemplate = (args) => html`<sage-tooltip hasArrow=${args.hasArrow}>${args.slot}</sage-tooltip>`;

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
