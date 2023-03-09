import { newE2EPage } from '@stencil/core/testing';

describe('sage-tab', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sage-tab></sage-tab>');

    const element = await page.find('sage-tab');
    expect(element).toHaveClass('hydrated');
  });
});
