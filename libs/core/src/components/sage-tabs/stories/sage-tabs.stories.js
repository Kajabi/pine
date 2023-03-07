import { html, render } from 'lit-html';

const BaseTemplate = (args) => html`
<sage-tabs active-tab-name=${args.activeTabName} variant=${args.variant} component-id=${args.componentId} tablist-label=${args.tablistLabel}>
  <sage-tab name="One">One</sage-tab>
  <sage-tab name="Three">Three</sage-tab>
  <sage-tab name="Two">Two</sage-tab>
  <sage-tabpanel name="Three">Content 3</sage-tabpanel>
  <sage-tabpanel name="One">Content 1</sage-tabpanel>
  <sage-tabpanel name="Two">Content 2</sage-tabpanel>
</sage-tabs>
`;

const AvailabilityTemplate = (args) => html`
<div style="background-color: #ddd; padding: 20px;">
  <sage-tabs active-tab-name=${args.activeTabName} variant=${args.variant} component-id=${args.componentId} tablist-label=${args.tablistLabel}>
    <sage-tab name="one">One</sage-tab>
    <sage-tab name="two">Two</sage-tab>
    <sage-tab name="three">Three</sage-tab>
    <sage-tabpanel name="one">Content 1</sage-tabpanel>
    <sage-tabpanel name="two">Content 2</sage-tabpanel>
    <sage-tabpanel name="three">Content 3</sage-tabpanel>
  </sage-tabs>
</div>
`;

export const Primary = BaseTemplate.bind({});
Primary.args = {
  activeTabName: "Two",
  componentId: "primary",
  variant: "primary",
  tablistLabel: "Foo",
}

export const Availability = AvailabilityTemplate.bind({});
Availability.args = {
  activeTabName: "two",
  componentId: "availability",
  variant: 'availability',
  tablistLabel: "Foo",
}

export const Filter = BaseTemplate.bind({});
Filter.args = {
  activeTabName: "Two",
  componentId: "filter",
  variant: 'filter',
  tablistLabel: "Foo",
}
