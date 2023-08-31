import { html } from 'lit';

import { customArgsWithIconControl } from "../../../stories/_helpers";

export default {
  argTypes: customArgsWithIconControl({component: 'pds-icon', property: 'name'}),
  component: 'pds-icon',
  title: 'components/Icon'
}

const BaseTemplate = (args) => html`<pds-icon color=${args.color} name=${args.name} size=${args.size}></pds-icon>`;

export const Default = BaseTemplate.bind();
Default.args = {
  name: 'upload'
};
