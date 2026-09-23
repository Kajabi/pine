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

export const PerSideBorders = () => html`
<pds-box direction="column" gap="lg">
  <pds-box direction="column">
    <pds-box border-block-end="true" padding="sm">Divider row one</pds-box>
    <pds-box border-block-end="true" padding="sm">Divider row two</pds-box>
    <pds-box padding="sm">Last row, no divider</pds-box>
  </pds-box>

  <pds-box>
    <pds-box border-inline-end="true" padding="sm" min-width="140px">Sidebar rail</pds-box>
    <pds-box padding="sm">Main content</pds-box>
  </pds-box>

  <pds-box direction="column">
    <pds-box border="true" padding="sm">All four sides</pds-box>
    <pds-box border="true" border-block-start="false" padding="sm">Block-start removed</pds-box>
  </pds-box>
</pds-box>`;
