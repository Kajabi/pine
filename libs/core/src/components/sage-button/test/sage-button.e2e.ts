import { newE2EPage } from '@stencil/core/testing';

describe('sage-button', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sage-button></sage-button>');

    const element = await page.find('sage-button');
    expect(element).toHaveClass('hydrated');
  });
});
