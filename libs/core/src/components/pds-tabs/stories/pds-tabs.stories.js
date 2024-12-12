import { html } from 'lit';
import { withActions } from '@storybook/addon-actions/decorator';
import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';

export default {
  argTypes: extractArgTypes('pds-tabs'),
  component: 'pds-tabs',
  decorators: [withActions],
  parameters: {
    actions: {
      handles: ['pdsTabClick', 'keydown']
    },
  },
  title: 'components/Tabs',
};

const BaseTemplate = (args) => html`
<pds-tabs active-tab-name=${args.activeTabName} variant=${args.variant} component-id=${args.componentId} tablist-label=${args.tablistLabel}>
  <pds-tab name="Sturdy">Sturdy</pds-tab>
  <pds-tab name="Dollop">Dollop</pds-tab>
  <pds-tab name="Waffle">Waffle</pds-tab>
  <pds-tabpanel name="Sturdy">Content Sturdy</pds-tabpanel>
  <pds-tabpanel name="Dollop">Content Dollop</pds-tabpanel>
  <pds-tabpanel name="Waffle">Content Waffle</pds-tabpanel>
</pds-tabs>
`;

export const Default = BaseTemplate.bind({});
Default.args = {
  activeTabName: "Dollop",
  componentId: "primary",
  variant: "primary",
  tablistLabel: "Foo",
}

export const Filter = BaseTemplate.bind({});
Filter.args = {
  activeTabName: "Sturdy",
  componentId: "filter",
  variant: 'filter',
  tablistLabel: "Foo",
}

const AvailabilityTemplate = (args) => html`
<div style="background-color: #ddd; padding: 20px;">
  <pds-tabs active-tab-name=${args.activeTabName} variant=${args.variant} component-id=${args.componentId} tablist-label=${args.tablistLabel}>
    <pds-tab name="monday">Monday</pds-tab>
    <pds-tab name="tuesday">Tuesday</pds-tab>
    <pds-tab name="wednesday">Wednesday</pds-tab>
    <pds-tabpanel name="tuesday">Content Tuesday</pds-tabpanel>
    <pds-tabpanel name="wednesday">Content Wednesday</pds-tabpanel>
    <pds-tabpanel name="monday">Content Monday</pds-tabpanel>
  </pds-tabs>
</div>
`;

export const Availability = AvailabilityTemplate.bind({});
Availability.args = {
  activeTabName: "tuesday",
  componentId: "availability",
  variant: 'availability',
  tablistLabel: "Foo",
}
