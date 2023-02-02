import { newE2EPage } from '@stencil/core/testing';

describe('sage-tabs', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sage-tabs></sage-tabs>');

    const element = await page.find('sage-tabs');
    expect(element).toHaveClass('hydrated');
  });
});
