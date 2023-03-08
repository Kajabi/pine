import { newE2EPage } from '@stencil/core/testing';

describe('sage-tabpanel', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sage-tabpanel></sage-tabpanel>');

    const element = await page.find('sage-tabpanel');
    expect(element).toHaveClass('hydrated');
  });
});
