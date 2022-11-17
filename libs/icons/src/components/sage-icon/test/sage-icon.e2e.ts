import { newE2EPage } from '@stencil/core/testing';

describe('sage-icon', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<sage-icon role="img" style="height: 16px; width: 16px;"></sage-icon>');
    const element = await page.find('sage-icon');
    expect(element).toHaveClass('hydrated');
  });
});
