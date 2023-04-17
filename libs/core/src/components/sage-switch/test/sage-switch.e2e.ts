import { newE2EPage } from '@stencil/core/testing';

describe('sage-switch', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sage-switch></sage-switch>');

    const element = await page.find('sage-switch');
    expect(element).toHaveClass('hydrated');
  });
});
