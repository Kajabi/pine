import { newE2EPage } from '@stencil/core/testing';

describe('pds-image', () => {
  it('should properly lazy load an image', async () => {
    const page = await newE2EPage();
    page.setViewport({
      width: 600,
      height: 300
    });
    await page.setContent(`
      <div style="height: 3000px; border: 1px solid red;"></div>
      <pds-image loading="lazy" height="300" width="200" src="https://placebear.com/200/300"></pds-image>
    `, { waitUntil: 'load'});

    const img = page.find('pds-image >>> img');

    expect(await (await img)?.isIntersectingViewport()).toBeFalsy();

    await page.evaluate(() => window.scrollBy(0, document.body.scrollHeight));

    expect(await (await img)?.isIntersectingViewport()).toBeTruthy();
  })
});
