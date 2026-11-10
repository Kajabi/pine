import { newE2EPage } from '@stencil/core/testing';
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
