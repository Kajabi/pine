import { html } from 'lit';

import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';
import pdsIconsJson from '../../../../../icons/dist/pds-icons.json';

const customTypes = () => {
  const extractedArgs = extractArgTypes('pds-icon');
  extractedArgs.name.control.type = 'select';
  extractedArgs.name.options = Object.values(pdsIconsJson["icons"]).map((icon) => (icon.name));
  return extractedArgs;
}

export default {
  argTypes: customTypes(),
  component: 'pds-icon',
  title: 'components/Icon'
}

const BaseTemplate = (args) => html`<pds-icon color=${args.color} name=${args.name} size=${args.size}></pds-icon>`;

export const Default = BaseTemplate.bind();
Default.args = {
  name: 'upload'
};
