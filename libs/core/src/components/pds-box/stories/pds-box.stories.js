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
	align-items="${ifDefined(args.alignItems)}"
  align-self="${ifDefined(args.alignSelf)}"
  ?auto=${args.auto}
  background-color="${ifDefined(args.backgroundColor)}"
	?border=${args.border}
  border-block-start="${ifDefined(args.borderBlockStart)}"
  border-block-end="${ifDefined(args.borderBlockEnd)}"
  border-inline-start="${ifDefined(args.borderInlineStart)}"
  border-inline-end="${ifDefined(args.borderInlineEnd)}"
  border-color="${ifDefined(args.borderColor)}"
	border-radius="${ifDefined(args.borderRadius)}"
  container="${ifDefined(args.container)}"
  direction="${ifDefined(args.direction)}"
	display="${ifDefined(args.display)}"
  ?fit=${args.fit}
  flex="${ifDefined(args.flex)}"
  gap="${ifDefined(args.gap)}"
  justify-content="${ifDefined(args.justifyContent)}"
  margin-block-start="${ifDefined(args.marginBlockStart)}"
  margin-inline-start="${ifDefined(args.marginInlineStart)}"
  margin-inline-end="${ifDefined(args.marginInlineEnd)}"
  margin-block-end="${ifDefined(args.marginBlockEnd)}"
  min-width="${ifDefined(args.minWidth)}"
  offset="${ifDefined(args.offset)}"
  offset-xs="${ifDefined(args.offsetXs)}"
  offset-sm="${ifDefined(args.offsetSm)}"
  offset-md="${ifDefined(args.offsetMd)}"
  offset-lg="${ifDefined(args.offsetLg)}"
  offset-xl="${ifDefined(args.offsetXl)}"
  padding="${ifDefined(args.padding)}"
  padding-block-start="${ifDefined(args.paddingBlockStart)}"
  padding-block-end="${ifDefined(args.paddingBlockEnd)}"
  padding-inline-start="${ifDefined(args.paddingInlineStart)}"
  padding-inline-end="${ifDefined(args.paddingInlineEnd)}"
  min-height="${ifDefined(args.minHeight)}"
  shadow="${ifDefined(args.shadow)}"
  size="${ifDefined(args.size)}"
  size-xs="${ifDefined(args.sizeXs)}"
  size-sm="${ifDefined(args.sizeSm)}"
  size-md="${ifDefined(args.sizeMd)}"
  size-lg="${ifDefined(args.sizeLg)}"
  size-xl="${ifDefined(args.sizeXl)}"
>
  Box content
</pds-box>`;

export const Default = BaseTemplate.bind();
Default.args = {
  border: true,
  minHeight: '100px',
};

const footerTemplate = (args) => html`
<pds-box fit border="true" padding="sm" gap="sm" align-items="center">
  <pds-button variant="destructive">Delete</pds-button>
  <pds-box flex="none" gap="sm" margin-inline-start="${ifDefined(args.marginInlineStart)}">
    <pds-button variant="secondary">Cancel</pds-button>
    <pds-button>Save</pds-button>
  </pds-box>
</pds-box>`;

export const MarginAuto = footerTemplate.bind();
MarginAuto.args = {
  marginInlineStart: 'auto',
};

const flexTemplate = (args) => html`
<pds-container size="sm">
  <pds-box fit border="true" padding="xs" gap="xs">
    <pds-box flex="${ifDefined(args.flex)}" border="true" padding="xs">A box with long text that needs more room than the row has to give it.</pds-box>
    <pds-box flex="${ifDefined(args.flex)}" border="true" padding="xs">A second box with long text that also needs more room than the row has.</pds-box>
  </pds-box>
</pds-container>`;

export const FlexShrink = flexTemplate.bind();
FlexShrink.args = {
  flex: 'shrink',
};

const containerTemplate = (args) => html`
<pds-container size="sm">
  <pds-box fit border="true" padding="sm" gap="sm" align-items="center">
    <pds-box container="${ifDefined(args.container)}" direction="column">
      <pds-text truncate>A long file name that should truncate rather than push the action out of the card.pdf</pds-text>
    </pds-box>
    <pds-button variant="secondary">Replace</pds-button>
  </pds-box>
</pds-container>`;

export const Container = containerTemplate.bind();
Container.args = {
  container: 'inline-size',
};
