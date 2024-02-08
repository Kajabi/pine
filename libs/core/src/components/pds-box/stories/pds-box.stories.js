import { html } from 'lit-html';
import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';

export default {
  argTypes: extractArgTypes('pds-box'),
  args: {
    border: false,
  },
  component: 'pds-box',
  title: 'components/Layout/Box',
};

const BaseTemplate = (args) => html`
<pds-box
	align-items="${args.alignItems}"
  background-color="${args.backgroundColor}"
	border="${args.border}"
  border-color="${args.borderColor}"
	border-radius="${args.borderRadius}"
  direction="${args.direction}"
	display="${args.display}"
	justify-content="${args.justifyContent}"
  min-height="${args.minHeight}"
  min-width="${args.minWidth}"
  padding="${args.padding}"
  shadow="${args.shadow}"
>
  Box content
</pds-box>`;

export const Default = BaseTemplate.bind();
Default.args = {
  componentId: 'opt0',
  border: true,
  minHeight: '100px',
};