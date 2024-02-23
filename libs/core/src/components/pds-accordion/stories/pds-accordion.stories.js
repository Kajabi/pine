import { html } from 'lit';

import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';

export default {
  args: {
    componentId: '',
    isOpen: false,
  },
  argTypes: extractArgTypes('pds-accordion'),
  component: 'pds-accordion',
  title: 'components/Accordion',
}

const BaseTemplate = (args) => html`
	<pds-accordion component-id="${args.componentId}" open="${args.isOpen}">
    <div style="display: flex; align-items: center;" slot="label">
      <pds-icon name="products-outline"></pds-icon>
      <span style="display: inline-block; margin-left: 8px; margin-right: auto;">Products</span>
      <pds-icon name="down-small"></pds-icon>
    </div>
    <div style="display: flex; flex-direction: column; padding-left: 32px; gap: 4px;">
      <pds-link variant="plain" href="#">All products</pds-link>
      <pds-link variant="plain" href="#">Courses</pds-link>
      <pds-link variant="plain" href="#">Coaching</pds-link>
      <pds-link variant="plain" href="#">Community</pds-link>
      <pds-link variant="plain" href="#">Podcasts</pds-link>
    </div>
  </pds-accordion>
`;

export const Default = BaseTemplate.bind();