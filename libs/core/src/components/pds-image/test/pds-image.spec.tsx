import { newSpecPage } from '@stencil/core/testing';
import { PdsImage } from '../pds-image';

describe('pds-image', () => {
  it('renders with an empty alt when alt prop is not set', async () => {
    const page = await newSpecPage({
      components: [PdsImage],
      html: `<pds-image class="pds-image" src="//source.unsplash.com/100x100"></pds-image>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-image class="pds-image" src="//source.unsplash.com/100x100">
        <mock:shadow-root>
          <img alt="" loading="eager" src="//source.unsplash.com/100x100" />
        </mock:shadow-root>
      </pds-image>
    `);
  });
  it('renders with lazy loading when prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsImage],
      html: `<pds-image class="pds-image" loading="lazy" src="//source.unsplash.com/100x100"></pds-image>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-image class="pds-image" loading="lazy" src="//source.unsplash.com/100x100">
        <mock:shadow-root>
          <img alt="" loading="lazy" src="//source.unsplash.com/100x100" />
        </mock:shadow-root>
      </pds-image>
    `)
  })
  it('renders with height when height prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsImage],
      html: `<pds-image class="pds-image" height="100" src="//source.unsplash.com/100x100"></pds-image>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-image class="pds-image" height="100" src="//source.unsplash.com/100x100">
        <mock:shadow-root>
          <img alt="" height="100" loading="eager" src="//source.unsplash.com/100x100" />
        </mock:shadow-root>
      </pds-image>
    `)
  })
  it('renders with width when width prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsImage],
      html: `<pds-image class="pds-image" src="//source.unsplash.com/100x100" width="100"></pds-image>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-image class="pds-image" src="//source.unsplash.com/100x100" width="100">
        <mock:shadow-root>
          <img alt="" loading="eager" src="//source.unsplash.com/100x100" width="100" />
        </mock:shadow-root>
      </pds-image>
    `)
  })
  it('renders with sizes when sizes prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsImage],
      html: `<pds-image class="pds-image" sizes="(max-width: 400px) 100px" src="//source.unsplash.com/100x100"></pds-image>`
    })
    expect(page.root).toEqualHtml(`
      <pds-image class="pds-image" sizes="(max-width: 400px) 100px" src="//source.unsplash.com/100x100">
        <mock:shadow-root>
          <img alt="" loading="eager" sizes="(max-width: 400px) 100px" src="//source.unsplash.com/100x100" />
        </mock:shadow-root>
      </pds-image>
    `)
  })
  it('renders with a srcset when srcset prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsImage],
      html: `
        <pds-image class="pds-image" src="//source.unsplash.com/500x500" srcset="//source.unsplash.com/100x100 400px, //source.unsplash.com/500x500"></pds-image>`
    })
    expect(page.root).toEqualHtml(`
      <pds-image class="pds-image" src="//source.unsplash.com/500x500" srcset="//source.unsplash.com/100x100 400px, //source.unsplash.com/500x500" />
        <mock:shadow-root>
          <img alt="" loading="eager" src="//source.unsplash.com/500x500" srcset="//source.unsplash.com/100x100 400px, //source.unsplash.com/500x500" />
        </mock:shadow-root>
      </pds-image>
    `)
  })
  it('renders with correct aspect ratio when custom property is set', async () => {
    const page = await newSpecPage({
      components: [PdsImage],
      html: `
        <pds-image class="pds-image" src="//source.unsplash.com/100x100" style="--image-aspect-ratio: 16 / 9"></pds-image>
      `
    })
    expect(page.root).toEqualHtml(`
      <pds-image class="pds-image" src="//source.unsplash.com/100x100" style="--image-aspect-ratio: 16 / 9">
        <mock:shadow-root>
          <img alt="" loading="eager" src="//source.unsplash.com/100x100" />
        </mock:shadow-root>
      </pds-image>
    `);
  })
});
