import { html } from 'lit';

import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';

export default {
  argTypes: extractArgTypes('pds-text'),
  component: 'pds-text',
  title: 'components/Text',
}

const BaseTemplate = (args) => html`<pds-text
  align="${args.align}"
  tag="${args.tag}"
  size="${args.size}"
  weight="${args.weight}"
>
  ${args.slot}
</pds-text>`;

export const Default = BaseTemplate.bind();
Default.args = {
  slot: 'Hello World',
  tag: 'h1',
};
