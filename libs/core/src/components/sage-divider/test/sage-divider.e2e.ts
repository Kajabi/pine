import { newE2EPage } from '@stencil/core/testing';

describe('sage-divider', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sage-divider></sage-divider>');

    const element = await page.find('sage-divider');
    expect(element).toHaveClass('hydrated');
  });
});
