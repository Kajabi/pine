import { html } from 'lit-html';

export default {
  component: 'pds-tab',
  title: 'components/Tabs/Tab',
}

const BaseTemplate = (args) => html`
<pds-tabs active-tab-name="Sturdy" variant="primary" component-id="primary" tablist-label="Foo">
  <pds-tab name="${args.name}">Sturdy</pds-tab>
  <pds-tabpanel name="Sturdy">Content Sturdy</pds-tabpanel>
</pds-tabs>
`;

export const Default = BaseTemplate.bind({});
