import { html } from 'lit';
import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';
import { withActions } from '@storybook/addon-actions/decorator';

export default {
  argTypes: extractArgTypes('pds-filters'),
  component: 'pds-filters',
  decorators: [withActions],
  parameters: {
    actions: {
      handles: ['pdsFilterOpen', 'pdsFilterClose', 'pdsFilterClear'],
    },
  },
  title: 'components/Filters',
};

const BaseTemplate = (args) => html`
  <pds-filters component-id="${args.componentId}">
    <pds-filter component-id="filter-1" variant="default" text="Trigger" icon="flash">
      <p>Trigger filter options</p>
    </pds-filter>
    <pds-filter component-id="filter-2" variant="selected" text="Grant an offer" icon="switch-vertical">
      <p>Selected action filter</p>
    </pds-filter>
    <pds-filter component-id="filter-3" variant="default" text="Status" icon="activity">
      <p>Status filter options</p>
    </pds-filter>
    <pds-filter component-id="filter-4" variant="more" text="More filters" icon="add-circle">
      <p>Additional filter options</p>
    </pds-filter>
    <pds-filter component-id="filter-5" variant="clear" text="Clear all">
    </pds-filter>
  </pds-filters>
`;

export const Default = BaseTemplate.bind();
Default.args = {
  componentId: 'default-filters',
};

