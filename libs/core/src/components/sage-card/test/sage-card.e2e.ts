import { newE2EPage } from '@stencil/core/testing';

describe('sage-card', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sage-card></sage-card>');

    const element = await page.find('sage-card');
    expect(element).toHaveClass('hydrated');
  });
});
