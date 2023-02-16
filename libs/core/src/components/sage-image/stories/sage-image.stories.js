import { html, render } from 'lit-html';

const BaseTemplate = (args) => html` <sage-image
  alt="${args.alt}"
  height="${args.height}"
  loading="${args.loading}"
  sizes="${args.sizes}"
  src="${args.src}"
  srcset="${args.srcset}"
  width="${args.width}"
/>`;

const SizesAndSrcsetTemplate = (args) => html`<sage-image alt="${args.alt}" sizes="${args.sizes}" src="${args.src}" srcset="${args.srcset}" />`;

const defaultParameters = { docs: { disable: true } };

export const Default = BaseTemplate.bind();
Default.args = {
  alt: 'Random Unsplash',
  src: '//source.unsplash.com/320x180'
}
Default.parameters = { ...defaultParameters };

export const SizesAndSrcset = SizesAndSrcsetTemplate.bind();
SizesAndSrcset.args = {
  alt: 'Random Unsplash',
  sizes: '(max-width: 450px) 150px, 600px',
  src: '//source.unsplash.com/600x200',
  srcset: '//source.unsplash.com/150x150 400w, //source.unsplash.com/600x200',
}
SizesAndSrcset.parameters = { ...defaultParameters };
