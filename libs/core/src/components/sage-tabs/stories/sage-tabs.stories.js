import { html, render } from 'lit-html';

const BaseTemplate = (args) => html`
<sage-tabs active-tab=${args.activeTab} variant=${args.variant} component-id=${args.componentId} tablist-label=${args.tablistLabel}>
  <sage-tab tab="One">One</sage-tab>
  <sage-tab tab="Three">Three</sage-tab>
  <sage-tab tab="Two">Two</sage-tab>
  <sage-tabpanel tab="Three">Content 3</sage-tabpanel>
  <sage-tabpanel tab="One">Content 1</sage-tabpanel>
  <sage-tabpanel tab="Two">Content 2</sage-tabpanel>
</sage-tabs>
`;

const AvailabilityTemplate = (args) => html`
<div style="background-color: #ddd; padding: 20px;">
  <sage-tabs active-tab=${args.activeTab} variant=${args.variant} component-id=${args.componentId} tablist-label=${args.tablistLabel}>
    <sage-tab tab="one">One</sage-tab>
    <sage-tab tab="two">Two</sage-tab>
    <sage-tab tab="three">Three</sage-tab>
    <sage-tabpanel tab="one">Content 1</sage-tabpanel>
    <sage-tabpanel tab="two">Content 2</sage-tabpanel>
    <sage-tabpanel tab="three">Content 3</sage-tabpanel>
  </sage-tabs>
</div>
`;

export const Primary = BaseTemplate.bind({});
Primary.args = {
  activeTab: "Two",
  componentId: "primary",
  variant: "primary",
  tablistLabel: "Foo",
}

export const Availability = AvailabilityTemplate.bind({});
Availability.args = {
  activeTab: "two",
  componentId: "availability",
  variant: 'availability',
  tablistLabel: "Foo",
}

export const Filter = BaseTemplate.bind({});
Filter.args = {
  activeTab: "Two",
  componentId: "filter",
  variant: 'filter',
  tablistLabel: "Foo",
}
