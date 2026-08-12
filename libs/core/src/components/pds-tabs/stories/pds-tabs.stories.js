import { html } from 'lit';


export default {

  component: 'pds-tabs',
  parameters: {},
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

export const Pill = BaseTemplate.bind({});
Pill.args = {
  activeTabName: "Sturdy",
  componentId: "pill",
  variant: 'pill',
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

export const Divider = () => html`
<pds-tabs active-tab-name="Dollop" component-id="divider" tablist-label="Foo" variant="primary" divider>
  <pds-tab name="Sturdy">Sturdy</pds-tab>
  <pds-tab name="Dollop">Dollop</pds-tab>
  <pds-tab name="Waffle">Waffle</pds-tab>
  <pds-tabpanel name="Sturdy">Content Sturdy</pds-tabpanel>
  <pds-tabpanel name="Dollop">Content Dollop</pds-tabpanel>
  <pds-tabpanel name="Waffle">Content Waffle</pds-tabpanel>
</pds-tabs>
`;

export const Stretch = () => html`
<div style="block-size: 240px; border: var(--pine-border-width-thin) solid var(--pine-color-border-subtle); display: flex;">
  <pds-tabs active-tab-name="Dollop" component-id="stretch" tablist-label="Foo" variant="primary" divider stretch>
    <pds-tab name="Sturdy">Sturdy</pds-tab>
    <pds-tab name="Dollop">Dollop</pds-tab>
    <pds-tab name="Waffle">Waffle</pds-tab>
    <pds-tabpanel name="Sturdy">Content Sturdy</pds-tabpanel>
    <pds-tabpanel name="Dollop">
      <div style="align-items: end; background-color: var(--pine-color-background-muted); block-size: 100%; display: flex;">Composer pinned to the bottom</div>
    </pds-tabpanel>
    <pds-tabpanel name="Waffle">Content Waffle</pds-tabpanel>
  </pds-tabs>
</div>
`;

// Navigation mode: give each pds-tab an `href` (and optional Turbo props) and the
// strip renders as a <nav> of links with aria-current on the active one — for
// per-URL tab strips (e.g. deep-linkable page tabs) rather than in-page panels.
// No pds-tabpanels; the destination URL renders the content.
//
// This story exercises every nav-mode prop: the active tab drives a Turbo Frame
// (turbo-frame/turbo-action), a disabled tab is dropped from tab order, and an
// external tab opens in a new tab (target="_blank" → rel="noopener noreferrer").
export const NavTabs = () => html`
<pds-tabs component-id="nav" tablist-label="Club sections" variant="primary" divider>
  <pds-tab name="chat" href="/clubs/1/chat" active turbo-frame="clubs-body" turbo-action="advance">Chat</pds-tab>
  <pds-tab name="resources" href="/clubs/1/resources" turbo-frame="clubs-body" turbo-action="advance">Resources</pds-tab>
  <pds-tab name="members" href="/clubs/1/members" disabled>Members</pds-tab>
  <pds-tab name="help" href="https://help.example.com/clubs" target="_blank">Help</pds-tab>
</pds-tabs>
`;
