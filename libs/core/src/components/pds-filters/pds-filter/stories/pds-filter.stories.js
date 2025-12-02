import { html } from 'lit';


export default {

  argTypes: {
    variant: {
      control: {
        type: 'select',
      },
      options: ['default', 'selected', 'more', 'clear'],
    },
  },
  component: 'pds-filter',
  parameters: {
    actions: {
      handles: ['pdsFilterOpen', 'pdsFilterClose', 'pdsFilterClear'],
    },
  },
  title: 'components/Filters/Filter',
};

const BaseTemplate = (args) => html`
  <pds-filter
    component-id="${args.componentId}"
    variant="${args.variant}"
    text="${args.text}"
    icon="${args.icon}"
  >
    <p>Filter options go here</p>
  </pds-filter>
`;

export const Default = BaseTemplate.bind();
Default.args = {
  componentId: 'filter-default',
  variant: 'default',
  text: 'Trigger',
  icon: 'flash',
};

export const Selected = BaseTemplate.bind();
Selected.args = {
  componentId: 'filter-selected',
  variant: 'selected',
  text: 'Grant an offer',
  icon: 'switch-vertical',
};

export const More = BaseTemplate.bind();
More.args = {
  componentId: 'filter-more',
  variant: 'more',
  text: 'More Filters',
  icon: 'add-circle',
};

export const Clear = (args) => html`
  <pds-filter
    component-id="${args.componentId}"
    variant="clear"
    text="${args.text}"
  >
  </pds-filter>
`;
Clear.args = {
  componentId: 'filter-clear',
  text: 'Clear all',
};

const VariantsTemplate = () => html`
  <pds-filters component-id="all-variants">
    <pds-filter component-id="variant-default" variant="default" text="Trigger" icon="flash">
      <p>Filter options go here</p>
    </pds-filter>

    <pds-filter component-id="variant-selected" variant="selected" text="Grant an offer" icon="switch-vertical">
      <p>Filter options go here</p>
    </pds-filter>

    <pds-filter component-id="variant-more" variant="more" text="More filters" icon="add-circle">
      <p>Filter options go here</p>
    </pds-filter>

    <pds-filter component-id="variant-clear" variant="clear" text="Clear all">
    </pds-filter>
  </pds-filters>
`;

export const AllVariants = VariantsTemplate.bind();
AllVariants.args = {};
