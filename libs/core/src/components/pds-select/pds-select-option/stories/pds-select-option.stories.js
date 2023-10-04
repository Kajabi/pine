import { html } from 'lit-html';

import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';

export default {
  argTypes: extractArgTypes('pds-select-option'),
  component: 'pds-select-option',
  title: 'components/Select/Select Option',
};

const BaseTemplate = (args) => html`
<pds-select-option 
  component-id="${args.componentId}" 
  value="${args.value}"
>
  Option A value
</pds-select-option>
`;

export const Default = BaseTemplate.bind();
Default.args = {
  componentId: 'opt0',
  value: ''
};
