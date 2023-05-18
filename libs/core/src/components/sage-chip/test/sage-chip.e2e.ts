import { newE2EPage } from '@stencil/core/testing';

describe('sage-chip', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sage-chip></sage-chip>');

    const element = await page.find('sage-chip');
    expect(element).toHaveClass('hydrated');
  });
});
