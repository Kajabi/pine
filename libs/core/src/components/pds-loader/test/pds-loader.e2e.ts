import { newE2EPage } from '@stencil/core/testing';

describe('pds-loader', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-loader></pds-loader>');

    const element = await page.find('pds-loader');
    expect(element).toHaveClass('hydrated');
  });
});
