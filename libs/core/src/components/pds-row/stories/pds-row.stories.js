import { html } from 'lit-html';
import { ifDefined } from 'lit-html/directives/if-defined.js';

export default {
  component: 'pds-row',
  title: 'components/Layout/Row',
};

const BaseTemplate = (args) => html`
<pds-row
  align-items="${ifDefined(args.alignItems)}"
  ?border=${args.border}
  component-id="${ifDefined(args.componentId)}"
  col-gap="${ifDefined(args.colGap)}"
  justify-content="${ifDefined(args.justifyContent)}"
  min-height="${ifDefined(args.minHeight)}"
  ?no-wrap=${args.noWrap}
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
  colGap: 'sm',
};

const GapTemplate = (args) => html`
<pds-row
  align-items="${ifDefined(args.alignItems)}"
  ?border=${args.border}
  component-id="${ifDefined(args.componentId)}"
  col-gap="${ifDefined(args.colGap)}"
  justify-content="${ifDefined(args.justifyContent)}"
  min-height="${ifDefined(args.minHeight)}"
>
  <pds-box size="4">
    <pds-box
      border="true"
      border-radius="sm"
      padding="sm"
      shadow="100"
    >
      Item 1
    </pds-box>
  </pds-box>
  <pds-box size="8">
    <pds-box
      border="true"
      border-radius="sm"
      padding="sm"
      shadow="100"
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


