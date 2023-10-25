import { html } from 'lit-html';
import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';

export default {
  argTypes: extractArgTypes('pds-grid-col'),
  component: 'pds-grid-col',
  title: 'components/Grid/Grid Column',
};

const BaseTemplate = (args) => html`
<pds-grid-col
  component-id="${args.componentId}" 
  size="${args.size}"
>
  Content 1
</pds-grid-col>
`;

export const Default = BaseTemplate.bind();
Default.args = {
  componentId: 'opt0',
  size: '6'
};