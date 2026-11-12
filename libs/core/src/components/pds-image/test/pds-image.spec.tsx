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
  it('drops the ratio shape when the ratio attribute is removed, not just left unset', async () => {
    // Removing an attribute sets its prop to `null`, not `undefined`, so a check against only
    // `undefined` would leave `pds-image--has-ratio` (and the inline aspect-ratio/object-fit) on.
    const page = await newSpecPage({
      components: [PdsImage],
      html: `<pds-image class="pds-image" ratio="wide" src="//source.unsplash.com/100x100"></pds-image>`
    })

    page.root.removeAttribute('ratio');
    await page.waitForChanges();

    expect(page.root).toEqualHtml(`
      <pds-image class="pds-image" src="//source.unsplash.com/100x100">
        <mock:shadow-root>
          <img alt="" loading="eager" src="//source.unsplash.com/100x100" />
        </mock:shadow-root>
      </pds-image>
    `);
  })

  describe('events', () => {
    const setImageState = (img: HTMLImageElement, state: Record<string, unknown>) => {
      Object.entries(state).forEach(([key, value]) => Object.defineProperty(img, key, { configurable: true, value }));
    };

    it('emits pdsImageLoad with the natural size and source when the image loads', async () => {
      const page = await newSpecPage({
        components: [PdsImage],
        html: `<pds-image src="/a.png"></pds-image>`,
      });
      const spy = jest.fn();
      page.root.addEventListener('pdsImageLoad', spy);
      const img = page.root.shadowRoot.querySelector('img');
      setImageState(img, { currentSrc: '/a.png', naturalHeight: 50, naturalWidth: 100 });

      img.dispatchEvent(new Event('load'));

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy.mock.calls[0][0].detail).toEqual({ currentSrc: '/a.png', naturalHeight: 50, naturalWidth: 100 });
    });

    it('emits pdsImageError with the failed source when the image fails', async () => {
      const page = await newSpecPage({
        components: [PdsImage],
        html: `<pds-image src="/missing.png"></pds-image>`,
      });
      const loadSpy = jest.fn();
      const errorSpy = jest.fn();
      page.root.addEventListener('pdsImageLoad', loadSpy);
      page.root.addEventListener('pdsImageError', errorSpy);
      const img = page.root.shadowRoot.querySelector('img');
      setImageState(img, { currentSrc: '/missing.png' });

      img.dispatchEvent(new Event('error'));

      expect(loadSpy).not.toHaveBeenCalled();
      expect(errorSpy).toHaveBeenCalledTimes(1);
      expect(errorSpy.mock.calls[0][0].detail).toEqual({ currentSrc: '/missing.png' });
    });

    it('emits pdsImageLoad once when the image was already complete on first render', async () => {
      const page = await newSpecPage({
        components: [PdsImage],
        html: `<pds-image src="/cached.png"></pds-image>`,
      });
      const spy = jest.fn();
      page.root.addEventListener('pdsImageLoad', spy);
      const img = page.root.shadowRoot.querySelector('img');
      setImageState(img, { complete: true, currentSrc: '/cached.png', naturalHeight: 20, naturalWidth: 40 });

      page.rootInstance.componentDidLoad();
      // A cached image can still fire its own load event afterwards.
      img.dispatchEvent(new Event('load'));

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy.mock.calls[0][0].detail).toEqual({ currentSrc: '/cached.png', naturalHeight: 20, naturalWidth: 40 });
    });

    it('decodes an already-complete image with no natural width to tell a broken image from a loaded one', async () => {
      const page = await newSpecPage({
        components: [PdsImage],
        html: `<pds-image src="/broken.png"></pds-image>`,
      });
      const loadSpy = jest.fn();
      const errorSpy = jest.fn();
      page.root.addEventListener('pdsImageLoad', loadSpy);
      page.root.addEventListener('pdsImageError', errorSpy);
      const img = page.root.shadowRoot.querySelector('img');
      setImageState(img, {
        complete: true,
        currentSrc: '/broken.png',
        decode: () => Promise.reject(new Error('EncodingError')),
        naturalWidth: 0,
      });

      page.rootInstance.componentDidLoad();
      await page.waitForChanges();

      expect(loadSpy).not.toHaveBeenCalled();
      expect(errorSpy).toHaveBeenCalledTimes(1);
      expect(errorSpy.mock.calls[0][0].detail).toEqual({ currentSrc: '/broken.png' });
    });

    it('decodes an already-complete image with no natural width and emits pdsImageLoad when it decodes', async () => {
      // An SVG with no intrinsic size reports no natural width but still decodes.
      const page = await newSpecPage({
        components: [PdsImage],
        html: `<pds-image src="/sizeless.svg"></pds-image>`,
      });
      const loadSpy = jest.fn();
      const errorSpy = jest.fn();
      page.root.addEventListener('pdsImageLoad', loadSpy);
      page.root.addEventListener('pdsImageError', errorSpy);
      const img = page.root.shadowRoot.querySelector('img');
      setImageState(img, {
        complete: true,
        currentSrc: '/sizeless.svg',
        decode: () => Promise.resolve(),
        naturalHeight: 0,
        naturalWidth: 0,
      });

      page.rootInstance.componentDidLoad();
      await page.waitForChanges();

      expect(errorSpy).not.toHaveBeenCalled();
      expect(loadSpy).toHaveBeenCalledTimes(1);
      expect(loadSpy.mock.calls[0][0].detail).toEqual({ currentSrc: '/sizeless.svg', naturalHeight: 0, naturalWidth: 0 });
    });

    it('drops a decode result once the source has changed', async () => {
      const page = await newSpecPage({
        components: [PdsImage],
        html: `<pds-image src="/old.png"></pds-image>`,
      });
      const loadSpy = jest.fn();
      const errorSpy = jest.fn();
      page.root.addEventListener('pdsImageLoad', loadSpy);
      page.root.addEventListener('pdsImageError', errorSpy);
      const img = page.root.shadowRoot.querySelector('img');
      let rejectDecode: () => void;
      setImageState(img, {
        complete: true,
        currentSrc: '/old.png',
        decode: () => new Promise<void>((_, reject) => (rejectDecode = () => reject(new Error('EncodingError')))),
        naturalWidth: 0,
      });

      page.rootInstance.componentDidLoad();
      setImageState(img, { currentSrc: '/new.png' });
      rejectDecode();
      await page.waitForChanges();

      expect(loadSpy).not.toHaveBeenCalled();
      expect(errorSpy).not.toHaveBeenCalled();
    });

    it('emits again after srcset changes, even for the same chosen file', async () => {
      const page = await newSpecPage({
        components: [PdsImage],
        html: `<pds-image src="/a.png" srcset="/a.png 1x"></pds-image>`,
      });
      const spy = jest.fn();
      page.root.addEventListener('pdsImageLoad', spy);
      const img = page.root.shadowRoot.querySelector('img');
      setImageState(img, { currentSrc: '/a.png', naturalHeight: 1, naturalWidth: 1 });
      img.dispatchEvent(new Event('load'));

      page.root.setAttribute('srcset', '/a.png 1x, /a-2x.png 2x');
      await page.waitForChanges();
      img.dispatchEvent(new Event('load'));

      expect(spy).toHaveBeenCalledTimes(2);
    });

    it('emits nothing on first render when the image has not finished loading', async () => {
      const page = await newSpecPage({
        components: [PdsImage],
        html: `<pds-image src="/slow.png"></pds-image>`,
      });
      const spy = jest.fn();
      page.root.addEventListener('pdsImageLoad', spy);
      const img = page.root.shadowRoot.querySelector('img');
      setImageState(img, { complete: false, currentSrc: '/slow.png', naturalWidth: 0 });

      page.rootInstance.componentDidLoad();

      expect(spy).not.toHaveBeenCalled();
    });

    it('emits again after src changes', async () => {
      const page = await newSpecPage({
        components: [PdsImage],
        html: `<pds-image src="/a.png"></pds-image>`,
      });
      const loadSpy = jest.fn();
      const errorSpy = jest.fn();
      page.root.addEventListener('pdsImageLoad', loadSpy);
      page.root.addEventListener('pdsImageError', errorSpy);
      const img = page.root.shadowRoot.querySelector('img');
      setImageState(img, { currentSrc: '/a.png', naturalHeight: 1, naturalWidth: 1 });
      img.dispatchEvent(new Event('load'));

      page.root.setAttribute('src', '/b.png');
      await page.waitForChanges();
      setImageState(img, { currentSrc: '/b.png' });
      img.dispatchEvent(new Event('error'));

      // Back to the first source, which loads again.
      page.root.setAttribute('src', '/a.png');
      await page.waitForChanges();
      setImageState(img, { currentSrc: '/a.png' });
      img.dispatchEvent(new Event('load'));

      expect(loadSpy).toHaveBeenCalledTimes(2);
      expect(errorSpy).toHaveBeenCalledTimes(1);
    });
  });
});
