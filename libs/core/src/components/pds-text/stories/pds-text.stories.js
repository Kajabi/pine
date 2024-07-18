import { html } from 'lit';

import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';

export default {
  argTypes: extractArgTypes('pds-text'),
  component: 'pds-text',
  title: 'components/Text',
}

const BaseTemplate = () => html`<pds-text

>
</pds-text>`;

export const Default = BaseTemplate.bind();
