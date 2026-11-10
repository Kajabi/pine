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
