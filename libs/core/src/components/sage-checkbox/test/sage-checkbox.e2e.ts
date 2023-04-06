import { newE2EPage } from '@stencil/core/testing';

describe('sage-checkbox', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sage-checkbox />');

    const element = await page.find('sage-checkbox');
    expect(element).toHaveClass('hydrated');
  });
});
