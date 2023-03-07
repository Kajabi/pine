import { html, render } from 'lit-html';

export const BaseTemplate = (args) => html`
<sage-tabs component-id="tabpanel-example" active-tab-name="tab-one" tablist-label="Foo" variant="primary">
  <sage-tab name="tab-one">Tab</sage-tab>
  <sage-tabpanel name="tab-one">Tab Panel</sage-tabpanel>
</sage-tabs>
`;

export const Default = BaseTemplate.bind({});
