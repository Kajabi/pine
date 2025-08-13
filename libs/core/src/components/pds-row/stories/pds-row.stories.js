import { html } from 'lit-html';
import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';

export default {
  argTypes: extractArgTypes('pds-row'),
  component: 'pds-row',
  title: 'components/Layout/Row',
};

const BaseTemplate = (args) => html`
<pds-row
  align-items="${args.alignItems}"
  .border=${args.border}
  border-color="${args.borderColor}"
  border-radius="${args.borderRadius}"
  col-gap="${args.colGap}"
  justify-content="${args.justifyContent}"
  min-height="${args.minHeight}"
  .no-wrap=${args.noWrap}
>
  <pds-box border>Item 1</pds-box>
  <pds-box border direction="column">
    <p>Content 1</p>
    <p>Content 2</p>
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
  .border=${args.border}
  border-color="${args.borderColor}"
  border-radius="${args.borderRadius}"
  col-gap="${args.colGap}"
  justify-content="${args.justifyContent}"
  min-height="${args.minHeight}"
  .no-wrap=${args.noWrap}
>
  <pds-box border>Item 1</pds-box>
  <pds-box border>Item 2</pds-box>
  <pds-box border>Item 3</pds-box>
  <pds-box border>Item 4</pds-box>
  <pds-box border>Item 5</pds-box>
  <pds-box border>Item 6</pds-box>
  <pds-box border>Item 7</pds-box>
  <pds-box border>Item 8</pds-box>
  <pds-box border>Item 9</pds-box>
  <pds-box border>Item 10</pds-box>
</pds-row>
`;

export const Gap = GapTemplate.bind();
Gap.args = {
  border: true,
  componentId: 'opt1',
  colGap: '8px',
};

const NoWrapTemplate = (args) => html`
<pds-row
  align-items="${args.alignItems}"
  .border=${args.border}
  border-color="${args.borderColor}"
  border-radius="${args.borderRadius}"
  col-gap="${args.colGap}"
  justify-content="${args.justifyContent}"
  min-height="${args.minHeight}"
  .no-wrap=${args.noWrap}
>
  <pds-box border>Item 1</pds-box>
  <pds-box border>Item 2</pds-box>
  <pds-box border>Item 3</pds-box>
  <pds-box border>Item 4</pds-box>
  <pds-box border>Item 5</pds-box>
  <pds-box border>Item 6</pds-box>
  <pds-box border>Item 7</pds-box>
  <pds-box border>Item 8</pds-box>
  <pds-box border>Item 9</pds-box>
  <pds-box border>Item 10</pds-box>
</pds-row>
`;

export const NoWrap = NoWrapTemplate.bind();
NoWrap.args = {
  border: true,
  componentId: 'opt2',
  colGap: '8px',
  noWrap: true,
};

