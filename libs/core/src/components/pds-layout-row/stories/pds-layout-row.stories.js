import { html } from 'lit-html';
import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';

export default {
  argTypes: extractArgTypes('pds-layout-row'),
  component: 'pds-layout-row',
  title: 'components/Layout/Row',
};

const BaseTemplate = (args) => html`
<pds-layout-row
  align-items="${args.alignItems}"  
  bordered="${args.bordered}"
  component-id="${args.componentId}" 
  col-gap="${args.colGap}"
  justify-content="${args.justifyContent}"
  min-height="${args.minHeight}"
>
  <pds-layout-box bordered>Item 1</pds-layout-box>
  <pds-layout-box bordered direction="column">
    <p>Content 1</p>
    <p>Content 2</p>
  </pds-layout-box>
</pds-layout-row>
`;

export const Default = BaseTemplate.bind();
Default.args = {
  bordered: "true",
  componentId: 'opt0',
  colGap: '8px',
};

const GapTemplate = (args) => html`
<pds-layout-row
  align-items="${args.alignItems}"  
  bordered="${args.bordered}"
  component-id="${args.componentId}" 
  col-gap="${args.colGap}"
  justify-content="${args.justifyContent}"
  min-height="${args.minHeight}"
>
  <pds-layout-box size="4">
    <pds-layout-box 
      border-radius="sm"
      padding="sm"
      shadow="sm"
    >
      Item 1
    </pds-layout-box>
  </pds-layout-box>
  <pds-layout-box size="8">
    <pds-layout-box padding="sm" shadow="sm">
      Item 2
    </pds-layout-box>
  </pds-layout-box>
</pds-layout-row>
`;


export const Gap = GapTemplate.bind();
Gap.args = {
  bordered: "false",
  componentId: 'opt0',
  colGap: '24px'
};


