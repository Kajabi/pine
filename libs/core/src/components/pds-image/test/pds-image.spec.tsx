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

  it('renders with id when prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsImage],
      html: `<pds-image class="pds-image" component-id="test" src="//source.unsplash.com/100x100"></pds-image>`,
    });

    expect(page.root).toEqualHtml(`
      <pds-image class="pds-image" component-id="test" id="test" src="//source.unsplash.com/100x100">
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
  it('passes the aspect-ratio custom property through to the host', async () => {
    const page = await newSpecPage({
      components: [PdsImage],
      html: `
        <pds-image class="pds-image" src="//source.unsplash.com/100x100" style="--dimension-aspect-ratio: 16 / 9"></pds-image>
      `
    })
    expect(page.root).toEqualHtml(`
      <pds-image class="pds-image" src="//source.unsplash.com/100x100" style="--dimension-aspect-ratio: 16 / 9">
        <mock:shadow-root>
          <img alt="" loading="eager" src="//source.unsplash.com/100x100" />
        </mock:shadow-root>
      </pds-image>
    `);
  })
  it('renders with a preset ratio and the default fit when ratio prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsImage],
      html: `<pds-image class="pds-image" ratio="wide" src="//source.unsplash.com/100x100"></pds-image>`
    })
    expect(page.root).toEqualHtml(`
      <pds-image class="pds-image pds-image--has-ratio" ratio="wide" src="//source.unsplash.com/100x100">
        <mock:shadow-root>
          <img alt="" loading="eager" src="//source.unsplash.com/100x100" style="aspect-ratio: 16 / 9; object-fit: cover;" />
        </mock:shadow-root>
      </pds-image>
    `);
  })
  it('renders with a custom ratio when ratio prop is a css ratio value', async () => {
    const page = await newSpecPage({
      components: [PdsImage],
      html: `<pds-image class="pds-image" ratio="21 / 9" src="//source.unsplash.com/100x100"></pds-image>`
    })
    expect(page.root).toEqualHtml(`
      <pds-image class="pds-image pds-image--has-ratio" ratio="21 / 9" src="//source.unsplash.com/100x100">
        <mock:shadow-root>
          <img alt="" loading="eager" src="//source.unsplash.com/100x100" style="aspect-ratio: 21 / 9; object-fit: cover;" />
        </mock:shadow-root>
      </pds-image>
    `);
  })
  it('renders with the given fit when fit prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsImage],
      html: `<pds-image class="pds-image" fit="contain" ratio="tall" src="//source.unsplash.com/100x100"></pds-image>`
    })
    expect(page.root).toEqualHtml(`
      <pds-image class="pds-image pds-image--has-ratio" fit="contain" ratio="tall" src="//source.unsplash.com/100x100">
        <mock:shadow-root>
          <img alt="" loading="eager" src="//source.unsplash.com/100x100" style="aspect-ratio: 9 / 16; object-fit: contain;" />
        </mock:shadow-root>
      </pds-image>
    `);
  })
  it('renders without a fit when fit prop is set but ratio prop is not', async () => {
    const page = await newSpecPage({
      components: [PdsImage],
      html: `<pds-image class="pds-image" fit="contain" src="//source.unsplash.com/100x100"></pds-image>`
    })
    expect(page.root).toEqualHtml(`
      <pds-image class="pds-image" fit="contain" src="//source.unsplash.com/100x100">
        <mock:shadow-root>
          <img alt="" loading="eager" src="//source.unsplash.com/100x100" />
        </mock:shadow-root>
      </pds-image>
    `);
  })
});
