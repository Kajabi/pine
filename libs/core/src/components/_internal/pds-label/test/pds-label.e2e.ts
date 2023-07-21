import { newE2EPage } from '@stencil/core/testing';

describe('pds-label', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-label></pds-label>');

    const element = await page.find('pds-label');
    expect(element).toHaveClass('hydrated');
  });
});