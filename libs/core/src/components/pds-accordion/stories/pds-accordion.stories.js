import { html } from 'lit';

import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';

export default {
  args: {
    isOpen: false,
    label: 'Products',
    rightIcon: 'down-small',
  },
  argTypes: extractArgTypes('pds-accordion'),
  component: 'pds-accordion',
  title: 'components/Accordion',
}

const BaseTemplate = (args) => html`
	<pds-accordion 
    label="${args.label}"
    open="${args.isOpen}"
    right-icon="${args.rightIcon}"
  >
    <ul>
      <li>Item 1</li>
      <li>Item 2</li>
      <li>Item 3</li>
    </ul>
  </pds-accordion>
`;

export const Default = BaseTemplate.bind();
Default.args = {
  isOpen: false,
  label: 'Products',
  rightIcon: 'down-small',
};