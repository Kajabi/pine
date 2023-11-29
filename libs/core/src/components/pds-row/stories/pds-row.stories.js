import { html } from 'lit-html';
import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';

export default {
  argTypes: extractArgTypes('pds-row'),
  component: 'pds-grid-row',
  title: 'components/Row',
};

const BaseTemplate = (args) => html`
<pds-row
  align-items="${args.alignItems}"  
  bordered="${args.bordered}"
  component-id="${args.componentId}" 
  gap="${args.gap}"
  justify-content="${args.justifyContent}"
  min-height="${args.minHeight}"
>
  <pds-box bordered>Item 1</pds-box>
  <pds-box bordered direction="column">
    <p>Content 1</p>
    <p>Content 2</p>
  </pds-box>
</pds-row>
`;

export const Default = BaseTemplate.bind();
Default.args = {
  bordered: "true",
  componentId: 'opt0',
  gap: '8px',
};

const GapTemplate = (args) => html`
<pds-row
  align-items="${args.alignItems}"  
  bordered="${args.bordered}"
  component-id="${args.componentId}" 
  gap="${args.gap}"
  justify-content="${args.justifyContent}"
  min-height="${args.minHeight}"
>
  <pds-box size="4">
    <pds-box 
      border-radius="sm"
      padding="sm"
      shadow="sm"
    >
      Item 1
    </pds-box>
  </pds-box>
  <pds-box size="8">
    <pds-box padding="sm" shadow="sm">
      Item 2
    </pds-box>
  </pds-box>
</pds-row>
`;


export const Gap = GapTemplate.bind();
Gap.args = {
  bordered: "false",
  componentId: 'opt0',
  gap: '24px'
};


