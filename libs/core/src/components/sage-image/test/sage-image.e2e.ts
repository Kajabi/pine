import { newE2EPage } from '@stencil/core/testing';

describe('sage-image', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sage-image></sage-image>');

    const element = await page.find('sage-image');
    expect(element).toHaveClass('hydrated');
  });
});
