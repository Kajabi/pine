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

// Each frame covers its image with a placeholder until `pdsImageLoad` removes it, or swaps
// the placeholder for an error message on `pdsImageError`. The placeholder sits over the
// image rather than hiding it, since a hidden image with `loading="lazy"` never loads.
const showState = (event, state) => {
  const frame = event.target.closest('[data-image-frame]');
  frame.querySelector('[data-image-placeholder]').hidden = state !== 'loading';
  frame.querySelector('[data-image-error]').hidden = state !== 'error';
};

const overlayStyle = 'position: absolute; inset: 0;';

const EventsTemplate = (args) => {
  // Reloading changes `src`, which emits the events again for the new image.
  const reload = (event) => {
    event.target.closest('[data-image-events]').querySelectorAll('[data-image-frame]').forEach((frame) => {
      const image = frame.querySelector('pds-image');
      const url = new URL(image.getAttribute('src'), window.location.href);
      url.searchParams.set('reload', Date.now());
      frame.querySelector('[data-image-placeholder]').hidden = false;
      frame.querySelector('[data-image-error]').hidden = true;
      image.setAttribute('src', url.href);
    });
  };

  return html`<pds-box data-image-events direction="column" gap="md">
    <pds-box gap="md" wrap>
      ${[
        { caption: 'Loads', src: args.src },
        { caption: 'Fails to load', src: args.brokenSrc },
      ].map(
        ({ caption, src }) => html`<figure data-image-frame style="margin: 0; width: 240px;">
          <div style="position: relative;">
            <pds-image
              alt="${args.alt}"
              ratio="landscape"
              src="${src}"
              @pdsImageLoad=${(event) => showState(event, 'loaded')}
              @pdsImageError=${(event) => showState(event, 'error')}
            ></pds-image>
            <pds-box
              data-image-placeholder
              align-items="center"
              background-color="var(--pine-color-background-muted)"
              justify-content="center"
              style="${overlayStyle}"
            >
              <pds-text color="secondary" size="sm">Loading image…</pds-text>
            </pds-box>
            <pds-box
              data-image-error
              hidden
              align-items="center"
              background-color="var(--pine-color-background-inset)"
              justify-content="center"
              style="${overlayStyle}"
            >
              <pds-text color="secondary" size="sm">This image couldn't load</pds-text>
            </pds-box>
          </div>
          <figcaption><pds-text size="sm">${caption}</pds-text></figcaption>
        </figure>`,
      )}
    </pds-box>
    <div>
      <pds-button variant="secondary" @pdsClick=${reload}>Reload images</pds-button>
    </div>
  </pds-box>`;
};

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
  srcset: 'https://placebear.com/150/50 150w, https://placebear.com/600/200 600w',
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

export const Events = EventsTemplate.bind();
Events.args = {
  alt: 'Random Bear',
  brokenSrc: 'https://placebear.com/does-not-exist.png',
  src: 'https://placebear.com/400/300',
}
