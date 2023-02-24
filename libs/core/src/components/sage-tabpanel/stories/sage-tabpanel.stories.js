import { html, render } from 'lit-html';

export const BaseTemplate = (args) => html`
<sage-tabs component-id="tabpanel-example" active-tab="tab-one" tablist-label="Foo">
  <sage-tab tab="tab-one">Tab</sage-tab>
  <sage-tabpanel tab="tab-one">Tab Panel</sage-tabpanel>
</sage-tabs>
`;

export const Default = BaseTemplate.bind({});
