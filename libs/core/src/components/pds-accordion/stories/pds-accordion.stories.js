import { html } from 'lit';

import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';

export default {
  args: {
  },
  argTypes: extractArgTypes('pds-accordion'),
  component: 'pds-accordion',
  title: 'components/Accordion',
}

const BaseTemplate = (args) => html`
	<pds-accordion>
    <span slot="summary">Button Trigger</span>
    <ul>
      <li>Item 1</li>
      <li>Item 2</li>
      <li>Item 3</li>
    </ul>
  </pds-accordion>
`;

export const Default = BaseTemplate.bind();