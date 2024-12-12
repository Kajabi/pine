import { html } from 'lit-html';
import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';
import { withActions } from '@storybook/addon-actions/decorator';

export default {
  argTypes: extractArgTypes('pds-tabpanel'),
  component: 'pds-tabpanel',
  decorators: [withActions],
  title: 'components/Tabs/Tabpanel',
}

const BaseTemplate = (args) => html`
<pds-tabs active-tab-name="Sturdy" variant="primary" component-id="primary" tablist-label="Foo">
  <pds-tab name="Sturdy">Sturdy</pds-tab>
  <pds-tabpanel name="${args.name}">Content Sturdy</pds-tabpanel>
</pds-tabs>
`;

export const Default = BaseTemplate.bind({});
