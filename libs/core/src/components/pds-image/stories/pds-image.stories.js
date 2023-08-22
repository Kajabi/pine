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
  loading="${args.loading}"
  sizes="${args.sizes}"
  src="${args.src}"
  srcset="${args.srcset}"
  width="${args.width}"
/>`;

const SizesAndSrcsetTemplate = (args) => html`<pds-image alt="${args.alt}" sizes="${args.sizes}" src="${args.src}" srcset="${args.srcset}" />`;

export const Default = BaseTemplate.bind();
Default.args = {
  alt: 'Random Unsplash',
  src: '//source.unsplash.com/320x180'
}

export const SizesAndSrcset = SizesAndSrcsetTemplate.bind();
SizesAndSrcset.args = {
  alt: 'Random Unsplash',
  sizes: '(max-width: 450px) 150px, 600px',
  src: '//source.unsplash.com/600x200',
  srcset: '//source.unsplash.com/150x150 400w, //source.unsplash.com/600x200',
}
