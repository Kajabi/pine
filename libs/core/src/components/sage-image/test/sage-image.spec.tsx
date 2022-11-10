import { newSpecPage } from '@stencil/core/testing';
import { SageImage } from '../sage-image';

describe('sage-image', () => {
  it('renders with an empty alt when alt prop is not set', async () => {
    const page = await newSpecPage({
      components: [SageImage],
      html: `<sage-image class="sage-image" src="//source.unsplash.com/100x100"></sage-image>`,
    });
    expect(page.root).toEqualHtml(`
      <sage-image class="sage-image" src="//source.unsplash.com/100x100">
        <mock:shadow-root>
          <img alt="" loading="eager" src="//source.unsplash.com/100x100" />
        </mock:shadow-root>
      </sage-image>
    `);
  });
  it('renders with lazy loading when prop is set', async () => {
    const page = await newSpecPage({
      components: [SageImage],
      html: `<sage-image class="sage-image" loading="lazy" src="//source.unsplash.com/100x100"></sage-image>`,
    });
    expect(page.root).toEqualHtml(`
      <sage-image class="sage-image" loading="lazy" src="//source.unsplash.com/100x100">
        <mock:shadow-root>
          <img alt="" loading="lazy" src="//source.unsplash.com/100x100" />
        </mock:shadow-root>
      </sage-image>
    `)
  })
  it('renders with height when height prop is set', async () => {
    const page = await newSpecPage({
      components: [SageImage],
      html: `<sage-image class="sage-image" height="100" src="//source.unsplash.com/100x100"></sage-image>`,
    });
    expect(page.root).toEqualHtml(`
      <sage-image class="sage-image" height="100" src="//source.unsplash.com/100x100">
        <mock:shadow-root>
          <img alt="" height="100" loading="eager" src="//source.unsplash.com/100x100" />
        </mock:shadow-root>
      </sage-image>
    `)
  })
  it('renders with width when width prop is set', async () => {
    const page = await newSpecPage({
      components: [SageImage],
      html: `<sage-image class="sage-image" src="//source.unsplash.com/100x100" width="100"></sage-image>`,
    });
    expect(page.root).toEqualHtml(`
      <sage-image class="sage-image" src="//source.unsplash.com/100x100" width="100">
        <mock:shadow-root>
          <img alt="" loading="eager" src="//source.unsplash.com/100x100" width="100" />
        </mock:shadow-root>
      </sage-image>
    `)
  })
  it('renders with sizes when sizes prop is set', async () => {
    const page = await newSpecPage({
      components: [SageImage],
      html: `<sage-image class="sage-image" sizes="(max-width: 400px) 100px" src="//source.unsplash.com/100x100"></sage-image>`
    })
    expect(page.root).toEqualHtml(`
      <sage-image class="sage-image" sizes="(max-width: 400px) 100px" src="//source.unsplash.com/100x100">
        <mock:shadow-root>
          <img alt="" loading="eager" sizes="(max-width: 400px) 100px" src="//source.unsplash.com/100x100" />
        </mock:shadow-root>
      </sage-image>
    `)
  })
  it('renders with a srcset when srcset prop is set', async () => {
    const page = await newSpecPage({
      components: [SageImage],
      html: `
        <sage-image class="sage-image" src="//source.unsplash.com/500x500" srcset="//source.unsplash.com/100x100 400px, //source.unsplash.com/500x500"></sage-image>`
    })
    expect(page.root).toEqualHtml(`
      <sage-image class="sage-image" src="//source.unsplash.com/500x500" srcset="//source.unsplash.com/100x100 400px, //source.unsplash.com/500x500" />
        <mock:shadow-root>
          <img alt="" loading="eager" src="//source.unsplash.com/500x500" srcset="//source.unsplash.com/100x100 400px, //source.unsplash.com/500x500" />
        </mock:shadow-root>
      </sage-image>
    `)
  })
  it('renders with correct aspect ratio when custom property is set', async () => {
    const page = await newSpecPage({
      components: [SageImage],
      html: `
        <sage-image class="sage-image" src="//source.unsplash.com/100x100" style="--image-aspect-ratio: 16 / 9"></sage-image>
      `
    })
    expect(page.root).toEqualHtml(`
      <sage-image class="sage-image" src="//source.unsplash.com/100x100" style="--image-aspect-ratio: 16 / 9">
        <mock:shadow-root>
          <img alt="" loading="eager" src="//source.unsplash.com/100x100" />
        </mock:shadow-root>
      </sage-image>
    `);
  })
});
