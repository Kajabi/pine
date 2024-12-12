import { html } from 'lit-html';
import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';
import { withActions } from '@storybook/addon-actions/decorator';

export default {
  argTypes: extractArgTypes('pds-tab'),
  component: 'pds-tab',
  decorators: [withActions],
  title: 'components/Tabs/Tab',
}

const BaseTemplate = (args) => html`
<pds-tabs active-tab-name="Sturdy" variant="primary" component-id="primary" tablist-label="Foo">
  <pds-tab name="${args.name}">Sturdy</pds-tab>
  <pds-tabpanel name="Sturdy">Content Sturdy</pds-tabpanel>
</pds-tabs>
`;

export const Default = BaseTemplate.bind({});
