import { html } from 'lit';

export default {
  component: 'pds-image',
  title: 'components/Image'
}

const BaseTemplate = (args) => html` <pds-image
  alt="${args.alt}"
  fit="${args.fit}"
  height="${args.height}"
  component-id="${args.componentId}"
  ?loading=${args.loading}
  ratio="${args.ratio}"
  sizes="${args.sizes}"
  src="${args.src}"
  srcset="${args.srcset}"
  width="${args.width}"
/>`;

const SizesAndSrcsetTemplate = (args) => html`<pds-image alt="${args.alt}" sizes="${args.sizes}" src="${args.src}" srcset="${args.srcset}" />`;

const RatioTemplate = (args) => html`<div style="width: 320px">
  <pds-image alt="${args.alt}" fit="${args.fit}" ratio="${args.ratio}" src="${args.src}" />
</div>`;

// The source is portrait while every shape below is not, so each one shows what
// the component does with the overflow.
const FitTemplate = (args) => html`<div style="display: flex; gap: 1rem;">
  ${['cover', 'contain', 'fill'].map(
    (fit) => html`<figure style="margin: 0; width: 160px;">
      <pds-image alt="${args.alt}" fit="${fit}" ratio="${args.ratio}" src="${args.src}"></pds-image>
      <figcaption><code>fit="${fit}"</code></figcaption>
    </figure>`,
  )}
</div>`;

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
  srcset: 'https://placebear.com/150/150 150w, https://placebear.com/600/200 600w',
}

export const Ratio = RatioTemplate.bind();
Ratio.args = {
  alt: 'Random Bear',
  fit: 'cover',
  ratio: 'wide',
  src: 'https://placebear.com/200/300',
}

export const Fit = FitTemplate.bind();
Fit.args = {
  alt: 'Random Bear',
  ratio: 'wide',
  src: 'https://placebear.com/200/300',
}
