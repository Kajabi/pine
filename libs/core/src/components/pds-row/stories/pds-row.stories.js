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

const SizeTemplate = (args) => html`
<pds-row
  component-id="${args.componentId}" 
>
  <pds-box size="2">Item 1</pds-box>
  <pds-box size="8">Item 2</pds-box>
  <pds-box size="2">Item 3</pds-box>
</pds-row>
<pds-row
  component-id="${args.componentId}" 
>
  <pds-box size="8">Item 1</pds-box>
  <pds-box>Item 2</pds-box>
</pds-row>
`;

export const Size = SizeTemplate.bind();
Size.args = {
  componentId: 'opt0',
};

const ResponsiveTemplate = (args) => html`
<pds-row
  component-id="${args.componentId}" 
>
  <pds-box size-md="6" size-lg="4" size-xl="3">Item 1</pds-box>
  <pds-box direction="column" size-md="6" size-lg="4" size-xl="3">
    <p>Content 1</p>
    <p>Content 2</p>
  </pds-box>
  <pds-box size-md="6" size-lg="4" size-xl="3">Item 3</pds-box>
  <pds-box size-md="6" size-lg="4" size-xl="3">Item 4</pds-box>
</pds-row>
`;

export const Responsive = ResponsiveTemplate.bind();
Responsive.args = {
  componentId: 'opt0',
};

const NestedTemplate = (args) => html`
<pds-row
  component-id="${args.componentId}" 
>
  <pds-box size-md="8">
    <pds-row>
      <pds-box size-xl="6">Column 1 Item 1</pds-box>
      <pds-box size-xl="6">Column 1 Item 2</pds-box>
    </pds-row>
  </pds-box>
  <pds-box
    display="flex"
    size-md="4"
  >
    <pds-box
      display="flex"
      align-items="center"
      justify-content="center"
    >
      Column 2
    </pds-box>
  </pds-box>
</pds-row>
`;

export const Nested = NestedTemplate.bind();
Nested.args = {
  componentId: 'opt0',
};

const OffsetTemplate = (args) => html`
<pds-row
  component-id="${args.componentId}" 
>
  <pds-box size="4">Item 1</pds-box>
  <pds-box offset="4" size="4">Item 2</pds-box>
</pds-row>
<pds-row
  component-id="${args.componentId}" 
>
  <pds-box size-md="4">Item 1</pds-box>
  <pds-box offset-md="4" size-md="4">Item 2</pds-box>
</pds-row>
<pds-row
  component-id="${args.componentId}" 
>
  <pds-box offset="3" offset-xs="2" size="6" size-xs="8">Item 1</pds-box>
</pds-row>
`;

export const Offset = OffsetTemplate.bind();
Offset.args = {
  componentId: 'opt0',
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
    <pds-box shadow="sm">
      Item 1
    </pds-box>
    </pds-box>
    <pds-box size="8">
    <pds-box shadow="sm">
      Item 2
    </pds-box>
  </pds-box>
</pds-row>
`;


export const Gap = GapTemplate.bind();
Gap.args = {
  componentId: 'opt0',
  gap: '24px'
};


