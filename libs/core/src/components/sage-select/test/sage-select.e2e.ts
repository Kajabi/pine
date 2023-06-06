import { newE2EPage } from '@stencil/core/testing';

describe('sage-select', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sage-select></sage-select>');

    const element = await page.find('sage-select');
    expect(element).toHaveClass('hydrated');
  });
});
