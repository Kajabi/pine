import { html } from 'lit-html';
import { ifDefined } from 'lit-html/directives/if-defined.js';

export default {
  args: {
    border: false,
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
  border-block-start="${ifDefined(args.borderBlockStart)}"
  border-block-end="${ifDefined(args.borderBlockEnd)}"
  border-inline-start="${ifDefined(args.borderInlineStart)}"
  border-inline-end="${ifDefined(args.borderInlineEnd)}"
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
>
  Box content
</pds-box>`;

export const Default = BaseTemplate.bind();
Default.args = {
  componentId: 'opt0',
  border: true,
  minHeight: '100px',
};

// A wrapper with display="contents" adds no box: its children are spaced by the outer box's gap
// as if the wrapper weren't there.
export const DisplayContents = () => html`
<pds-box display="flex" gap="sm" border="true" padding="sm">
  <pds-box display="contents">
    <pds-box border="true" padding="xs">Item 1</pds-box>
    <pds-box border="true" padding="xs">Item 2</pds-box>
  </pds-box>
  <pds-box border="true" padding="xs">Item 3</pds-box>
</pds-box>`;
