import { html } from 'lit';


export default {
  component: 'pds-text',
  title: 'components/Text',
}

const BaseTemplate = (args) => html`
<pds-text
  align="${args.align}"
  color="${args.color}"
  decoration="${args.decoration}"
  gutter="${args.gutter}"
  ?italic="${args.italic}"
  size="${args.size}"
  tag="${args.tag}"
  ?truncate="${args.truncate}"
  weight="${args.weight}"
>
  ${args.slot}
</pds-text>`;

export const Default = BaseTemplate.bind();
Default.args = {
  slot: 'Hello World',
  tag: 'h1',
  italic: false,
  truncate: false,
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
  decoration="${args.decoration}"
  gutter="${args.gutter}"
  ?italic="${args.italic}"
  size="${args.size}"
  tag="${args.tag}"
  ?truncate="${args.truncate}"
  weight="${args.weight}"
>
  ${args.slot}
</pds-text>
<pds-text tag="p">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed</pds-text>`;

export const Gutter = GutterTemplate.bind();
Gutter.args = {
  slot: 'Title',
  gutter: 'lg',
  tag: 'h2',
  italic: false,
  truncate: true,
};

export const Italic = BaseTemplate.bind();
Italic.args = {
  slot: 'Id irure id magna ipsum voluptate irure esse eu nulla',
  tag: 'p',
  italic: true,
  truncate: false,
};

export const Truncate = BaseTemplate.bind();
Truncate.args = {
  slot: 'Id irure id magna ipsum voluptate irure esse eu nulla. Ullamco officia adipisicing qui nulla non sint. Mollit tempor veniam quis nisi aliqua duis elit eu laborum et incididunt ut sit irure. Nisi aute veniam sint do amet consectetur velit. Quis sunt enim mollit deserunt laboris dolor elit exercitation. Id labore deserunt sint consequat laboris nulla do ut magna. Aliquip labore esse sint consequat voluptate tempor consectetur sit sint culpa occaecat ut velit est.',
  tag: 'p',
  italic: false,
  truncate: true,
};
