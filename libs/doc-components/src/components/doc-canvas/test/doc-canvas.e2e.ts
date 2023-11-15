import { newE2EPage } from '@stencil/core/testing';

describe('doc-canvas', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<doc-canvas></doc-canvas>');

    const element = await page.find('doc-canvas');
    expect(element).toHaveClass('hydrated');
  });
});
