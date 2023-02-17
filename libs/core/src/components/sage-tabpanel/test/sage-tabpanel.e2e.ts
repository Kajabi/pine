import { newE2EPage } from '@stencil/core/testing';

describe('sage-tab-panel', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sage-tab-panel></sage-tab-panel>');

    const element = await page.find('sage-tab-panel');
    expect(element).toHaveClass('hydrated');
  });
});
