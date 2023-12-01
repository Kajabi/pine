import { html } from 'lit-html';
import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';

export default {
  argTypes: extractArgTypes('pds-layout-box'),
  component: 'pds-layout-box',
  title: 'components/Layout/Box',
};

const BaseTemplate = (args) => html`
<pds-layout-box
	align-items="${args.alignItems}"
	bordered="${args.bordered}"
  border-color="${args.borderColor}"
	border-radius="${args.borderRadius}"
  direction="${args.direction}"
	display="${args.display}"
	justify-content="${args.justifyContent}"
  min-height="${args.minHeight}"
  min-width="${args.minWidth}"
  padding="${args.padding}"
  shadow="${args.shadow}"
	variant="${args.variant}"
>
  Box content
</pds-layout-box>`;

export const Default = BaseTemplate.bind();
Default.args = {
  componentId: 'opt0',
  bordered: true,
  minHeight: '100px',
};