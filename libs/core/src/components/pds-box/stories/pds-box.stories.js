import { html } from 'lit-html';
import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';

export default {
  argTypes: extractArgTypes('pds-box'),
  component: 'pds-box',
  title: 'components/Box',
};

const DefaultTemplate = (args) => html`
<pds-row
  align-items="center"
  justify-content="space-between"
  bordered="true"
  component-id="${args.componentId}" 
>
  <pds-box size="2">Item 1</pds-box>
  <pds-box
    display="flex"
    align-items="center"
    justify-content="center"
    min-height="100px"
    size="8"
  >Item 2</pds-box>
  <pds-box size="2">Item 3</pds-box>
</pds-row>
`;

export const Default = DefaultTemplate.bind();
Default.args = {
  componentId: 'opt0',
};