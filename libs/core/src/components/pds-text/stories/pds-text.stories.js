import { html } from 'lit';

import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';

export default {
  argTypes: extractArgTypes('pds-text'),
  component: 'pds-text',
  title: 'components/Text',
}

const BaseTemplate = (args) => html`
<pds-text
  align="${args.align}"
  color="${args.color}"
  size="${args.size}"
  tag="${args.tag}"
  weight="${args.weight}"
  decoration="${args.decoration}"
>
  ${args.slot}
</pds-text>`;

export const Default = BaseTemplate.bind();
Default.args = {
  slot: 'Hello World',
  tag: 'h1',
};

export const Align = BaseTemplate.bind();
Align.args = {
  slot: '"Had to be me. Someone else might have gotten it wrong."',
  align: 'center',
  tag: 'em',
};

export const Color = BaseTemplate.bind();
Color.args = {
  slot: 'Hello World',
  color: 'accent',
  tag: 'p',
};

export const Decoration = BaseTemplate.bind();
Decoration.args = {
  slot: 'Hello World',
  tag: 'p',
  decoration: 'underline-dotted',
};

export const FontSize = BaseTemplate.bind();
FontSize.args = {
  slot: 'Hello World',
  size: '2xl',
  tag: 'p',
};

export const FontWeight = BaseTemplate.bind();
FontWeight.args = {
  slot: 'Hello World',
  weight: 'bold',
  tag: 'p',
};

const GutterTemplate = (args) => html`
<pds-text
  align="${args.align}"
  color="${args.color}"
  gutter="${args.gutter}"
  size="${args.size}"
  tag="${args.tag}"
  weight="${args.weight}"
  truncate
>
  ${args.slot}
</pds-text>
<pds-text tag="p">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed</pds-text>`;

export const Gutter = GutterTemplate.bind();
Gutter.args = {
  slot: 'Title',
  gutter: 'lg',
  tag: 'h2',
};

const ItalicTemplate = (args) => html`
<pds-text
  align="${args.align}"
  color="${args.color}"
  size="${args.size}"
  tag="${args.tag}"
  weight="${args.weight}"
  italic
>
  ${args.slot}
</pds-text>`;

export const Italic = ItalicTemplate.bind();
Italic.args = {
  slot: 'Id irure id magna ipsum voluptate irure esse eu nulla',
  tag: 'p',
};

const TruncateTemplate = (args) => html`
<pds-text
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
  slot: 'Id irure id magna ipsum voluptate irure esse eu nulla. Ullamco officia adipisicing qui nulla non sint. Mollit tempor veniam quis nisi aliqua duis elit eu laborum et incididunt ut sit irure. Nisi aute veniam sint do amet consectetur velit. Quis sunt enim mollit deserunt laboris dolor elit exercitation. Id labore deserunt sint consequat laboris nulla do ut magna. Aliquip labore esse sint consequat voluptate tempor consectetur sit sint culpa occaecat ut velit est.',
  tag: 'p',
};
