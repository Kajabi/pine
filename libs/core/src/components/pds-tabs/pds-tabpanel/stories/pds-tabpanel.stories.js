import { html } from 'lit-html';

export default {
  component: 'pds-tabpanel',
  title: 'components/Tabs/Tabpanel',
}

const BaseTemplate = (args) => html`
<pds-tabs active-tab-name="Sturdy" variant="primary" component-id="primary" tablist-label="Foo">
  <pds-tab name="Sturdy">Sturdy</pds-tab>
  <pds-tabpanel name="${args.name}">Content Sturdy</pds-tabpanel>
</pds-tabs>
`;

export const Default = BaseTemplate.bind({});
