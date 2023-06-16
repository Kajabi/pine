import { html } from 'lit-html';

const BaseTemplate = (args) =>
  html`<pds-progress
    animated=${args.animated}
    component-id=${args.componentId}
    fill-color=${args.fillColor}
    label=${args.label}
    percentage=${args.percentage}
    show-percent=${args.showPercent}
  ></pds-progress>`;

const defaultParameters = { docs: { disable: true } };

export const Default = BaseTemplate.bind();
Default.args = {
  componentId: 'default',
  label: 'Default label',
  animated: false,
  percentage: 50,
  showPercent: false,
};
Default.parameters = { ...defaultParameters };
