import { html } from 'lit';

export default {
  component: 'pds-loader',
  title: 'components/Loader',
  args: {
    isLoading: true,
    showLabel: false,
  },
}

const BaseTemplate = (args) => html`
  <pds-loader
    ?is-loading=${args.isLoading}
    ?show-label=${args.showLabel}
    size="${args.size}"
    variant="${args.variant}"
  >
    <span slot="label">${args.label}</span>
  </pds-loader>
`;

export const Default = BaseTemplate.bind();
Default.args = {
  size: '100px',
  showLabel: true,
  label: "Now loading...",
  variant: 'spinner'
};

export const Typing = BaseTemplate.bind();
Typing.args = {
  variant: 'typing'
};
