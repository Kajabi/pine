import { html } from 'lit-html';

export default {
  component: 'pds-row',
  title: 'components/Layout/Row',
};

const BaseTemplate = (args) => html`
<pds-row
  align-items="${args.alignItems}"
  ?border=${args.border}
  component-id="${args.componentId}"
  col-gap="${args.colGap}"
  justify-content="${args.justifyContent}"
  min-height="${args.minHeight}"
  no-wrap="${args.noWrap}"
>
  <pds-box>
    <pds-box border>Item 1</pds-box>
  </pds-box>
  <pds-box>
    <pds-box border direction="column">
      <p>Content 1</p>
      <p>Content 2</p>
    </pds-box>
  </pds-box>
</pds-row>
`;

export const Default = BaseTemplate.bind();
Default.args = {
  border: true,
  componentId: 'opt0',
  colGap: '8px',
};

const GapTemplate = (args) => html`
<pds-row
  align-items="${args.alignItems}"
  ?border=${args.border}
  component-id="${args.componentId}"
  col-gap="${args.colGap}"
  justify-content="${args.justifyContent}"
  min-height="${args.minHeight}"
>
  <pds-box size="4">
    <pds-box
      border="true"
      border-radius="sm"
      padding="sm"
      shadow="sm"
    >
      Item 1
    </pds-box>
  </pds-box>
  <pds-box size="8">
    <pds-box
      border="true"
      border-radius="sm"
      padding="sm"
      shadow="sm"
    >
      Item 2
    </pds-box>
  </pds-box>
</pds-row>
`;


export const Gap = GapTemplate.bind();
Gap.args = {
  border: false,
  componentId: 'opt0',
  colGap: 'sm',
};


