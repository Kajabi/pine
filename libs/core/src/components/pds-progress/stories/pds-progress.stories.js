import { html } from 'lit';

export default {
  component: 'pds-progress',
  title: 'components/Progress'
}

const BaseTemplate = (args) =>
  html`<pds-progress
    ?animated=${args.animated}
    component-id=${args.componentId}
    fill-color=${args.fillColor}
    label=${args.label}
    percent=${args.percent}
    ?show-percent=${args.showPercent}
  ></pds-progress>`;


export const Default = BaseTemplate.bind();
Default.args = {
  animated: false,
  componentId: 'default',
  label: 'Default label',
  percent: 0,
  showPercent: false,
};

export const Percent = BaseTemplate.bind();
Percent.args = {
  animated: false,
  componentId: 'percentage',
  label: 'Percentage label',
  percent: 50,
  showPercent: false,
};

export const showPercent = BaseTemplate.bind();
showPercent.args = {
  animated: false,
  componentId: 'show-percentage',
  label: 'Show percentage label',
  percent: 50,
  showPercent: true,
};

export const Animated = BaseTemplate.bind();
Animated.args = {
  animated: true,
  componentId: 'animated',
  label: 'Animated label',
  percent: 75,
  showPercent: false,
};

export const fillColor = BaseTemplate.bind();
fillColor.args = {
  animated: false,
  componentId: 'fillcolor',
  label: 'Color label',
  percent: 95,
  showPercent: false,
  fillColor: '#86D5BC',
};
