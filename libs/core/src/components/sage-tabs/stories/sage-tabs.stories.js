import { html, render } from 'lit-html';

const BaseTemplate = (args) => html`
<sage-tabs active-tab-name=${args.activeTabName} variant=${args.variant} component-id=${args.componentId} tablist-label=${args.tablistLabel}>
  <sage-tab name="Sturdy">Sturdy</sage-tab>
  <sage-tab name="Dollop">Dollop</sage-tab>
  <sage-tab name="Waffle">Waffle</sage-tab>
  <sage-tabpanel name="Sturdy">Content Sturdy</sage-tabpanel>
  <sage-tabpanel name="Dollop">Content Dollop</sage-tabpanel>
  <sage-tabpanel name="Waffle">Content Waffle</sage-tabpanel>
</sage-tabs>
`;

const AvailabilityTemplate = (args) => html`
<div style="background-color: #ddd; padding: 20px;">
  <sage-tabs active-tab-name=${args.activeTabName} variant=${args.variant} component-id=${args.componentId} tablist-label=${args.tablistLabel}>
    <sage-tab name="monday">Monday</sage-tab>
    <sage-tab name="tuesday">Tuesday</sage-tab>
    <sage-tab name="wednesday">Wednesday</sage-tab>
    <sage-tabpanel name="tuesday">Content Tuesday</sage-tabpanel>
    <sage-tabpanel name="wednesday">Content Wednesday</sage-tabpanel>
    <sage-tabpanel name="monday">Content Monday</sage-tabpanel>
  </sage-tabs>
</div>
`;

export const Primary = BaseTemplate.bind({});
Primary.args = {
  activeTabName: "Dollop",
  componentId: "primary",
  variant: "primary",
  tablistLabel: "Foo",
}

export const Availability = AvailabilityTemplate.bind({});
Availability.args = {
  activeTabName: "tuesday",
  componentId: "availability",
  variant: 'availability',
  tablistLabel: "Foo",
}

export const Filter = BaseTemplate.bind({});
Filter.args = {
  activeTabName: "Sturdy",
  componentId: "filter",
  variant: 'filter',
  tablistLabel: "Foo",
}
