import { html } from 'lit';
import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';

export default {
  argTypes: extractArgTypes('pds-image'),
  component: 'pds-image',
  title: 'components/Image'
}

const BaseTemplate = (args) => html` <pds-image
  alt="${args.alt}"
  height="${args.height}"
  component-id="${args.componentId}"
  loading="${args.loading}"
  sizes="${args.sizes}"
  src="${args.src}"
  srcset="${args.srcset}"
  width="${args.width}"
/>`;

const SizesAndSrcsetTemplate = (args) => html`<pds-image alt="${args.alt}" sizes="${args.sizes}" src="${args.src}" srcset="${args.srcset}" />`;

export const Default = BaseTemplate.bind();
Default.args = {
  alt: 'Random Bear',
  src: 'https://placebear.com/320/180',
  height: '180',
  width: '320'
}

export const SizesAndSrcset = SizesAndSrcsetTemplate.bind();
SizesAndSrcset.args = {
  alt: 'Random Bear',
  sizes: '(max-width: 450px) 150px, 600px',
  src: 'https://placebear.com/600/200',
  srcset: 'https://placebear.com/150/150 400w, https://placebear.com/600/200',
}
