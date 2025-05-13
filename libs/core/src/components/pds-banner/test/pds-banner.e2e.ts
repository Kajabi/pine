import { newE2EPage } from '@stencil/core/testing';

describe('pds-banner', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-banner></pds-banner>');

    const element = await page.find('pds-banner');
    expect(element).toHaveClass('hydrated');
  });
});
