import { html, render } from 'lit-html';

const BaseTemplate = (args) => html`<sage-button  disabled=${args.disabled} icon=${args.icon} name=${args.name} type=${args.type} value=${args.value} variant=${args.variant}>${args.slot}</sage-button> `;
const defaultParameters = { docs: { disable: true } };

export const Accent = BaseTemplate.bind();
Accent.args = {
  disabled: false,
  slot: 'Default',
  type: 'button',
  variant: 'accent',
};
Accent.parameters = { ...defaultParameters };

export const Destructive = BaseTemplate.bind({});
Destructive.args = {
  disabled: false,
  slot: 'Default',
  type: 'button',
  variant: 'destructive',
}
Destructive.parameters = { ...defaultParameters };

export const Disclosure = BaseTemplate.bind({});
Disclosure.args = {
  disabled: false,
  slot: 'Default',
  type: 'button',
  variant: 'disclosure',
}
Disclosure.parameters = { ...defaultParameters };

export const Primary = BaseTemplate.bind({});
Primary.args = {
  disabled: false,
  slot: 'Default',
  type: 'button',
}
Primary.parameters = { ...defaultParameters };

export const Secondary = BaseTemplate.bind({});
Secondary.args = {
  disabled: false,
  slot: 'Default',
  variant: 'secondary',
  type: 'button',
}
Secondary.parameters = { ...defaultParameters };
