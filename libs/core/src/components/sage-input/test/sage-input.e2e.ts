import { newE2EPage } from '@stencil/core/testing';

describe('sage-input', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<sage-input></sage-input>');
    const element = await page.find('sage-link');
    expect(element).toHaveClass('hydrated');
  });
});
