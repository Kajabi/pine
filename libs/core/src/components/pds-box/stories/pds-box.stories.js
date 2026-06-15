import { html } from 'lit-html';

const TAG_OPTIONS = ['div', 'main', 'section', 'article', 'header', 'footer', 'nav', 'aside'];

export default {
  args: {
    border: false,
    tag: 'div',
  },
  argTypes: {
    tag: {
      control: { type: 'select' },
      options: TAG_OPTIONS,
      table: { category: 'Layout & Direction' },
    },
  },
  component: 'pds-box',
  title: 'components/Layout/Box',
};

const BaseTemplate = (args) => html`
<pds-box
	align-items="${args.alignItems}"
  align-self="${args.alignSelf}"
  auto="${args.auto}"
  background-color="${args.backgroundColor}"
	?border=${args.border}
  border-color="${args.borderColor}"
	border-radius="${args.borderRadius}"
  direction="${args.direction}"
	display="${args.display}"
  fit="${args.fit}"
  flex="${args.flex}"
  gap="${args.gap}"
  justify-content="${args.justifyContent}"
  margin-block-start="${args.marginBlockStart}"
  margin-inline-start="${args.marginInlineStart}"
  margin-inline-end="${args.marginInlineEnd}"
  margin-block-end="${args.marginBlockEnd}"
  min-width="${args.minWidth}"
  offset="${args.offset}"
  offset-xs="${args.offsetXs}"
  offset-sm="${args.offsetSm}"
  offset-md="${args.offsetMd}"
  offset-lg="${args.offsetLg}"
  offset-xl="${args.offsetXl}"
  padding="${args.padding}"
  padding-block-start="${args.paddingBlockStart}"
  padding-block-end="${args.paddingBlockEnd}"
  padding-inline-start="${args.paddingInlineStart}"
  padding-inline-end="${args.paddingInlineEnd}"
  min-height="${args.minHeight}"
  shadow="${args.shadow}"
  size="${args.size}"
  size-xs="${args.sizeXs}"
  size-sm="${args.sizeSm}"
  size-md="${args.sizeMd}"
  size-lg="${args.sizeLg}"
  size-xl="${args.sizeXl}"
  tag="${args.tag}"
>
  Box content
</pds-box>`;

export const Default = BaseTemplate.bind();
Default.args = {
  componentId: 'opt0',
  border: true,
  minHeight: '100px',
  tag: 'div',
};

export const SemanticTag = () => html`
<pds-box direction="column" gap="md">
  <pds-box tag="header" border padding="md" align-items="center" gap="sm">
    <pds-text tag="span" weight="semibold">Site header</pds-text>
    <pds-text tag="span">Navigation</pds-text>
  </pds-box>
  <pds-box tag="main" border padding="lg" direction="column" gap="sm">
    <pds-text tag="h1">Page title</pds-text>
    <pds-text tag="p">Main content rendered with tag="main".</pds-text>
  </pds-box>
  <pds-box tag="footer" border padding="md">
    <pds-text tag="p" size="sm">Footer content</pds-text>
  </pds-box>
</pds-box>`;
