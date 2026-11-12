import { E2EPage, newE2EPage } from '@stencil/core/testing';
import { formatViolations, runAxe } from '../../../utils/test/axe';

describe('pds-image', () => {
  it('should properly lazy load an image', async () => {
    const page = await newE2EPage();
    page.setViewport({
      width: 600,
      height: 300,
    });
    await page.setContent(
      `
      <div style="height: 3000px; border: 1px solid red;"></div>
      <pds-image loading="lazy" height="300" width="200" src="https://placebear.com/200/300"></pds-image>
    `,
      { waitUntil: 'load' },
    );

    const img = page.find('pds-image >>> img');

    expect(await (await img)?.isIntersectingViewport()).toBeFalsy();

    await page.evaluate(() => window.scrollBy(0, document.body.scrollHeight));

    expect(await (await img)?.isIntersectingViewport()).toBeTruthy();
  });

  it('crops a portrait source to the shape set by ratio', async () => {
    const page = await newE2EPage();
    page.setViewport({
      width: 600,
      height: 300,
    });
    // A portrait source in a landscape shape is the case the ratio exists for:
    // the box takes the ratio and the overflow is cropped rather than squashed.
    await page.setContent('<pds-image ratio="wide" src="/photo.jpg" alt="A scenic mountain view"></pds-image>');

    const style = await page.evaluate(() => {
      const img = document.querySelector('pds-image')?.shadowRoot?.querySelector('img');
      const computed = window.getComputedStyle(img as Element);

      return { aspectRatio: computed.aspectRatio, objectFit: computed.objectFit };
    });

    expect(style.aspectRatio).toBe('16 / 9');
    expect(style.objectFit).toBe('cover');
  });

  it('crops a ratio set through the custom property, not just through the prop', async () => {
    const page = await newE2EPage();
    // The custom property predates the `ratio` prop, and on its own it used to
    // stretch the image. Anything already using it should crop now too.
    await page.setContent(
      '<pds-image src="/photo.jpg" alt="A scenic mountain view" style="--dimension-aspect-ratio: 16 / 9"></pds-image>',
    );

    const style = await page.evaluate(() => {
      const img = document.querySelector('pds-image')?.shadowRoot?.querySelector('img');
      const computed = window.getComputedStyle(img as Element);

      return { aspectRatio: computed.aspectRatio, objectFit: computed.objectFit };
    });

    expect(style.aspectRatio).toBe('16 / 9');
    expect(style.objectFit).toBe('cover');
  });

  it('keeps the source proportions when height and width disagree with them', async () => {
    const page = await newE2EPage();
    page.setViewport({ width: 600, height: 600 });
    // `height` and `width` do not set a shape to crop to: once the image loads, `height: auto`
    // lets its own proportions decide the height. A square source given a 400 x 100 box loads
    // square. This only verifies the loaded state; `width` (not `height`) is what the browser
    // holds space with before load, since `height: auto` applies from the first render.
    const square = 'data:image/svg+xml,' + encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100"/></svg>',
    );
    await page.setContent(
      `<pds-image height="100" width="400" src="${square}" alt="A square"></pds-image>`,
      { waitUntil: 'load' },
    );
    await page.waitForFunction(() => {
      const img = document.querySelector('pds-image')?.shadowRoot?.querySelector('img');
      return img?.complete && img.naturalWidth > 0;
    });

    const box = await page.evaluate(() => {
      const img = document.querySelector('pds-image')?.shadowRoot?.querySelector('img') as HTMLImageElement;
      const rect = img.getBoundingClientRect();

      return { width: Math.round(rect.width), height: Math.round(rect.height) };
    });

    expect(box).toEqual({ width: 400, height: 400 });
  });

  it('fits the whole source inside the shape when fit is contain', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-image fit="contain" ratio="square" src="/photo.jpg" alt="A scenic mountain view"></pds-image>');

    const style = await page.evaluate(() => {
      const img = document.querySelector('pds-image')?.shadowRoot?.querySelector('img');
      const computed = window.getComputedStyle(img as Element);

      return { aspectRatio: computed.aspectRatio, objectFit: computed.objectFit };
    });

    expect(style.aspectRatio).toBe('1 / 1');
    expect(style.objectFit).toBe('contain');
  });
});

