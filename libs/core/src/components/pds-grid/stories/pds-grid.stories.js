
import { html } from 'lit';
import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';

export default {
  argTypes: extractArgTypes('pds-grid'),
  component: 'pds-grid',  
  title: 'components/Grid'
}

const BaseTemplate = (args) => html`
<pds-grid>

    <pds-grid-col size="6" size-sm="12" size-md="6" size-lg="4" size-xl="3">Content 1</pds-grid-col>
    <pds-grid-col size="6" size-sm="12" size-md="6" size-lg="4" size-xl="3">Content 2</pds-grid-col>
    <pds-grid-col size="6" size-sm="12" size-md="6" size-lg="4" size-xl="3">Content 3</pds-grid-col>
  
</pds-grid>`;

export const Default = BaseTemplate.bind();

