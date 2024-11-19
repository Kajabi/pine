import { html } from 'lit';

import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';

export default {
  argTypes: extractArgTypes('pds-text'),
  component: 'pds-text',
  title: 'components/Text',
}

const BaseTemplate = (args) => html`<pds-text
  align="${args.align}"
  color="${args.color}"
  size="${args.size}"
  tag="${args.tag}"
  weight="${args.weight}"
>
  ${args.slot}
</pds-text>`;

export const Default = BaseTemplate.bind();
Default.args = {
  slot: 'Hello World',
  tag: 'h1',
};

const TruncateTemplate = (args) => html`<pds-text
  align="${args.align}"
  color="${args.color}"
  size="${args.size}"
  tag="${args.tag}"
  weight="${args.weight}"
  truncate
>
  ${args.slot}
</pds-text>`;

export const Truncate = TruncateTemplate.bind();
Truncate.args = {
  slot: 'loremId irure id magna ipsum voluptate irure esse eu nulla. Ullamco officia adipisicing qui nulla non sint. Mollit tempor veniam quis nisi aliqua duis elit eu laborum et incididunt ut sit irure. Nisi aute veniam sint do amet consectetur velit. Quis sunt enim mollit deserunt laboris dolor elit exercitation. Id labore deserunt sint consequat laboris nulla do ut magna. Aliquip labore esse sint consequat voluptate tempor consectetur sit sint culpa occaecat ut velit est.',
  tag: 'p',
};