describe('pds-image events', () => {
  type ImageEvent = { type: string; detail: unknown };

  const svg = (width: number, height: number) =>
    'data:image/svg+xml,' +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="${width}" height="${height}"/></svg>`,
    );
  // A data URL that is not an image, so it fails to decode without a network request.
  const broken = 'data:image/png;base64,bm90LWFuLWltYWdl';

  // `setContent` navigates, which drops any listener added before it, and the image can
  // settle before a listener added after it. So the image is created here, with its
  // listeners already attached, and every event it emits is recorded on `window`.
  // With `preload`, the source is loaded first, so the browser has it in its memory
  // cache and the component's image reports `complete` as soon as it renders.
  const renderImage = async (page: E2EPage, src: string, { preload = false } = {}) => {
    await page.setContent('<div></div>');
    await page.evaluate(
      async (imageSrc, shouldPreload) => {
        if (shouldPreload) {
          await new Promise<void>((resolve) => {
            const preloaded = new Image();
            preloaded.onload = () => resolve();
            preloaded.src = imageSrc;
          });
        }

        const events: ImageEvent[] = [];
        (window as unknown as { imageEvents: ImageEvent[] }).imageEvents = events;
        const image = document.createElement('pds-image');
        const record = (event: CustomEvent) => events.push({ type: event.type, detail: event.detail });
        image.addEventListener('pdsImageLoad', record);
        image.addEventListener('pdsImageError', record);
        image.setAttribute('alt', 'A shape');
        image.setAttribute('src', imageSrc);
        document.body.appendChild(image);
      },
      src,
      preload,
    );
  };

  // Waits for `count` events, then a little longer so a duplicate has the chance to arrive.
  const imageEvents = async (page: E2EPage, count: number): Promise<ImageEvent[]> => {
    await page.waitForFunction(
      (expected) => (window as unknown as { imageEvents: ImageEvent[] }).imageEvents.length >= expected,
      {},
      count,
    );
    await new Promise((resolve) => setTimeout(resolve, 100));

    return page.evaluate(() => (window as unknown as { imageEvents: ImageEvent[] }).imageEvents);
  };

  const setSrc = (page: E2EPage, src: string) =>
    page.evaluate((imageSrc) => document.querySelector('pds-image').setAttribute('src', imageSrc), src);

  it('emits pdsImageLoad with the natural size and source once the image loads', async () => {
    const page = await newE2EPage();
    const src = svg(120, 80);

    await renderImage(page, src);

    expect(await imageEvents(page, 1)).toEqual([
      { type: 'pdsImageLoad', detail: { currentSrc: src, naturalHeight: 80, naturalWidth: 120 } },
    ]);
  });

  it('emits pdsImageError when the src fails to load', async () => {
    const page = await newE2EPage();

    await renderImage(page, broken);

    expect(await imageEvents(page, 1)).toEqual([{ type: 'pdsImageError', detail: { currentSrc: broken } }]);
  });

  it('emits pdsImageLoad only once for a cached image that is complete on first render', async () => {
    // A memory-cached image reports `complete` on first render, which emits the event,
    // and then still fires its own native `load` event, which must not emit it again.
    const page = await newE2EPage();
    const src = svg(40, 20);

    await renderImage(page, src, { preload: true });

    expect(await imageEvents(page, 1)).toEqual([
      { type: 'pdsImageLoad', detail: { currentSrc: src, naturalHeight: 20, naturalWidth: 40 } },
    ]);
  });

  it('emits again after src changes', async () => {
    const page = await newE2EPage();
    const first = svg(10, 10);
    const second = svg(30, 10);

    await renderImage(page, first);
    await imageEvents(page, 1);
    await setSrc(page, broken);
    await imageEvents(page, 2);
    await setSrc(page, second);

    expect(await imageEvents(page, 3)).toEqual([
      { type: 'pdsImageLoad', detail: { currentSrc: first, naturalHeight: 10, naturalWidth: 10 } },
      { type: 'pdsImageError', detail: { currentSrc: broken } },
      { type: 'pdsImageLoad', detail: { currentSrc: second, naturalHeight: 10, naturalWidth: 30 } },
    ]);
  });
});

describe('pds-image accessibility', () => {
  it('has no axe violations', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-image src="/photo.jpg" alt="A scenic mountain view"></pds-image>');
    const violations = await runAxe(page);
    expect(formatViolations(violations)).toBe('');
  });

  it('has no axe violations when cropped to a ratio', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-image fit="cover" ratio="wide" src="/photo.jpg" alt="A scenic mountain view"></pds-image>');
    const violations = await runAxe(page);
    expect(formatViolations(violations)).toBe('');
  });
});
