import { newE2EPage } from '@stencil/core/testing';

describe('sage-image', () => {
  it('should properly lazy load an image', async () => {
    const page = await newE2EPage();
    page.setViewport({
      width: 640,
      height: 500
    }); 
    await page.setContent(`
      <div style="height: 2000px; border: 1px solid red;"></div>
      <sage-image loading="lazy" src="//source.unsplash.com/320x180"></sage-image>
    `, { waitUntil: 'load'});
    
    let isImageLoaded = await page.evaluate(() => document.querySelector('sage-image')?.shadowRoot?.querySelector('img')?.complete);
    await page.waitForTimeout(2000);
    
    expect(isImageLoaded).toBe(false);
    
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);
    isImageLoaded = await page.evaluate(() => document.querySelector('sage-image')?.shadowRoot?.querySelector('img')?.complete);

    expect(isImageLoaded).toBe(true);
  })
});
