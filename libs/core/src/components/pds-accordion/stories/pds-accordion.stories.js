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
    <pds-row align-items="center" slot="label">
      <pds-box align-items="center">
        <pds-icon name="products-outline"></pds-icon>
        <span style="display: inline-block; margin-left: 8px;">Products</span>
      </pds-box>
    </pds-row>
    <pds-row>
      <pds-box direction="column" gap="xs" padding="xs">
        <pds-link variant="plain" href="#">All products</pds-link>
        <pds-link variant="plain" href="#">Courses</pds-link>
        <pds-link variant="plain" href="#">Coaching</pds-link>
        <pds-link variant="plain" href="#">Community</pds-link>
        <pds-link variant="plain" href="#">Podcasts</pds-link>
      </pds-box>
    </pds-row>
  </pds-accordion>
`;

export const Default = BaseTemplate.bind();
