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

const TruncateTemplate = (args) => html`
<div style="width: ${args.width || '250px'};">
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
</div>
<pds-text tag="p" size="xs" color="secondary" gutter="sm">Hover over the truncated text above to see the full content in a tooltip.</pds-text>`;

export const Truncate = TruncateTemplate.bind();
Truncate.args = {
  slot: 'Id irure id magna ipsum voluptate irure esse eu nulla. Ullamco officia adipisicing qui nulla non sint. Mollit tempor veniam quis nisi aliqua duis elit eu laborum et incididunt ut sit irure.',
  tag: 'p',
  italic: false,
  truncate: true,
  width: '250px',
};
